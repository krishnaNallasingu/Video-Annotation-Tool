import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

export interface Annotation {
  id: string;
  type: 'circle' | 'rectangle' | 'line' | 'text';
  timestamp: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  duration: number;
  color: string;
}

export type ToolType = 'circle' | 'rectangle' | 'line' | 'text' | 'select' | 'none';

interface AnnotationsState {
  annotations: Annotation[];
  selectedTool: ToolType;
  selectedAnnotationId: string | null;
  past: Annotation[][];
  future: Annotation[][];
}

const initialState: AnnotationsState = {
  annotations: [],
  selectedTool: 'none',
  selectedAnnotationId: null,
  past: [],
  future: [],
};

const saveToLocalStorage = (annotations: Annotation[]) => {
  localStorage.setItem('videoAnnotations', JSON.stringify(annotations));
};

export const annotationsSlice = createSlice({
  name: 'annotations',
  initialState,
  reducers: {
    loadAnnotations: (state) => {
      const saved = localStorage.getItem('videoAnnotations');
      if (saved) state.annotations = JSON.parse(saved);
    },
    addAnnotation: (state, action: PayloadAction<Annotation>) => {
      state.past.push([...state.annotations]);
      state.future = [];
      state.annotations.push(action.payload);
      saveToLocalStorage(state.annotations);
    },
    updateAnnotation: (state, action: PayloadAction<Annotation>) => {
      state.past.push([...state.annotations]);
      state.future = [];
      state.annotations = state.annotations.map(ann =>
        ann.id === action.payload.id ? action.payload : ann
      );
      saveToLocalStorage(state.annotations);
    },
    deleteAnnotation: (state, action: PayloadAction<string>) => {
      state.past.push([...state.annotations]);
      state.future = [];
      state.annotations = state.annotations.filter(ann => ann.id !== action.payload);
      state.selectedAnnotationId = null;
      saveToLocalStorage(state.annotations);
    },
    setSelectedTool: (state, action: PayloadAction<ToolType>) => {
      state.selectedTool = action.payload;
      state.selectedAnnotationId = null;
    },
    setSelectedAnnotation: (state, action: PayloadAction<string | null>) => {
      state.selectedAnnotationId = action.payload;
    },
    clearAnnotations: (state) => {
      state.past.push([...state.annotations]);
      state.future = [];
      state.annotations = [];
      state.selectedAnnotationId = null;
      saveToLocalStorage(state.annotations);
    },
    undo: (state) => {
      if (state.past.length > 0) {
        const previous = state.past.pop()!;
        state.future.push([...state.annotations]);
        state.annotations = previous;
        saveToLocalStorage(state.annotations);
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        const next = state.future.pop()!;
        state.past.push([...state.annotations]);
        state.annotations = next;
        saveToLocalStorage(state.annotations);
      }
    },
  },
});

export const {
  loadAnnotations,
  addAnnotation,
  updateAnnotation,
  deleteAnnotation,
  setSelectedTool,
  setSelectedAnnotation,
  clearAnnotations,
  undo,
  redo,
} = annotationsSlice.actions;

export default annotationsSlice.reducer;