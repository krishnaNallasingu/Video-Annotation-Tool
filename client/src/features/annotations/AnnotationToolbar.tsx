import React, { useEffect } from 'react';
import { useSelector } from 'react-redux';
import { setSelectedTool } from './annotationsSlice';
import type { RootState } from '../../store/store';
import { FiMousePointer, FiCircle, FiSquare, FiType, FiMinus } from 'react-icons/fi';
import type { ToolType } from './annotationsSlice';
import { useAppDispatch } from '../../store/hooks';
import { motion } from 'framer-motion';
// import '../../App.css';

const tools: {
  type: ToolType;
  label: string;
  icon: React.ReactNode;
  shortcut: string;
}[] = [
    { type: 'select', label: 'Select', icon: <FiMousePointer />, shortcut: 'S' },
    { type: 'rectangle', label: 'Rectangle', icon: <FiSquare />, shortcut: 'R' },
    { type: 'circle', label: 'Circle', icon: <FiCircle />, shortcut: 'C' },
    { type: 'line', label: 'Line', icon: <FiMinus />, shortcut: 'L' },
    { type: 'text', label: 'Text', icon: <FiType />, shortcut: 'T' },
  ];

const AnnotationToolbar: React.FC = () => {
  const dispatch = useAppDispatch();
  const selectedTool = useSelector((state: RootState) => state.annotations.selectedTool);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target instanceof HTMLInputElement || e.target instanceof HTMLTextAreaElement) return;
      const key = e.key.toLowerCase();
      const tool = tools.find(t => t.shortcut.toLowerCase() === key);
      if (tool) dispatch(setSelectedTool(tool.type));
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [dispatch]);

  return (
    <motion.div
      className="annotation-toolbar"
      initial={{ opacity: 0, y: -10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
    >
      {tools.map((tool) => (
        <button
          key={tool.type}
          className={`tool-btn ${selectedTool === tool.type ? 'active' : ''}`}
          onClick={() => dispatch(setSelectedTool(tool.type))}
          aria-label={tool.label}
          title={`${tool.label} (${tool.shortcut})`}
        >
          {tool.icon}
          <span className="tool-label">{tool.label}</span>
          <span className="shortcut-hint">{tool.shortcut}</span>
        </button>
      ))}
    </motion.div>
  );
};

export default AnnotationToolbar;
