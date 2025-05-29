// client/src/features/videoPlayer/videoPlayerSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';

interface VideoPlayerState {
  playing: boolean;
  currentTime: number;
  duration: number;
  playbackRate: number;
}

const initialState: VideoPlayerState = {
  playing: false,
  currentTime: 0,
  duration: 0,
  playbackRate: 1,
};

export const videoPlayerSlice = createSlice({
  name: 'videoPlayer',
  initialState,
  reducers: {
    setPlaying: (state, action: PayloadAction<boolean>) => {
      state.playing = action.payload;
    },
    setCurrentTime: (state, action: PayloadAction<number>) => {
      state.currentTime = action.payload;
    },
    setDuration: (state, action: PayloadAction<number>) => {
      state.duration = action.payload;
    },
    setPlaybackRate: (state, action: PayloadAction<number>) => {
      state.playbackRate = action.payload;
    },
    togglePlayPause: (state) => {
      state.playing = !state.playing;
    },
  },
});

export const { 
  setPlaying, 
  setCurrentTime, 
  setDuration, 
  setPlaybackRate,
  togglePlayPause 
} = videoPlayerSlice.actions;

export default videoPlayerSlice.reducer;