// import React, { useRef, useState, useEffect } from 'react';

// type ToolType = 'select' | 'circle' | 'rectangle' | 'line' | 'text';

// interface Annotation {
//   id: number;
//   type: ToolType;
//   x: number;
//   y: number;
//   width?: number;
//   height?: number;
//   text?: string;
//   timestamp: number;
//   duration?: number;
// }

// interface Props {
//   tool: ToolType;
//   videoTime: number;
//   isPaused: boolean;
// }

// const AnnotationOverlay: React.FC<Props> = ({ tool, videoTime, isPaused }) => {
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [annotations, setAnnotations] = useState<Annotation[]>([]);
//   const [drawing, setDrawing] = useState<Annotation | null>(null);
//   const [selectedId, setSelectedId] = useState<number | null>(null);
//   const [dragOffset, setDragOffset] = useState<{ dx: number; dy: number } | null>(null);

//   const handleMouseDown = (e: React.MouseEvent) => {
//     const canvas = canvasRef.current;
//     if (!canvas || !isPaused) return;
//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     if (tool === 'select') {
//       const clicked = annotations.find(
//         (ann) =>
//           x >= ann.x &&
//           y >= ann.y &&
//           x <= ann.x + (ann.width || 0) &&
//           y <= ann.y + (ann.height || 0)
//       );
//       if (clicked) {
//         setSelectedId(clicked.id);
//         setDragOffset({ dx: x - clicked.x, dy: y - clicked.y });
//       } else {
//         setSelectedId(null);
//       }
//       return;
//     }

//     // Drawing tools
//     const newAnn: Annotation = {
//       id: Date.now(),
//       type: tool,
//       x,
//       y,
//       timestamp: videoTime,
//     };
//     setDrawing(newAnn);
//   };

//   const handleMouseMove = (e: React.MouseEvent) => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     // Dragging
//     if (tool === 'select' && selectedId !== null && dragOffset) {
//       setAnnotations((prev) =>
//         prev.map((ann) =>
//           ann.id === selectedId
//             ? { ...ann, x: x - dragOffset.dx, y: y - dragOffset.dy }
//             : ann
//         )
//       );
//       return;
//     }

//     // Drawing
//     if (drawing) {
//       setDrawing({
//         ...drawing,
//         width: x - drawing.x,
//         height: y - drawing.y,
//       });
//     }
//   };

//   const handleMouseUp = () => {
//     if (drawing) {
//       setAnnotations((prev) => [...prev, drawing]);
//       setDrawing(null);
//     }
//     setDragOffset(null);
//   };

//   const handleKeyDown = (e: KeyboardEvent) => {
//     if (e.key === 'Delete' && selectedId !== null) {
//       setAnnotations((prev) => prev.filter((ann) => ann.id !== selectedId));
//       setSelectedId(null);
//     }
//   };

//   const drawAnnotation = (
//     ctx: CanvasRenderingContext2D,
//     ann: Annotation,
//     isSelected = false
//   ) => {
//     ctx.beginPath();
//     ctx.lineWidth = 2;
//     ctx.strokeStyle = isSelected ? '#0d6efd' : 'red';

//     switch (ann.type) {
//       case 'rectangle':
//         ctx.strokeRect(ann.x, ann.y, ann.width || 0, ann.height || 0);
//         break;
//       case 'circle':
//         const radius = Math.sqrt((ann.width || 0) ** 2 + (ann.height || 0) ** 2);
//         ctx.arc(ann.x, ann.y, radius, 0, Math.PI * 2);
//         ctx.stroke();
//         break;
//       case 'line':
//         ctx.moveTo(ann.x, ann.y);
//         ctx.lineTo(ann.x + (ann.width || 0), ann.y + (ann.height || 0));
//         ctx.stroke();
//         break;
//       case 'text':
//         ctx.font = '16px sans-serif';
//         ctx.fillStyle = 'yellow';
//         ctx.fillText(ann.text || 'Text', ann.x, ann.y);
//         break;
//     }

//     if (isSelected) {
//       ctx.setLineDash([4, 2]);
//       ctx.strokeRect(ann.x - 5, ann.y - 5, (ann.width || 20) + 10, (ann.height || 20) + 10);
//       ctx.setLineDash([]);
//     }
//   };

//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;
//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     annotations
//       .filter((ann) => Math.abs(ann.timestamp - videoTime) < 3)
//       .forEach((ann) => drawAnnotation(ctx, ann, ann.id === selectedId));

//     if (drawing) drawAnnotation(ctx, drawing);
//   }, [annotations, drawing, videoTime, selectedId]);

//   useEffect(() => {
//     window.addEventListener('keydown', handleKeyDown);
//     return () => window.removeEventListener('keydown', handleKeyDown);
//   }, [selectedId]);

//   return (
//     <canvas
//       ref={canvasRef}
//       width={900}
//       height={506}
//       style={{
//         position: 'absolute',
//         top: 0,
//         left: 0,
//         pointerEvents: tool === 'select' || tool ? 'auto' : 'none',
//         backgroundColor: 'transparent',
//       }}
//       onMouseDown={handleMouseDown}
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//     />
//   );
// };

// export default AnnotationOverlay;



// client/src/features/annotations/AnnotationOverlay.tsx

import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import {
  addAnnotation,
  setSelectedAnnotation,
  deleteAnnotation,
} from './annotationsSlice';

import type { ToolType, Annotation } from './annotationsSlice';

interface Props {
  tool: ToolType;
  videoTime: number;
  isPaused: boolean;
}

const AnnotationOverlay: React.FC<Props> = ({ tool, videoTime, isPaused }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const dispatch = useDispatch();

  const annotations = useSelector((state: RootState) => state.annotations.annotations);
  const selectedId = useSelector((state: RootState) => state.annotations.selectedAnnotationId);

  const [drawing, setDrawing] = useState<Annotation | null>(null);
  const [dragOffset, setDragOffset] = useState<{ dx: number; dy: number } | null>(null);

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
      } else {
        dispatch(setSelectedAnnotation(null));
      }
      return;
    }

    const newAnn: Annotation = {
      id: Date.now().toString(),
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

    if (tool === 'select' && selectedId && dragOffset) {
      const ann = annotations.find((a) => a.id === selectedId);
      if (!ann) return;

      const updated = { ...ann, x: x - dragOffset.dx, y: y - dragOffset.dy };
      dispatch(deleteAnnotation(ann.id));
      dispatch(addAnnotation(updated));
      return;
    }

    if (drawing) {
      setDrawing({ ...drawing, width: x - drawing.x, height: y - drawing.y });
    }
  };

  const handleMouseUp = () => {
    if (drawing) {
      dispatch(addAnnotation(drawing));
      setDrawing(null);
    }
    setDragOffset(null);
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === 'Delete' && selectedId) {
      dispatch(deleteAnnotation(selectedId));
      dispatch(setSelectedAnnotation(null));
    }
  };

  const drawAnnotation = (
    ctx: CanvasRenderingContext2D,
    ann: Annotation,
    isSelected = false
  ) => {
    ctx.beginPath();
    ctx.lineWidth = 2;
    ctx.strokeStyle = isSelected ? '#0d6efd' : 'red';

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
        ctx.fillStyle = 'yellow';
        ctx.fillText(ann.text || 'Text', ann.x, ann.y);
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

  useEffect(() => {
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedId]);

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