import React from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/hooks';

import { setSelectedAnnotation, deleteAnnotationAsync } from './annotationsSlice';
import type { RootState } from '../../store/store';

const AnnotationList: React.FC = () => {
  const dispatch = useAppDispatch();
  const { annotations, selectedAnnotationId } = useSelector((state: RootState) => state.annotations);

  const handleExport = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(annotations, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", "annotations.json");
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
  };

  return (
    <div className="annotation-list">
      <button
        onClick={handleExport}
        style={{
          marginBottom: 8,
          backgroundColor: '#0d6efd',
          color: 'white',
          border: 'none',
          padding: '10px 18px',
          borderRadius: '6px',
          cursor: 'pointer',
          transition: 'all 0.2s ease-in-out',
        }}
        onMouseEnter={e => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#ffbf30';
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1.05)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.2)';
        }}
        onMouseLeave={e => {
          (e.currentTarget as HTMLButtonElement).style.backgroundColor = '#0d6efd';
          (e.currentTarget as HTMLButtonElement).style.transform = 'scale(1)';
          (e.currentTarget as HTMLButtonElement).style.boxShadow = 'none';
        }}
      >
        <i>Export</i>
      </button>

      {/* <h4>Annotations</h4> */}
      <ul>
        {annotations.map((ann, idx) => (
          <li
            key={ann.id || idx}
            className={selectedAnnotationId === ann.id ? 'active' : ''}
            onClick={() => dispatch(setSelectedAnnotation(ann.id))}
          >
            <span>{ann.type}</span>
            <span>{Math.round(ann.timestamp * 10) / 10}s</span>
            <button
              onClick={e => {
                e.stopPropagation();
                dispatch(deleteAnnotationAsync(ann.id));
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AnnotationList;