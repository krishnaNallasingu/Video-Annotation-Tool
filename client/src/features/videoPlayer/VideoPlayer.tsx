import React, { useRef, useEffect, useCallback } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { setPlaying, setCurrentTime, setDuration, setPlaybackRate } from './videoPlayerSlice';
import { fetchAnnotations, undo, redo } from '../annotations/annotationsSlice';
import type { RootState } from '../../store/store';
import AnnotationsCanvas from '../annotations/AnnotationsCanvas';
import AnnotationToolbar from '../annotations/AnnotationToolbar';
import AnnotationProperties from '../annotations/AnnotationProperties';
import AnnotationList from '../annotations/AnnotationList';
import {
  FiPlay, FiPause, FiRotateCcw, FiRotateCw, FiMaximize, FiChevronLeft, FiChevronRight
} from 'react-icons/fi';

const PLAYBACK_RATES = [0.5, 1, 1.25, 1.5, 2];

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const dispatch = useDispatch();
  const { playing, currentTime, duration, playbackRate } = useSelector((state: RootState) => state.videoPlayer);
  const { annotations } = useSelector((state: RootState) => state.annotations);

  // Fetch annotations from backend on mount
  useEffect(() => {
    dispatch(fetchAnnotations());
  }, [dispatch]);

  useEffect(() => {
    if (!videoRef.current) return;
    if (playing) videoRef.current.play();
    else videoRef.current.pause();
  }, [playing]);
  useEffect(() => {
    if (videoRef.current) videoRef.current.playbackRate = playbackRate;
  }, [playbackRate]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.target && (e.target as HTMLElement).tagName === 'INPUT') return;
      if (e.code === 'Space') {
        e.preventDefault();
        dispatch(setPlaying(!playing));
      } else if (e.code === 'ArrowRight') {
        seekBy(5);
      } else if (e.code === 'ArrowLeft') {
        seekBy(-5);
      } else if (e.code === 'Period') {
        frameByFrame(1);
      } else if (e.code === 'Comma') {
        frameByFrame(-1);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
    // eslint-disable-next-line
  }, [playing, currentTime, duration]);

  const seekBy = useCallback((seconds: number) => {
    if (!videoRef.current) return;
    let newTime = Math.min(Math.max(videoRef.current.currentTime + seconds, 0), duration);
    videoRef.current.currentTime = newTime;
    dispatch(setCurrentTime(newTime));
  }, [dispatch, duration]);

  const frameByFrame = useCallback((frames: number) => {
    if (!videoRef.current) return;
    const fps = 30;
    let newTime = Math.min(Math.max(videoRef.current.currentTime + frames / fps, 0), duration);
    videoRef.current.currentTime = newTime;
    dispatch(setCurrentTime(newTime));
  }, [dispatch, duration]);

  const handleFullscreen = () => {
    if (videoRef.current && videoRef.current.requestFullscreen) {
      videoRef.current.requestFullscreen();
    }
  };

  const handlePlayPause = () => dispatch(setPlaying(!playing));
  const handleTimeUpdate = () => {
    if (videoRef.current) dispatch(setCurrentTime(videoRef.current.currentTime));
  };
  const handleLoadedMetadata = () => {
    if (videoRef.current) dispatch(setDuration(videoRef.current.duration));
  };
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Number(e.target.value);
      dispatch(setCurrentTime(Number(e.target.value)));
    }
  };
  const speedButtonStyle = (rate: number) => ({
    background: playbackRate === rate ? '#0d6efd' : '#292d36',
    color: playbackRate === rate ? '#fff' : '#fff',
    border: playbackRate === rate ? '1.5px solid #0d6efd' : '1.5px solid transparent',
    borderRadius: 8,
    padding: '6px 12px',
    margin: '0 2px',
    cursor: 'pointer',
    fontWeight: playbackRate === rate ? 700 : 400,
    transition: 'background 0.18s, border-color 0.18s'
  });
  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div>
      {/* Headline */}
      <div style={{
        textAlign: 'center',
        fontWeight: 700,
        fontSize: '2rem',
        letterSpacing: '0.03em',
        margin: '2rem 0 1.5rem 0',
        color: '#0d6efd',
        textShadow: '0 2px 12px #0008'
      }}>
        {/* Video-Annotation-Tool */}
      </div>
      {/* Main layout: player + description */}
      <div style={{
        display: 'flex',
        gap: 32,
        alignItems: 'flex-start',
        justifyContent: 'center',
        maxWidth: 1200,
        margin: '0 auto',
        marginLeft: 5 // Move everything 5px to the right
      }}>
        {/* Video player and controls */}
        <div className="video-player" style={{
          flex: 2,
          border: '2px solid #232323',
          borderRadius: 16,
          background: '#23272f',
          boxShadow: '0 8px 32px rgba(0,0,0,0.45)',
          overflow: 'hidden',
          position: 'relative',
          minWidth: 0
        }}>
          <div style={{ position: 'relative' }}>
            <video
              ref={videoRef}
              src="/sample.mp4"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              style={{ width: '100%', display: 'block', background: '#000', borderRadius: '16px 16px 0 0' }}
              tabIndex={0}
            />
            <AnnotationsCanvas currentTime={currentTime} playing={playing} />
          </div>
          {/* Seeker timeline */}
          <div style={{ background: '#181818', padding: '0 20px', position: 'relative' }}>
            <input
              type="range"
              min={0}
              max={duration}
              step={0.01}
              value={currentTime}
              onChange={handleSeek}
              style={{ width: '100%', accentColor: '#0d6efd', height: 6, margin: '10px 0' }}
            />
            {/* Progress bar markers */}
            <div className="progress-markers" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 0 }}>
              {duration > 0 &&
                annotations.map((ann, idx) => (
                  <div
                    key={ann.id || idx}
                    style={{
                      position: 'absolute',
                      left: `${(ann.timestamp / duration) * 100}%`,
                      top: -8,
                      width: 4,
                      height: 8,
                      background: '#0d6efd',
                      opacity: 0.7,
                      borderRadius: 2,
                    }}
                  />
                ))}
            </div>
          </div>
          {/* Controls row */}
          <div className="controls" style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '12px 20px', border: 0 }}>
            <button onClick={handlePlayPause} aria-label="Play/Pause">
              {playing ? <FiPause size={22} /> : <FiPlay size={22} />}
            </button>
            <button onClick={() => frameByFrame(-1)} title="Previous frame" aria-label="Previous frame">
              <FiChevronLeft size={20} />
            </button>
            <button onClick={() => frameByFrame(1)} title="Next frame" aria-label="Next frame">
              <FiChevronRight size={20} />
            </button>
            <span style={{ minWidth: 70, textAlign: 'center', fontVariantNumeric: 'tabular-nums' }}>
              {formatTime(currentTime)} / {formatTime(duration)}
            </span>
            {/* Playback speed buttons */}
            <div style={{ display: 'flex', alignItems: 'center', marginLeft: 12 }}>
              {PLAYBACK_RATES.map(rate => (
                <button
                  key={rate}
                  style={speedButtonStyle(rate)}
                  onClick={() => dispatch(setPlaybackRate(rate))}
                  aria-label={`Set playback speed to ${rate}x`}
                >
                  {rate}x
                </button>
              ))}
            </div>
            <button onClick={handleFullscreen} aria-label="Fullscreen">
              <FiMaximize size={20} />
            </button>
          </div>
          {/* Annotation toolbar and undo/redo row */}
          <div
            className="annotation-toolbar-bar"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 16, // More gap between annotation tools and undo/redo
              background: '#23272f',
              borderRadius: '0 0 12px 12px',
              borderTop: '1px solid #232323',
              padding: '8px 20px',
              marginBottom: 0,
              width: '100%',
              boxSizing: 'border-box',
              justifyContent: 'flex-start'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
              <AnnotationToolbar />
              <button onClick={() => dispatch(undo())} aria-label="Undo">
                <FiRotateCcw size={18} />
              </button>
              <button onClick={() => dispatch(redo())} aria-label="Redo">
                <FiRotateCw size={18} />
              </button>
            </div>
          </div>
        </div>
        {/* Description panel */}
        <div style={{
          flex: 1,
          background: '#23272f',
          border: '2px solid #232323',
          borderRadius: 16,
          padding: '24px 20px',
          color: '#fff',
          minWidth: 260,
          maxWidth: 340,
          boxShadow: '0 2px 12px rgba(0,0,0,0.12)',
          transition: 'box-shadow 0.2s',
          fontSize: '1.08rem',
          lineHeight: 1.6
        }}>
          <div style={{ fontWeight: 600, color: '#0d6efd', marginBottom: 8, fontSize: '1.15em' }}>
            Video Description
          </div>
          <div>
            This is a sample video for annotation. Use the toolbar below to draw, select, and edit annotations.
            You can pause the video to add or move annotations, and use the timeline to see where annotations appear.
          </div>
        </div>
      </div>
      {/* Bottom annotation panels */}
      <div style={{
        display: 'flex',
        gap: 24,
        margin: '32px auto 0 auto',
        maxWidth: 1200,
        justifyContent: 'center',
        alignItems: 'flex-start',
        marginLeft: 5 // Move annotation panels 5px to the right
      }}>
        <div style={{
          flex: 1,
          minWidth: 220,
          border: '2px solid #232323',
          borderRadius: 12,
          background: '#23272f',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          transition: 'box-shadow 0.2s',
          padding: 2
        }}>
          <AnnotationList />
        </div>
        <div style={{
          flex: 2,
          minWidth: 220,
          border: '2px solid #232323',
          borderRadius: 12,
          background: '#23272f',
          boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
          transition: 'box-shadow 0.2s',
          padding: 2
        }}>
          <AnnotationProperties />
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;