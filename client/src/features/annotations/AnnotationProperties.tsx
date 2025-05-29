import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateAnnotation, deleteAnnotation } from './annotationsSlice';
import type { RootState } from '../../store/store';

const AnnotationProperties: React.FC = () => {
  const dispatch = useDispatch();
  const { annotations, selectedAnnotationId } = useSelector((state: RootState) => state.annotations);
  const annotation = annotations.find(a => a.id === selectedAnnotationId);

  if (!annotation) return <div className="properties-panel">No annotation selected</div>;

  const handleChange = (field: string, value: any) => {
    dispatch(updateAnnotation({ ...annotation, [field]: value }));
  };

  return (
    <div className="properties-panel">
      <h4>Properties</h4>
      <div>
        <label>Color:</label>
        <input
          type="color"
          value={annotation.color}
          onChange={e => handleChange('color', e.target.value)}
        />
      </div>
      <div>
        <label>Timestamp:</label>
        <input
          type="number"
          value={annotation.timestamp}
          min={0}
          onChange={e => handleChange('timestamp', Number(e.target.value))}
        />
      </div>
      <div>
        <label>Duration:</label>
        <input
          type="number"
          value={annotation.duration}
          min={1}
          max={10}
          onChange={e => handleChange('duration', Number(e.target.value))}
        />
      </div>
      {annotation.type === 'text' && (
        <div>
          <label>Text:</label>
          <input
            type="text"
            value={annotation.text}
            onChange={e => handleChange('text', e.target.value)}
          />
        </div>
      )}
      <button onClick={() => dispatch(deleteAnnotation(annotation.id))}>Delete</button>
    </div>
  );
};

export default AnnotationProperties;