import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setSelectedTool} from './annotationsSlice';
import type { RootState } from '../../store/store';
import { FiMousePointer, FiCircle, FiSquare, FiType, FiMinus } from 'react-icons/fi';
import type { ToolType } from './annotationsSlice';

const tools: { type: ToolType; label: string; icon: React.ReactNode }[] = [
  { type: 'select', label: 'Select', icon: <FiMousePointer /> },
  { type: 'rectangle', label: 'Rectangle', icon: <FiSquare /> },
  { type: 'circle', label: 'Circle', icon: <FiCircle /> },
  { type: 'line', label: 'Line', icon: <FiMinus /> },
  { type: 'text', label: 'Text', icon: <FiType /> },
];

const AnnotationToolbar: React.FC = () => {
  const dispatch = useDispatch();
  const selectedTool = useSelector((state: RootState) => state.annotations.selectedTool);

  return (
    <div className="annotation-toolbar">
      {tools.map(tool => (
        <button
          key={tool.type}
          className={selectedTool === tool.type ? 'active' : ''}
          onClick={() => dispatch(setSelectedTool(tool.type))}
          aria-label={tool.label}
        >
          {tool.icon}
          <span className="tool-label">{tool.label}</span>
        </button>
      ))}
    </div>
  );
};

export default AnnotationToolbar;