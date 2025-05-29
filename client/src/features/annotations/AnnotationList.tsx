import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedAnnotation } from './annotationsSlice';
import type { RootState } from '../../store/store';

const AnnotationList: React.FC = () => {
  const dispatch = useDispatch();
  const { annotations, selectedAnnotationId } = useSelector((state: RootState) => state.annotations);

  return (
    <div className="annotation-list">
      <h4>Annotations</h4>
      <ul>
        {annotations.map(ann => (
          <li
            key={ann.id}
            className={selectedAnnotationId === ann.id ? 'active' : ''}
            onClick={() => dispatch(setSelectedAnnotation(ann.id))}
          >
            <span>{ann.type}</span>
            <span>{Math.round(ann.timestamp * 10) / 10}s</span>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnnotationList;