import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setSelectedTool } from './annotationsSlice';
import type { RootState } from '../../store/store';
import { FiMousePointer, FiCircle, FiSquare, FiType, FiMinus } from 'react-icons/fi';
import type { ToolType } from './annotationsSlice';
import { useAppDispatch } from '../../store/hooks';

const tools: { type: ToolType; label: string; icon: React.ReactNode }[] = [
  { type: 'select', label: 'Select', icon: <FiMousePointer /> },
  { type: 'rectangle', label: 'Rectangle', icon: <FiSquare /> },
  { type: 'circle', label: 'Circle', icon: <FiCircle /> },
  { type: 'line', label: 'Line', icon: <FiMinus /> },
  { type: 'text', label: 'Text', icon: <FiType /> },
];

const AnnotationToolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedTool = useSelector((state: RootState) => state.annotations.selectedTool);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      switch (e.key.toLowerCase()) {
        case 'c':
          dispatch(setSelectedTool('circle'));
          break;
        case 'r':
          dispatch(setSelectedTool('rectangle'));
          break;
        case 'l':
          dispatch(setSelectedTool('line'));
          break;
        case 't':
          dispatch(setSelectedTool('text'));
          break;
        case 'v':
          dispatch(setSelectedTool('select'));
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  return (
    <div className="annotation-toolbar" style={{ display: 'flex', gap: 8 }}>
      {tools.map((tool) => (
        <button
          key={tool.type}
          className={selectedTool === tool.type ? 'active-tool-btn' : ''}
          onClick={() => dispatch(setSelectedTool(tool.type))}
          aria-label={tool.label}
          title={tool.label}
          style={{
            background: selectedTool === tool.type ? '#0d6efd' : '#23272f',
            color: selectedTool === tool.type ? '#fff' : '#e3e6ef',
            border: 'none',
            borderRadius: 6,
            padding: '6px 10px',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            fontWeight: 500,
            fontSize: 15,
            transition: 'background 0.18s, color 0.18s',
          }}
        >
          {tool.icon}
          <span style={{ marginLeft: 4 }}>{tool.label}</span>
        </button>
      ))}
    </div>
  );
};

export default AnnotationToolbar;
