import React, { useRef, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import {
  addAnnotation,
  updateAnnotation,
  setSelectedAnnotation,
} from './annotationsSlice';
import type {
  ToolType,
  Annotation,
} from './annotationsSlice';
import type { RootState } from '../../store/store';

interface Props {
  currentTime: number;
  playing: boolean;
}

const AnnotationsCanvas: React.FC<Props> = ({ currentTime, playing }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch();
  const { annotations, selectedTool, selectedAnnotationId } = useSelector(
    (state: RootState) => state.annotations
  );
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState<{ x: number; y: number } | null>(null);
  const [currentAnnotation, setCurrentAnnotation] = useState<Annotation | null>(null);

  // Drawing logic
  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (playing) return;
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (selectedTool === 'circle' || selectedTool === 'rectangle' || selectedTool === 'line') {
      setIsDrawing(true);
      setStartPos({ x, y });
      setCurrentAnnotation({
        id: Date.now().toString(),
        type: selectedTool,
        x,
        y,
        width: 0,
        height: 0,
        timestamp: currentTime,
        duration: 3,
        color: '#0d6efd',
      });
    } else if (selectedTool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        dispatch(
          addAnnotation({
            id: Date.now().toString(),
            type: 'text',
            x,
            y,
            text,
            timestamp: currentTime,
            duration: 3,
            color: '#0d6efd',
          })
        );
      }
    } else if (selectedTool === 'select') {
      // Hit test for selection
      const found = annotations.find(
        ann =>
          x >= ann.x &&
          y >= ann.y &&
          (ann.width ? x <= ann.x + ann.width : true) &&
          (ann.height ? y <= ann.y + ann.height : true)
      );
      dispatch(setSelectedAnnotation(found ? found.id : null));
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAnnotation || !canvasRef.current || !startPos) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const updated = { ...currentAnnotation };

    if (currentAnnotation.type === 'rectangle' || currentAnnotation.type === 'circle') {
      updated.width = x - startPos.x;
      updated.height = y - startPos.y;
    } else if (currentAnnotation.type === 'line') {
      updated.width = x - startPos.x;
      updated.height = y - startPos.y;
    }
    setCurrentAnnotation(updated);
  };

  const handleMouseUp = () => {
    if (isDrawing && currentAnnotation) {
      dispatch(addAnnotation(currentAnnotation));
      setIsDrawing(false);
      setCurrentAnnotation(null);
      setStartPos(null);
    }
  };

  // Draw annotations
  useEffect(() => {
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
          ctx.font = '16px Arial';
          ctx.fillStyle = ann.color;
          ctx.globalAlpha = 1;
          ctx.fillText(ann.text, ann.x, ann.y);
        }
        // Selection indicator
        if (ann.id === selectedAnnotationId) {
          ctx.setLineDash([4, 2]);
          ctx.strokeStyle = '#ff0';
          ctx.lineWidth = 2;
          ctx.strokeRect(ann.x - 4, ann.y - 4, (ann.width || 0) + 8, (ann.height || 0) + 8);
          ctx.setLineDash([]);
        }
        ctx.restore();
      }
    });

    // Draw preview
    if (isDrawing && currentAnnotation) {
      ctx.save();
      ctx.strokeStyle = '#0d6efd';
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