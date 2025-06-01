import React from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/hooks';
import {
  updateAnnotationAsync,
  deleteAnnotationAsync,
  setSelectedAnnotation,
} from './annotationsSlice';
import type { RootState } from '../../store/store';

const AnnotationProperties: React.FC = () => {
  const dispatch = useAppDispatch();
  const { annotations, selectedAnnotationId } = useSelector((state: RootState) => state.annotations);
  const annotation = annotations.find((a) => a.id === selectedAnnotationId);

  if (!annotation) {
    return (
      <div className="properties-panel">
        <i>Select an Annotation..</i>
      </div>
    );
  }

  const handleChange = (field: keyof typeof annotation, value: any) => {
    dispatch(updateAnnotationAsync({ ...annotation, [field]: value }));
  };

  return (
    <div className="properties-panel" style={{ padding: 12, fontFamily: 'sans-serif' }}>
      <h4 style={{ color: '#2ecc71', marginBottom: 12 }}>Properties</h4>

      {/* Color Picker */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 14, marginBottom: 16 }}>
        <label htmlFor="annotation-color" style={{ fontWeight: 500, minWidth: 100, color: '#17c3b2' }}>
          Change Color:
        </label>
        <input
          id="annotation-color"
          type="color"
          value={annotation.color}
          onChange={(e) => handleChange('color', e.target.value)}
          style={{
            width: 36,
            height: 36,
            border: 'none',
            borderRadius: '50%',
            cursor: 'pointer',
            boxShadow: '0 1px 4px #0001',
            outline: '2px solid #0d6efd22',
          }}
          aria-label="Pick annotation color"
        />
      </div>

      {/* Timestamp */}
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="annotation-timestamp" style={{ display: 'block', fontWeight: 500 }}>Timestamp:</label>
        <input
          id="annotation-timestamp"
          type="number"
          value={annotation.timestamp}
          min={0}
          onChange={(e) => handleChange('timestamp', Number(e.target.value))}
          style={{ width: '100%', padding: 6 }}
        />
      </div>

      {/* Duration */}
      <div style={{ marginBottom: 12 }}>
        <label htmlFor="annotation-duration" style={{ display: 'block', fontWeight: 500 }}>Duration (s):</label>
        <input
          id="annotation-duration"
          type="number"
          value={annotation.duration}
          min={1}
          max={10}
          onChange={(e) => handleChange('duration', Number(e.target.value))}
          style={{ width: '100%', padding: 6 }}
        />
      </div>

      {/* Text Field (Conditional) */}
      {annotation.type === 'text' && (
        <div style={{ marginBottom: 12 }}>
          <label htmlFor="annotation-text" style={{ display: 'block', fontWeight: 500 }}>Text:</label>
          <input
            id="annotation-text"
            type="text"
            value={annotation.text}
            onChange={(e) => handleChange('text', e.target.value)}
            style={{ width: '100%', padding: 6 }}
          />
        </div>
      )}

      {/* Action Buttons */}
      <div style={{ display: 'flex', gap: 10, marginTop: 14 }}>
        <button
          onClick={() => dispatch(setSelectedAnnotation(null))}
          style={{
            background: '#23272f',
            color: '#fff',
            border: '1px solid #0d6efd',
            borderRadius: 6,
            padding: '6px 14px',
            cursor: 'pointer',
          }}
        >
          Done
        </button>
        <button
          onClick={() => dispatch(deleteAnnotationAsync(annotation.id))}
          style={{
            background: '#e74c3c',
            color: '#fff',
            border: '1px solid #c0392b',
            borderRadius: 6,
            padding: '6px 14px',
            cursor: 'pointer',
          }}
        >
          Delete
        </button>
      </div>
    </div>
  );
};

export default AnnotationProperties;
