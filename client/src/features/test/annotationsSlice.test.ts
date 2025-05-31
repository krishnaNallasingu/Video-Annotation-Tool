import reducer, {
  setSelectedTool,
  setSelectedAnnotation,
  clearAnnotations,
  undo,
  redo,
  // addAnnotation, updateAnnotation, deleteAnnotation // Uncomment if you have these
} from '../annotations/annotationsSlice';

describe('annotationsSlice', () => {
  it('should handle setSelectedTool', () => {
    const initialState = { annotations: [], selectedTool: 'none', selectedAnnotationId: null, past: [], future: [], loading: false, error: null };
    const nextState = reducer(initialState, setSelectedTool('circle'));
    expect(nextState.selectedTool).toBe('circle');
    expect(nextState.selectedAnnotationId).toBeNull();
  });

  it('should handle clearAnnotations', () => {
    const initialState = { annotations: [{id: '1', type: 'circle', timestamp: 0, x: 0, y: 0, duration: 2, color: '#fff'}], selectedTool: 'none', selectedAnnotationId: null, past: [], future: [], loading: false, error: null };
    const nextState = reducer(initialState, clearAnnotations());
    expect(nextState.annotations).toEqual([]);
  });

  it('should handle setSelectedAnnotation', () => {
    const initialState = {
      annotations: [{ id: '1', type: 'circle', timestamp: 0, x: 0, y: 0, duration: 2, color: '#fff' }],
      selectedTool: 'none',
      selectedAnnotationId: null,
      past: [],
      future: [],
      loading: false,
      error: null
    };
    const nextState = reducer(initialState, setSelectedAnnotation('1'));
    expect(nextState.selectedAnnotationId).toBe('1');
  });

  it('should handle undo/redo', () => {
    const initialState = {
      annotations: [{ id: '1', type: 'circle', timestamp: 0, x: 0, y: 0, duration: 2, color: '#fff' }],
      selectedTool: 'none',
      selectedAnnotationId: null,
      past: [
        [],
      ],
      future: [],
      loading: false,
      error: null
    };
    // Undo should revert to previous state
    const stateAfterUndo = reducer(initialState, undo());
    expect(stateAfterUndo.annotations).toEqual([]);
    // Redo should restore the undone state
    const stateAfterRedo = reducer({ ...stateAfterUndo, future: [initialState.annotations] }, redo());
    expect(stateAfterRedo.annotations).toEqual(initialState.annotations);
  });

  // Add more tests for addAnnotation, updateAnnotation, deleteAnnotation if you have those actions
});