
// import { createSlice } from '@reduxjs/toolkit';
// import {type PayloadAction } from '@reduxjs/toolkit';
// // Annotation shape
// export interface Annotation {
//   id: string;
//   type: 'circle' | 'rectangle' | 'line' | 'text';
//   timestamp: number;
//   x: number;
//   y: number;
//   width?: number;
//   height?: number;
//   text?: string;
// }

// // Tool type
// export type ToolType = 'circle' | 'rectangle' | 'line' | 'text' | 'none';

// interface AnnotationsState {
//   annotations: Annotation[];
//   selectedTool: ToolType;
//   selectedAnnotationId: string | null;
// }

// const initialState: AnnotationsState = {
//   annotations: [],
//   selectedTool: 'none',
//   selectedAnnotationId: null,
// };

// export const annotationsSlice = createSlice({
//   name: 'annotations',
//   initialState,
//   reducers: {
//     loadAnnotations: (state, action: PayloadAction<Annotation[]>) => {
//       state.annotations = action.payload;
//     },
//     addAnnotation: (state, action: PayloadAction<Annotation>) => {
//       state.annotations.push(action.payload);
//     },
//     setSelectedTool: (state, action: PayloadAction<ToolType>) => {
//       state.selectedTool = action.payload;
//     },
//     setSelectedAnnotation: (state, action: PayloadAction<string | null>) => {
//       state.selectedAnnotationId = action.payload;
//     },
//     clearAnnotations: (state) => {
//       state.annotations = [];
//       state.selectedAnnotationId = null;
//     },
//   },
// });

// export const {
//   loadAnnotations,
//   addAnnotation,
//   setSelectedTool,
//   setSelectedAnnotation,
//   clearAnnotations,
// } = annotationsSlice.actions;

// export default annotationsSlice.reducer;




import { createSlice } from '@reduxjs/toolkit';
import { type PayloadAction } from '@reduxjs/toolkit';

// Annotation shape
export interface Annotation {
  id: string;
  type: 'circle' | 'rectangle' | 'line' | 'text';
  timestamp: number;
  x: number;
  y: number;
  width?: number;
  height?: number;
  text?: string;
  duration?: number;
  color?: string;
}

// Tool type
export type ToolType = 'circle' | 'rectangle' | 'line' | 'text' | 'select' | 'none';

interface AnnotationsState {
  annotations: Annotation[];
  selectedTool: ToolType;
  selectedAnnotationId: string | null;
}

const initialState: AnnotationsState = {
  annotations: [],
  selectedTool: 'none',
  selectedAnnotationId: null,
};

export const annotationsSlice = createSlice({
  name: 'annotations',
  initialState,
  reducers: {
    loadAnnotations: (state, action: PayloadAction<Annotation[]>) => {
      state.annotations = action.payload;
    },
    addAnnotation: (state, action: PayloadAction<Annotation>) => {
      state.annotations.push(action.payload);
    },
    deleteAnnotation: (state, action: PayloadAction<string>) => {
      state.annotations = state.annotations.filter(ann => ann.id !== action.payload);
    },
    setSelectedTool: (state, action: PayloadAction<ToolType>) => {
      state.selectedTool = action.payload;
    },
    setSelectedAnnotation: (state, action: PayloadAction<string | null>) => {
      state.selectedAnnotationId = action.payload;
    },
    clearAnnotations: (state) => {
      state.annotations = [];
      state.selectedAnnotationId = null;
    },
  },
});

export const {
  loadAnnotations,
  addAnnotation,
  deleteAnnotation,
  setSelectedTool,
  setSelectedAnnotation,
  clearAnnotations,
} = annotationsSlice.actions;

export default annotationsSlice.reducer;