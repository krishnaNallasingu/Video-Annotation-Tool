import React from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/hooks'; // adjust the path as needed
import { updateAnnotationAsync, deleteAnnotationAsync } from './annotationsSlice';
import type { RootState } from '../../store/store';

const AnnotationProperties: React.FC = () => {
  const dispatch = useAppDispatch();
  const { annotations, selectedAnnotationId } = useSelector((state: RootState) => state.annotations);
  const annotation = annotations.find(a => a.id === selectedAnnotationId);

  if (!annotation) return <div className="properties-panel">No annotation selected</div>;

  const handleChange = (field: string, value: any) => {
    dispatch(updateAnnotationAsync({ ...annotation, [field]: value }));
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
      <button onClick={() => dispatch(deleteAnnotationAsync(annotation.id))}>Delete</button>
    </div>
  );
};

export default AnnotationProperties;