import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/hooks';
import {
  addAnnotationAsync,
  setSelectedAnnotation,
  updateAnnotation,
  setSelectedTool,
  updateAnnotationAsync,
} from './annotationsSlice';
import type { Annotation } from './annotationsSlice';
import type { RootState } from '../../store/store';

interface Props {
  currentTime: number;
  playing: boolean;
}

const DEFAULT_COLOR = '#FD510D';

const AnnotationsCanvas: React.FC<Props> = ({ currentTime, playing }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useAppDispatch();
  const { annotations, selectedTool, selectedAnnotationId } = useSelector(
    (state: RootState) => state.annotations
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentAnnotation, setCurrentAnnotation] = useState<Omit<Annotation, 'id'> | null>(null);

  // Drag-to-move state
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ dx: number; dy: number } | null>(null);

  // Drawing or drag logic
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (playing) return;

    if (selectedTool === 'circle' || selectedTool === 'rectangle' || selectedTool === 'line') {
      setIsDrawing(true);
      setStartPos({ x, y });
      setCurrentAnnotation({
        type: selectedTool,
        x,
        y,
        width: 0,
        height: 0,
        timestamp: currentTime,
        duration: 3,
        color: DEFAULT_COLOR,
      });
    } else if (selectedTool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        dispatch(
          addAnnotationAsync({
            type: 'text',
            x,
            y,
            text,
            timestamp: currentTime,
            duration: 3,
            color: DEFAULT_COLOR,
          })
        );
      }
    } else if (selectedTool === 'select') {
      // Hit test for selection & drag
      const hitTest = (ann: Annotation, px: number, py: number) => {
        if (ann.type === 'rectangle') {
          return (
            px >= ann.x &&
            py >= ann.y &&
            px <= ann.x + (ann.width || 0) &&
            py <= ann.y + (ann.height || 0)
          );
        }
        if (ann.type === 'circle') {
          const cx = ann.x + (ann.width || 0) / 2;
          const cy = ann.y + (ann.height || 0) / 2;
          const rx = Math.abs((ann.width || 0) / 2);
          const ry = Math.abs((ann.height || 0) / 2);
          if (rx === 0 || ry === 0) return false;
          // Ellipse equation: ((x-cx)/rx)^2 + ((y-cy)/ry)^2 <= 1
          return (
            Math.pow((px - cx) / rx, 2) + Math.pow((py - cy) / ry, 2) <= 1
          );
        }
        if (ann.type === 'line') {
          // Simple line proximity check
          const x1 = ann.x;
          const y1 = ann.y;
          const x2 = ann.x + (ann.width || 0);
          const y2 = ann.y + (ann.height || 0);
          const dist =
            Math.abs(
              (y2 - y1) * px -
              (x2 - x1) * py +
              x2 * y1 -
              y2 * x1
            ) /
            Math.sqrt(Math.pow(y2 - y1, 2) + Math.pow(x2 - x1, 2));
          return dist < 6;
        }
        if (ann.type === 'text') {
          const canvas = canvasRef.current;
          if (!canvas) return false;
          const ctx = canvas.getContext('2d');
          if (!ctx) return false;
          ctx.font = '16px Arial';
          const text = ann.text || '';
          const width = ctx.measureText(text).width;
          const height = 20;
          return (
            px >= ann.x &&
            py >= ann.y - height &&
            px <= ann.x + width &&
            py <= ann.y
          );
        }
      };

      const found = annotations.find(ann => hitTest(ann, x, y));
      if (found) {
        dispatch(setSelectedAnnotation(found.id));
        setDragOffset({ dx: x - found.x, dy: y - found.y });
        setIsDragging(true);
      } else {
        dispatch(setSelectedAnnotation(null));
      }
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Drag-to-move
    if (isDragging && selectedAnnotationId && dragOffset) {
      const ann = annotations.find(a => a.id === selectedAnnotationId);
      if (ann) {
        const newX = x - dragOffset.dx;
        const newY = y - dragOffset.dy;
        dispatch(updateAnnotation({ ...ann, x: newX, y: newY }));
      }
      return;
    }

    // Drawing
    if (isDrawing && currentAnnotation && startPos) {
      const updated = { ...currentAnnotation };
      if (
        currentAnnotation.type === 'rectangle' ||
        currentAnnotation.type === 'circle' ||
        currentAnnotation.type === 'line'
      ) {
        updated.width = x - startPos.x;
        updated.height = y - startPos.y;
      }
      setCurrentAnnotation(updated);
    }
  };

  const handleMouseUp = () => {
    if (isDrawing && currentAnnotation) {
      dispatch(addAnnotationAsync(currentAnnotation));
      setIsDrawing(false);
      setCurrentAnnotation(null);
      setStartPos(null);
      dispatch(setSelectedTool('select'));
    }
    if (isDragging && selectedAnnotationId) {
      const ann = annotations.find(a => a.id === selectedAnnotationId);
      if (ann) {
        dispatch(updateAnnotationAsync(ann));
      }
      setIsDragging(false);
      setDragOffset(null);
    }
  };

  // Performance: requestAnimationFrame drawing loop
  const animationFrameRef = useRef<number | null>(null);
  const drawCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    annotations.forEach(ann => {
      if (
        currentTime >= ann.timestamp &&
        currentTime <= ann.timestamp + (ann.duration || 3)
      ) {
        ctx.save();
        ctx.strokeStyle = ann.color;
        ctx.lineWidth = 4;
        ctx.globalAlpha = 0.7;
        if (ann.type === 'rectangle') {
          ctx.strokeRect(ann.x, ann.y, ann.width || 0, ann.height || 0);
        } else if (ann.type === 'circle') {
          ctx.beginPath();
          ctx.ellipse(
            ann.x + (ann.width || 0) / 2,
            ann.y + (ann.height || 0) / 2,
            Math.abs((ann.width || 0) / 2),
            Math.abs((ann.height || 0) / 2),
            0,
            0,
            2 * Math.PI
          );
          ctx.stroke();
        } else if (ann.type === 'line') {
          ctx.beginPath();
          ctx.moveTo(ann.x, ann.y);
          ctx.lineTo(ann.x + (ann.width || 0), ann.y + (ann.height || 0));
          ctx.stroke();
        } else if (ann.type === 'text' && ann.text) {
          ctx.font = '24px Arial';
          ctx.fillStyle = ann.color;
          ctx.globalAlpha = 1;
          ctx.fillText(ann.text, ann.x, ann.y);
        }
        // Selection indicator
        if (ann.id === selectedAnnotationId) {
          ctx.setLineDash([4, 2]);
          ctx.strokeStyle = '#ff0';
          ctx.lineWidth = 4;
          if (ann.type === 'text' && ann.text) {
            ctx.font = '24px Arial';
            const textWidth = ctx.measureText(ann.text).width;
            const textHeight = 20;
            ctx.strokeRect(ann.x - 4, ann.y - textHeight - 4, textWidth + 8, textHeight + 8);
          } else {
            ctx.strokeRect(ann.x - 4, ann.y - 4, (ann.width || 0) + 8, (ann.height || 0) + 8);
          } ctx.setLineDash([]);
        }
        ctx.restore();
      }
    });

    // Draw preview
    if (isDrawing && currentAnnotation) {
      ctx.save();
      ctx.strokeStyle = '#0d6efd';
      ctx.lineWidth = 4;

      ctx.globalAlpha = 0.5;
      if (currentAnnotation.type === 'rectangle') {
        ctx.strokeRect(currentAnnotation.x, currentAnnotation.y, currentAnnotation.width || 0, currentAnnotation.height || 0);
      } else if (currentAnnotation.type === 'circle') {
        ctx.beginPath();
        ctx.ellipse(
          currentAnnotation.x + (currentAnnotation.width || 0) / 2,
          currentAnnotation.y + (currentAnnotation.height || 0) / 2,
          Math.abs((currentAnnotation.width || 0) / 2),
          Math.abs((currentAnnotation.height || 0) / 2),
          0,
          0,
          2 * Math.PI
        );
        ctx.stroke();
      } else if (currentAnnotation.type === 'line') {
        ctx.beginPath();
        ctx.moveTo(currentAnnotation.x, currentAnnotation.y);
        ctx.lineTo(currentAnnotation.x + (currentAnnotation.width || 0), currentAnnotation.y + (currentAnnotation.height || 0));
        ctx.stroke();
      }
      ctx.restore();
    }
  };

  useEffect(() => {
    function loop() {
      drawCanvas();
      animationFrameRef.current = requestAnimationFrame(loop);
    }
    loop();
    return () => {
      if (animationFrameRef.current !== null) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
    // Only re-run if these change
    // eslint-disable-next-line
  }, [annotations, currentTime, isDrawing, currentAnnotation, selectedAnnotationId]);

  // Resize canvas to fit parent
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const resize = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };
    resize();
    window.addEventListener('resize', resize);
    return () => window.removeEventListener('resize', resize);
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="annotation-layer"
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        pointerEvents: 'auto',
        width: '100%',
        height: '100%',
      }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default AnnotationsCanvas;