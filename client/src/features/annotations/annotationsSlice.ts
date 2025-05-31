import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

const API_URL = import.meta.env.VITE_API_URL;

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
  loading: boolean;
  error: string | null;
}

const initialState: AnnotationsState = {
  annotations: [],
  selectedTool: 'none',
  selectedAnnotationId: null,
  past: [],
  future: [],
  loading: false,
  error: null,
};

// Async thunks for backend CRUD
export const fetchAnnotations = createAsyncThunk(
  'annotations/fetchAnnotations',
  async () => {
    const res = await fetch(API_URL);
    return await res.json();
  }
);

export const addAnnotationAsync = createAsyncThunk(
  'annotations/addAnnotation',
  async (annotation: Omit<Annotation, 'id'>) => {
    const res = await fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(annotation),
    });
    return await res.json();
  }
);

export const updateAnnotationAsync = createAsyncThunk(
  'annotations/updateAnnotation',
  async (annotation: Annotation) => {
    const res = await fetch(`${API_URL}/${annotation.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(annotation),
    });
    return await res.json();
  }
);

export const deleteAnnotationAsync = createAsyncThunk(
  'annotations/deleteAnnotation',
  async (id: string) => {
    await fetch(`${API_URL}/${id}`, {
      method: 'DELETE',
    });
    return id;
  }
);

export const annotationsSlice = createSlice({
  name: 'annotations',
  initialState,
  reducers: {
    setSelectedTool: (state, action: PayloadAction<ToolType>) => {
      state.selectedTool = action.payload;
      state.selectedAnnotationId = null;
    },
    setSelectedAnnotation: (state, action: PayloadAction<string | null>) => {
      state.selectedAnnotationId = action.payload;
    },
    undo: (state) => {
      if (state.past.length > 0) {
        const previous = state.past.pop()!;
        state.future.push([...state.annotations]);
        state.annotations = previous;
      }
    },
    redo: (state) => {
      if (state.future.length > 0) {
        const next = state.future.pop()!;
        state.past.push([...state.annotations]);
        state.annotations = next;
      }
    },
    clearAnnotations: (state) => {
      state.past.push([...state.annotations]);
      state.future = [];
      state.annotations = [];
      state.selectedAnnotationId = null;
    },
    // Local update for drag/move (optimistic UI)
    updateAnnotation: (state, action: PayloadAction<Annotation>) => {
      state.past.push([...state.annotations]);
      state.future = [];
      state.annotations = state.annotations.map(ann =>
        ann.id === action.payload.id ? action.payload : ann
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAnnotations.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnnotations.fulfilled, (state, action) => {
        state.loading = false;
        state.annotations = action.payload;
      })
      .addCase(fetchAnnotations.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || 'Failed to fetch annotations';
      })
      .addCase(addAnnotationAsync.fulfilled, (state, action) => {
        state.past.push([...state.annotations]);
        state.future = [];
        state.annotations.push(action.payload);
      })
      .addCase(updateAnnotationAsync.fulfilled, (state, action) => {
        state.past.push([...state.annotations]);
        state.future = [];
        state.annotations = state.annotations.map(ann =>
          ann.id === action.payload.id ? action.payload : ann
        );
      })
      .addCase(deleteAnnotationAsync.fulfilled, (state, action) => {
        state.past.push([...state.annotations]);
        state.future = [];
        state.annotations = state.annotations.filter(ann => ann.id !== action.payload);
        if (state.selectedAnnotationId === action.payload) {
          state.selectedAnnotationId = null;
        }
      });
  },
});

export const {
  setSelectedTool,
  setSelectedAnnotation,
  clearAnnotations,
  undo,
  redo,
  updateAnnotation,
} = annotationsSlice.actions;

export default annotationsSlice.reducer;