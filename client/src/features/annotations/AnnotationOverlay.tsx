import React, { useRef, useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import { useAppDispatch } from '../../store/hooks';
import {
  addAnnotationAsync,
  setSelectedAnnotation,
  deleteAnnotationAsync,
  updateAnnotationAsync,
  updateAnnotation,
} from './annotationsSlice';

import type { ToolType, Annotation } from './annotationsSlice';

interface Props {
  tool: ToolType;
  videoTime: number;
  isPaused: boolean;
}

const AnnotationOverlay: React.FC<Props> = ({ tool, videoTime, isPaused }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useAppDispatch();

  const annotations = useSelector((state: RootState) => state.annotations.annotations);
  const selectedId = useSelector((state: RootState) => state.annotations.selectedAnnotationId);

  const [drawing, setDrawing] = useState<Omit<Annotation, 'id'> | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState<{ dx: number; dy: number } | null>(null);

  // Resize canvas to fit parent
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const resizeCanvas = () => {
      const parent = canvas.parentElement;
      if (parent) {
        canvas.width = parent.clientWidth;
        canvas.height = parent.clientHeight;
      }
    };

    resizeCanvas();
    window.addEventListener('resize', resizeCanvas);
    return () => window.removeEventListener('resize', resizeCanvas);
  }, []);

  // Drag-to-move logic using window events
  useEffect(() => {
    if (!isDragging) return;

    const handleWindowMouseMove = (e: MouseEvent) => {
      if (!isDragging || !dragOffset || !selectedId) return;
      const canvas = canvasRef.current;
      if (!canvas) return;
      const rect = canvas.getBoundingClientRect();
      const x = e.clientX - rect.left;
      const y = e.clientY - rect.top;
      const ann = annotations.find(a => a.id === selectedId);
      if (ann) {
        const newX = x - dragOffset.dx;
        const newY = y - dragOffset.dy;
        // Local update for smooth drag
        dispatch(updateAnnotation({ ...ann, x: newX, y: newY }));
      }
    };

    const handleWindowMouseUp = () => {
      if (isDragging && dragOffset && selectedId) {
        const ann = annotations.find(a => a.id === selectedId);
        if (ann) {
          // Sync with backend on drag end
          dispatch(updateAnnotationAsync(ann));
        }
      }
      setIsDragging(false);
      setDragOffset(null);
    };

    window.addEventListener('mousemove', handleWindowMouseMove);
    window.addEventListener('mouseup', handleWindowMouseUp);

    return () => {
      window.removeEventListener('mousemove', handleWindowMouseMove);
      window.removeEventListener('mouseup', handleWindowMouseUp);
    };
  }, [isDragging, dragOffset, selectedId, annotations, dispatch]);

  // Keyboard delete
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Delete' && selectedId) {
        dispatch(deleteAnnotationAsync(selectedId));
        dispatch(setSelectedAnnotation(null));
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId, dispatch]);

  // Drawing and selection logic
  const handleMouseDown = (e: React.MouseEvent) => {
    if (!isPaused || tool === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (tool === 'select') {
      const clicked = annotations.find(
        (ann) =>
          x >= ann.x &&
          y >= ann.y &&
          x <= ann.x + (ann.width || 0) &&
          y <= ann.y + (ann.height || 0)
      );
      if (clicked) {
        dispatch(setSelectedAnnotation(clicked.id));
        setDragOffset({ dx: x - clicked.x, dy: y - clicked.y });
        setIsDragging(true);
      } else {
        dispatch(setSelectedAnnotation(null));
      }
      return;
    }

    // For text tool, prompt for text immediately
    if (tool === 'text') {
      const text = prompt('Enter text:');
      if (text) {
        dispatch(
          addAnnotationAsync({
            type: 'text',
            x,
            y,
            text,
            timestamp: videoTime,
            duration: 3,
            color: '#ff0000',
          })
        );
      }
      return;
    }

    // For shape tools, start drawing
    const newAnn: Omit<Annotation, 'id'> = {
      type: tool,
      x,
      y,
      timestamp: videoTime,
      duration: 3,
      width: 0,
      height: 0,
      color: '#ff0000',
    };
    setDrawing(newAnn);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Drawing new annotation
    if (drawing) {
      setDrawing({ ...drawing, width: x - drawing.x, height: y - drawing.y });
    }
  };

  const handleMouseUp = () => {
    if (drawing) {
      dispatch(addAnnotationAsync(drawing));
      setDrawing(null);
    }
    // Drag end handled by window mouseup
  };

  // Drawing annotations on canvas
  const drawAnnotation = (
    ctx: CanvasRenderingContext2D,
    ann: Annotation | Omit<Annotation, 'id'>,
    isSelected = false
  ) => {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = isSelected ? '#0d6efd' : (ann.color || 'red');

    switch (ann.type) {
      case 'rectangle':
        ctx.strokeRect(ann.x, ann.y, ann.width || 0, ann.height || 0);
        break;
      case 'circle':
        const radius = Math.sqrt((ann.width || 0) ** 2 + (ann.height || 0) ** 2);
        ctx.arc(ann.x, ann.y, radius, 0, Math.PI * 2);
        ctx.stroke();
        break;
      case 'line':
        ctx.moveTo(ann.x, ann.y);
        ctx.lineTo(ann.x + (ann.width || 0), ann.y + (ann.height || 0));
        ctx.stroke();
        break;
      case 'text':
        ctx.font = '16px sans-serif';
        ctx.fillStyle = ann.color || 'yellow';
        ctx.fillText((ann as any).text || 'Text', ann.x, ann.y);
        break;
    }

    if (isSelected) {
      ctx.setLineDash([4, 2]);
      ctx.strokeRect(ann.x - 5, ann.y - 5, (ann.width || 20) + 10, (ann.height || 20) + 10);
      ctx.setLineDash([]);
    }
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    annotations
      .filter((ann) => Math.abs(ann.timestamp - videoTime) < (ann.duration || 3))
      .forEach((ann) => drawAnnotation(ctx, ann, ann.id === selectedId));

    if (drawing) drawAnnotation(ctx, drawing);
  }, [annotations, drawing, videoTime, selectedId]);

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full"
      style={{ pointerEvents: tool !== 'none' ? 'auto' : 'none' }}
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
    />
  );
};

export default AnnotationOverlay;