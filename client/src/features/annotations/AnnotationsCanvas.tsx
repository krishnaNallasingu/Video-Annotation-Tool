

// // features/annotations/AnnotationCanvas.tsx
// import React, { useRef, useEffect, useState } from 'react';
// import { useDispatch, useSelector } from 'react-redux';
// import type { RootState } from '../../store/store';
// import { addAnnotation, setSelectedAnnotation } from './annotationsSlice';

// // Define the Annotation type
// export type Annotation = {
//   id: string;
//   type: 'circle' | 'rectangle' | 'line' | 'text';
//   x: number;
//   y: number;
//   color: string;
//   timestamp: number;
//   duration: number;
//   radius?: number;
//   width?: number;
//   height?: number;
//   x2?: number;
//   y2?: number;
//   text?: string;
// };

// export const AnnotationCanvas = () => {
//   const dispatch = useDispatch();
//   const canvasRef = useRef<HTMLCanvasElement>(null);
//   const [isDrawing, setIsDrawing] = useState(false);
//   const [startPos, setStartPos] = useState({ x: 0, y: 0 });
//   const [currentAnnotation, setCurrentAnnotation] = useState<Partial<Annotation> | null>(null);
  
//   const { currentTool, annotations, selectedAnnotationId } = useSelector((state: RootState) => state.annotations);
//   const { playing, currentTime } = useSelector((state: RootState) => state.videoPlayer);

//   // Set canvas dimensions on mount and resize
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const updateCanvasSize = () => {
//       const container = canvas.parentElement;
//       if (container) {
//         canvas.width = container.clientWidth;
//         canvas.height = container.clientHeight;
//       }
//     };

//     updateCanvasSize();
//     window.addEventListener('resize', updateCanvasSize);

//     return () => {
//       window.removeEventListener('resize', updateCanvasSize);
//     };
//   }, []);

//   // Draw annotations
//   useEffect(() => {
//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const ctx = canvas.getContext('2d');
//     if (!ctx) return;

//     // Clear canvas
//     ctx.clearRect(0, 0, canvas.width, canvas.height);

//     // Draw all visible annotations
//     annotations.forEach(annotation => {
//       if (currentTime >= annotation.timestamp && 
//           currentTime <= annotation.timestamp + annotation.duration) {
//         drawAnnotation(ctx, annotation, annotation.id === selectedAnnotationId);
//       }
//     });

//     // Draw current annotation being created
//     if (currentAnnotation && isDrawing) {
//       drawAnnotation(ctx, currentAnnotation, false);
//     }
//   }, [annotations, currentTime, selectedAnnotationId, currentAnnotation, isDrawing]);

//   const drawAnnotation = (ctx: CanvasRenderingContext2D, annotation: Partial<Annotation>, isSelected: boolean) => {
//     if (!annotation.type) return;

//     ctx.strokeStyle = annotation.color || '#ff0000';
//     ctx.fillStyle = `${annotation.color || '#ff0000'}40`;
//     ctx.lineWidth = 2;

//     switch (annotation.type) {
//       case 'circle':
//         if (annotation.radius && annotation.x !== undefined && annotation.y !== undefined) {
//           ctx.beginPath();
//           ctx.arc(annotation.x, annotation.y, annotation.radius, 0, Math.PI * 2);
//           ctx.fill();
//           ctx.stroke();
//           if (isSelected) {
//             ctx.strokeStyle = '#0000ff';
//             ctx.setLineDash([5, 5]);
//             ctx.strokeRect(
//               annotation.x - annotation.radius - 5,
//               annotation.y - annotation.radius - 5,
//               annotation.radius * 2 + 10,
//               annotation.radius * 2 + 10
//             );
//             ctx.setLineDash([]);
//           }
//         }
//         break;

//       case 'rectangle':
//         if (annotation.width !== undefined && annotation.height !== undefined && 
//             annotation.x !== undefined && annotation.y !== undefined) {
//           ctx.fillRect(annotation.x, annotation.y, annotation.width, annotation.height);
//           ctx.strokeRect(annotation.x, annotation.y, annotation.width, annotation.height);
//           if (isSelected) {
//             ctx.strokeStyle = '#0000ff';
//             ctx.setLineDash([5, 5]);
//             ctx.strokeRect(
//               annotation.x - 5,
//               annotation.y - 5,
//               annotation.width + 10,
//               annotation.height + 10
//             );
//             ctx.setLineDash([]);
//           }
//         }
//         break;

//       case 'line':
//         if (annotation.x2 !== undefined && annotation.y2 !== undefined && 
//             annotation.x !== undefined && annotation.y !== undefined) {
//           ctx.beginPath();
//           ctx.moveTo(annotation.x, annotation.y);
//           ctx.lineTo(annotation.x2, annotation.y2);
//           ctx.stroke();
//           if (isSelected) {
//             ctx.strokeStyle = '#0000ff';
//             ctx.setLineDash([5, 5]);
//             ctx.strokeRect(
//               Math.min(annotation.x, annotation.x2) - 5,
//               Math.min(annotation.y, annotation.y2) - 5,
//               Math.abs(annotation.x2 - annotation.x) + 10,
//               Math.abs(annotation.y2 - annotation.y) + 10
//             );
//             ctx.setLineDash([]);
//           }
//         }
//         break;

//       case 'text':
//         if (annotation.text && annotation.x !== undefined && annotation.y !== undefined) {
//           ctx.font = '16px Arial';
//           ctx.fillStyle = annotation.color || '#ff0000';
//           ctx.fillText(annotation.text, annotation.x, annotation.y);
//           if (isSelected) {
//             const textWidth = ctx.measureText(annotation.text).width;
//             ctx.strokeStyle = '#0000ff';
//             ctx.setLineDash([5, 5]);
//             ctx.strokeRect(
//               annotation.x - 5,
//               annotation.y - 20,
//               textWidth + 10,
//               25
//             );
//             ctx.setLineDash([]);
//           }
//         }
//         break;
//     }
//   };

//   const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (playing || !currentTool) return;

//     const canvas = canvasRef.current;
//     if (!canvas) return;

//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     // Check if clicking on existing annotation
//     const clickedAnnotation = findAnnotationAtPosition(x, y);
//     if (clickedAnnotation) {
//       dispatch(setSelectedAnnotation(clickedAnnotation.id));
//       return;
//     }

//     // Start creating new annotation
//     setIsDrawing(true);
//     setStartPos({ x, y });

//     const newAnnotation: Partial<Annotation> = {
//       id: Date.now().toString(),
//       type: currentTool,
//       x,
//       y,
//       color: '#ff0000',
//       timestamp: currentTime,
//       duration: 3, // 3 seconds by default
//     };

//     if (currentTool === 'text') {
//       const text = prompt('Enter annotation text:');
//       if (text) {
//         newAnnotation.text = text;
//         dispatch(addAnnotation(newAnnotation as Annotation));
//       }
//       setIsDrawing(false);
//     } else {
//       setCurrentAnnotation(newAnnotation);
//     }
//   };

//   const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
//     if (!isDrawing || !currentAnnotation || !canvasRef.current) return;

//     const canvas = canvasRef.current;
//     const rect = canvas.getBoundingClientRect();
//     const x = e.clientX - rect.left;
//     const y = e.clientY - rect.top;

//     const updatedAnnotation = { ...currentAnnotation };

//     switch (currentAnnotation.type) {
//       case 'circle':
//         updatedAnnotation.radius = Math.sqrt(
//           Math.pow(x - startPos.x, 2) + Math.pow(y - startPos.y, 2)
//         );
//         break;
//       case 'rectangle':
//         updatedAnnotation.width = x - startPos.x;
//         updatedAnnotation.height = y - startPos.y;
//         break;
//       case 'line':
//         updatedAnnotation.x2 = x;
//         updatedAnnotation.y2 = y;
//         break;
//     }

//     setCurrentAnnotation(updatedAnnotation);
//   };

//   const handleMouseUp = () => {
//     if (isDrawing && currentAnnotation && currentAnnotation.type !== 'text') {
//       dispatch(addAnnotation(currentAnnotation as Annotation));
//       setCurrentAnnotation(null);
//       setIsDrawing(false);
//     }
//   };

//   const findAnnotationAtPosition = (x: number, y: number): Annotation | null => {
//     // Check in reverse order (top-most annotations first)
//     for (let i = annotations.length - 1; i >= 0; i--) {
//       const annotation = annotations[i];
//       if (currentTime < annotation.timestamp || currentTime > annotation.timestamp + annotation.duration) {
//         continue;
//       }

//       switch (annotation.type) {
//         case 'circle':
//           if (annotation.radius !== undefined && 
//               isPointInCircle(x, y, annotation.x, annotation.y, annotation.radius)) {
//             return annotation;
//           }
//           break;
//         case 'rectangle':
//           if (isPointInRect(
//             x, y, 
//             annotation.x, annotation.y, 
//             annotation.width || 0, 
//             annotation.height || 0
//           )) {
//             return annotation;
//           }
//           break;
//         case 'line':
//           if (annotation.x2 !== undefined && annotation.y2 !== undefined &&
//               isPointNearLine(
//                 x, y, 
//                 annotation.x, annotation.y, 
//                 annotation.x2, annotation.y2
//               )) {
//             return annotation;
//           }
//           break;
//         case 'text':
//           if (Math.abs(x - annotation.x) < 50 && Math.abs(y - annotation.y) < 20) {
//             return annotation;
//           }
//           break;
//       }
//     }
//     return null;
//   };

//   // Helper functions for hit testing
//   const isPointInCircle = (x: number, y: number, cx: number, cy: number, radius: number) => {
//     return Math.sqrt(Math.pow(x - cx, 2) + Math.pow(y - cy, 2)) <= radius;
//   };

//   const isPointInRect = (x: number, y: number, rx: number, ry: number, width: number, height: number) => {
//     return x >= rx && x <= rx + width && y >= ry && y <= ry + height;
//   };

//   const isPointNearLine = (x: number, y: number, x1: number, y1: number, x2: number, y2: number, tolerance = 5) => {
//     const minX = Math.min(x1, x2) - tolerance;
//     const maxX = Math.max(x1, x2) + tolerance;
//     const minY = Math.min(y1, y2) - tolerance;
//     const maxY = Math.max(y1, y2) + tolerance;

//     if (x < minX || x > maxX || y < minY || y > maxY) {
//       return false;
//     }

//     if (x1 === x2) return Math.abs(x - x1) <= tolerance;
//     if (y1 === y2) return Math.abs(y - y1) <= tolerance;

//     const slope = (y2 - y1) / (x2 - x1);
//     const intercept = y1 - slope * x1;
//     const expectedY = slope * x + intercept;
//     return Math.abs(y - expectedY) <= tolerance;
//   };

//   return (
//     <canvas
//       ref={canvasRef}
//       className="absolute top-0 left-0 w-full h-full pointer-events-auto"
//       onMouseDown={handleMouseDown}
//       onMouseMove={handleMouseMove}
//       onMouseUp={handleMouseUp}
//       onMouseLeave={handleMouseUp}
//     />
//   );
// };


// features/annotations/AnnotationCanvas.tsx
import React, { useRef, useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState } from '../../store/store';
import {
  addAnnotation,
  setSelectedAnnotation,
} from './annotationsSlice';

export const AnnotationCanvas = () => {
  const dispatch = useDispatch();
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [startPos, setStartPos] = useState({ x: 0, y: 0 });
  const [currentAnnotation, setCurrentAnnotation] = useState<any>(null);

  const { selectedTool, annotations, selectedAnnotationId } = useSelector((state: RootState) => state.annotations);
  const { playing, currentTime } = useSelector((state: RootState) => state.videoPlayer);

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

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);

    annotations.forEach(annotation => {
      if (
        currentTime >= annotation.timestamp &&
        currentTime <= annotation.timestamp + (annotation.duration || 3)
      ) {
        drawAnnotation(ctx, annotation, annotation.id === selectedAnnotationId);
      }
    });

    if (currentAnnotation && isDrawing) {
      drawAnnotation(ctx, currentAnnotation, false);
    }
  }, [annotations, currentTime, selectedAnnotationId, currentAnnotation, isDrawing]);

  const drawAnnotation = (ctx: CanvasRenderingContext2D, annotation: any, isSelected: boolean) => {
    ctx.strokeStyle = annotation.color || '#ff0000';
    ctx.fillStyle = `${annotation.color || '#ff0000'}40`;
    ctx.lineWidth = 2;

    switch (annotation.type) {
      case 'circle': {
        const radius = Math.sqrt(
          Math.pow((annotation.width || 0), 2) +
          Math.pow((annotation.height || 0), 2)
        );
        ctx.beginPath();
        ctx.arc(annotation.x, annotation.y, radius, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        break;
      }
      case 'rectangle': {
        ctx.fillRect(annotation.x, annotation.y, annotation.width || 0, annotation.height || 0);
        ctx.strokeRect(annotation.x, annotation.y, annotation.width || 0, annotation.height || 0);
        break;
      }
      case 'line': {
        ctx.beginPath();
        ctx.moveTo(annotation.x, annotation.y);
        ctx.lineTo(annotation.x + (annotation.width || 0), annotation.y + (annotation.height || 0));
        ctx.stroke();
        break;
      }
      case 'text': {
        ctx.font = '16px Arial';
        ctx.fillStyle = annotation.color || '#ff0000';
        ctx.fillText(annotation.text || 'Text', annotation.x, annotation.y);
        break;
      }
    }

    if (isSelected) {
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        annotation.x - 5,
        annotation.y - 5,
        (annotation.width || 20) + 10,
        (annotation.height || 20) + 10
      );
      ctx.setLineDash([]);
    }
  };

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (playing || selectedTool === 'none') return;
    const canvas = canvasRef.current;
    if (!canvas) return;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const newAnnotation: any = {
      id: Date.now().toString(),
      type: selectedTool,
      x,
      y,
      color: '#ff0000',
      timestamp: currentTime,
      duration: 3,
    };

    if (selectedTool === 'text') {
      const text = prompt('Enter annotation text:');
      if (text) {
        newAnnotation.text = text;
        dispatch(addAnnotation(newAnnotation));
      }
    } else {
      setStartPos({ x, y });
      setCurrentAnnotation(newAnnotation);
      setIsDrawing(true);
    }
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentAnnotation || !canvasRef.current) return;
    const canvas = canvasRef.current;
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const updated = { ...currentAnnotation };
    updated.width = x - startPos.x;
    updated.height = y - startPos.y;
    setCurrentAnnotation(updated);
  };

  const handleMouseUp = () => {
    if (isDrawing && currentAnnotation && selectedTool !== 'text') {
      dispatch(addAnnotation(currentAnnotation));
    }
    setIsDrawing(false);
    setCurrentAnnotation(null);
  };

  return (
    <canvas
      ref={canvasRef}
      className="absolute top-0 left-0 w-full h-full pointer-events-auto"
      onMouseDown={handleMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onMouseLeave={handleMouseUp}
    />
  );
};
