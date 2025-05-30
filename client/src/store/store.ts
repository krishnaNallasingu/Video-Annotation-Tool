// client/src/store/store.ts
import { configureStore } from '@reduxjs/toolkit';
import annotationsReducer from '../features/annotations/annotationsSlice';
import videoPlayerReducer from '../features/videoPlayer/videoPlayerSlice';

export const store = configureStore({
  reducer: {
    annotations: annotationsReducer,
    videoPlayer: videoPlayerReducer,
  },
});

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;


