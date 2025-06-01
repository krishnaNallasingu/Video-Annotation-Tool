import React, { useRef, useEffect, useCallback, useState } from 'react';
import { useSelector } from 'react-redux';
import { useAppDispatch } from '../../store/hooks';
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
  const dispatch = useAppDispatch();
  const { playing, currentTime, duration, playbackRate } = useSelector((state: RootState) => state.videoPlayer);
  const { annotations } = useSelector((state: RootState) => state.annotations);

  // Responsive description example
  const description = `A professional web-based video annotation tool that allows users to
   watch videos and add timestamped annotations. This project is designed for efficient  video review, labeling, and collaborative feedback.`;

  const [showFullDesc, setShowFullDesc] = useState(false);
  const isLong = description.length > 180;

  // --- Style Objects ---
  const layoutStyles = {
    width: '100%',
    display: 'flex',
    flexDirection: 'row' as const,
    justifyContent: 'flex-start',
    alignItems: 'flex-start',
    gap: 100,
    maxWidth: 1300,
    margin: '0 auto',
    padding: '2rem 0'
  };

  const leftColStyles = {
    flex: 2,
    minWidth: 0,
    display: 'flex',
    flexDirection: 'column' as const,
    alignItems: 'center',
    gap: 10
  };

  const videoBoxStyles = {
    width: '100%',
    maxWidth: 800,
    background: '#23272f',
    borderRadius: 15,
    boxShadow: '0 4px 16px rgba(0,0,0,0.18)',
    overflow: 'hidden',
    marginBottom: 0,
    padding: 10,
    transition: 'box-shadow 0.3s, transform 0.3s'
  };

  const annotationPropsBoxStyles = {
    width: '100%',
    maxWidth: 800,
    background: '#23272f',
    borderRadius: 15,
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    marginTop: 0,
    padding: 10,
    minHeight: 80,
    transition: 'box-shadow 0.3s, transform 0.3s'
  };

  const rightColStyles = {
    flex: 1,
    minWidth: 260,
    maxWidth: 340,
    background: 'transparent',
    borderRadius: 10,
    boxShadow: 'none',
    padding: 0,
    height: 'fit-content',
    display: 'flex',
    flexDirection: 'column' as const,
    gap: 10
  };

  const descriptionBoxStyles = (showFullDesc: boolean) => ({
    background: '#23272f',
    borderRadius: 15,
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    padding: 10,
    marginBottom: 0,
    color: '#e3e6ef',
    fontSize: '1.05rem',
    lineHeight: 1.6,
    wordBreak: 'break-word' as const,
    transition: 'box-shadow 0.3s, transform 0.3s',
    maxHeight: showFullDesc ? 300 : 120,
    overflow: 'auto',
    position: 'relative' as const
  });

  const annotationListBoxStyles = {
    background: '#23272f',
    borderRadius: 15,
    boxShadow: '0 2px 8px rgba(0,0,0,0.12)',
    padding: 10,
    marginTop: 0,
    transition: 'box-shadow 0.3s, transform 0.3s'
  };


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
      } else if (e.key.toLowerCase() === 'f') {
        handleFullscreen();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
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
    color: '#fff',
    border: playbackRate === rate ? '1.5px solid #0d6efd' : '1.5px solid transparent',
    borderRadius: 8,
    padding: '6px 12px',
    margin: '0 2px',
    cursor: 'pointer',
    fontWeight: playbackRate === rate ? 700 : 400,
    transition: 'background 0.18s, border-color 0.18s, transform 0.18s',
    boxShadow: playbackRate === rate ? '0 2px 8px #0d6efd33' : 'none'
  });
  const formatTime = (t: number) => {
    const m = Math.floor(t / 60);
    const s = Math.floor(t % 60);
    return `${m}:${s.toString().padStart(2, '0')}`;
  };

  return (
    <div className="video-main-layout" style={layoutStyles}>
      {/* Left: Video + Properties */}
      <div className="video-left-col" style={leftColStyles}>
        {/* Video Player */}
        <div className="video-player-box" style={videoBoxStyles}>
          <div style={{ position: 'relative', width: '100%' }}>
            <video
              ref={videoRef}
              src="/sample.mp4"
              onTimeUpdate={handleTimeUpdate}
              onLoadedMetadata={handleLoadedMetadata}
              style={{
                width: '100%',
                height: 450,
                display: 'block',
                background: '#000',
                borderRadius: '12px 12px 0 0',
                transition: 'box-shadow 0.3s'
              }}
              tabIndex={0}
            />
            <AnnotationsCanvas currentTime={currentTime} playing={playing} />
          </div>
          {/* Seeker timeline */}
          <div style={{ background: '#181818', padding: '0 0', position: 'relative' }}>
            <input
              type="range"
              min={0}
              max={duration}
              step={0.05}
              value={currentTime}
              onChange={handleSeek}
              className="custom-seeker"
              style={{ width: '100%', height: 8, margin: '10px 0', background: 'transparent' }}
            />
            <div
              style={{
                position: 'absolute',
                left: 0,
                top: 0,
                height: 8,
                width: `${(currentTime / duration) * 100}%`,
                background: 'linear-gradient(90deg, #0d6efd 60%,rgb(253, 77, 13) 100%)',
                borderRadius: 4,
                pointerEvents: 'none',
                transition: 'width 0.1s'
              }}
            />
            {/* Progress bar markers */}
            <div className="progress-markers" style={{ position: 'absolute', left: 0, right: 0, top: 0, height: 0 }}>
              {duration > 0 &&
                annotations.map((ann, idx) => (
                  <div
                    key={ann.id || idx}
                    className="marker"
                    style={{
                      left: `${(ann.timestamp / duration) * 100}%`,
                    }}
                    tabIndex={0}
                  >
                    <div className="marker-tooltip">
                      {ann.type} @ {Math.round(ann.timestamp * 10) / 10}s
                    </div>
                  </div>
                ))}
            </div>
          </div>
          {/* Controls row */}
          <div className="controls" style={{ display: 'flex', alignItems: 'center', gap: 20, padding: '5px 80px 5px', border: 0 }}>
            <button className="player-btn" onClick={handlePlayPause} aria-label="Play/Pause">
              {playing ? <FiPause size={22} /> : <FiPlay size={22} />}
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
                  className="player-btn"
                >
                  {rate}x
                </button>
              ))}
            </div>
            <button className="player-btn" onClick={() => frameByFrame(-1)} title="Previous frame" aria-label="Previous frame">
              <FiChevronLeft size={20} />
            </button>
            <button className="player-btn" onClick={() => frameByFrame(1)} title="Next frame" aria-label="Next frame">
              <FiChevronRight size={20} />
            </button>
            <button className="player-btn" onClick={handleFullscreen} aria-label="Fullscreen">
              <FiMaximize size={20} />
            </button>
          </div>
          {/* Annotation toolbar and undo/redo row */}
          <div
            className="annotation-toolbar-bar"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 10,
              background: '#23272f',
              borderRadius: '0 0 12px 12px',
              borderTop: '1px solid #232323',
              padding: '9px 20px 0px',
              marginBottom: 0,
              width: '100%',
              boxSizing: 'border-box',
              justifyContent: 'flex-start'
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
              <AnnotationToolbar />
              <div
                style={{
                  display: 'flex',
                  gap: 10,
                  borderRadius: 8,
                  padding: '9px 4px 9px',
                  background: '#181c22'
                }}
                className="undo-redo-box"
              >
                <button className="player-btn" onClick={() => dispatch(undo())} aria-label="Undo">
                  <FiRotateCcw size={18} />
                </button>
                <button className="player-btn" onClick={() => dispatch(redo())} aria-label="Redo">
                  <FiRotateCw size={18} />
                </button>
              </div>
            </div>
          </div>
        </div>
        {/* Annotation Properties below video player */}
        <div className="annotation-properties-box" style={annotationPropsBoxStyles}>
          <AnnotationProperties />
        </div>
      </div>
      {/* Right: Video Description + Annotation List */}
      <aside className="video-right-col" style={rightColStyles}>
        {/* Video Description in its own box */}
        <div className="video-description-box" style={descriptionBoxStyles(showFullDesc)}>
          <div style={{ fontWeight: 600, color: '#2ecc71', marginBottom: 4, fontSize: '1.13em' }}>
            Video Description
          </div>
          <div style={{ display: 'inline', whiteSpace: 'pre-line' }}>
            {!showFullDesc ? (
              <>
                {description.slice(0, 95)}
                {isLong && (
                  <>
                    ...{' '}
                    <button
                      onClick={() => setShowFullDesc(true)}
                      className="read-more-btn"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0d6efd',
                        cursor: 'pointer',
                        fontWeight: 500,
                        fontSize: '1em',
                        padding: 0,
                        transition: 'color 0.2s, background 0.2s',
                        borderRadius: 6,
                        outline: 'none'
                      }}
                    >
                      Read more
                    </button>
                  </>
                )}
              </>
            ) : (
              <>
                {description}
                {isLong && (
                  <>
                    {' '}
                    <button
                      onClick={() => setShowFullDesc(false)}
                      className="read-more-btn"
                      style={{
                        background: 'none',
                        border: 'none',
                        color: '#0d6efd',
                        cursor: 'pointer',
                        fontWeight: 500,
                        fontSize: '1em',
                        padding: 0,
                        transition: 'color 0.2s, background 0.2s',
                        borderRadius: 6,
                        outline: 'none'
                      }}
                    >
                      Show less
                    </button>
                  </>
                )}
              </>
            )}
          </div>
          <style>
            {`
            .video-description-box:hover, .video-description-box:focus-within {
              box-shadow: 0 8px 32px #0d6efd33, 0 2px 8px rgba(0,0,0,0.18);
              transform: translateY(-2px) scale(1.01);
            }
            .read-more-btn:hover, .read-more-btn:focus {
              background: #0d6efd22;
              color: #fff;
              text-decoration: underline;
            }
          `}
          </style>
        </div>
        {/* Annotation List below description box */}
        <div className="annotation-list-box" style={annotationListBoxStyles}>
          <div
            style={{
              fontWeight: 600,
              color: '#2ecc71',
              fontSize: '1.13em',
              marginBottom: 4,
              letterSpacing: '0.01em'
            }}
          >
            Annotation List
          </div>
          <AnnotationList />
        </div>
      </aside>
      {/* Responsive styles and animations */}
      <style>
        {`
        .video-main-layout {
          transition: gap 0.3s;
        }
        .video-player-box, .annotation-properties-box, .video-right-col, .video-description-box, .annotation-list-box {
          will-change: box-shadow, transform;
        }
        .video-player-box:hover, .annotation-properties-box:hover, .video-description-box:hover, .annotation-list-box:hover {
          box-shadow: 0 8px 32px #0d6efd33, 0 2px 8px rgba(0,0,0,0.18);
          transform: translateY(-2px) scale(1.01);
        }
        .player-btn {
          background: #23272f;
          border: none;
          color: #f3f6fa;
          border-radius: 8px;
          padding: 6px 10px;
          margin: 0 2px;
          cursor: pointer;
          transition: background 0.18s, color 0.18s, transform 0.18s;
        }
        .player-btn:hover, .player-btn:focus {
          background: #0d6efd;
          color: #fff;
          transform: scale(1.08);
          outline: none;
        }
        @media (max-width: 1100px) {
          .video-main-layout {
            flex-direction: column;
            gap: 28px !important;
            align-items: stretch;
            max-width: 98vw;
          }
          .video-left-col, .video-player-box, .annotation-properties-box, .video-description-box, .annotation-list-box {
            max-width: 98vw !important;
            width: 100% !important;
          }
          .video-right-col {
            max-width: 98vw !important;
            width: 100% !important;
            margin: 0 auto;
            gap: 14px !important;
          }
        }
        @media (max-width: 700px) {
          .video-main-layout {
            padding: 0.5rem 0 !important;
            gap: 16px !important;
          }
          .video-player-box, .annotation-properties-box, .video-description-box, .annotation-list-box {
            max-width: 100vw !important;
            width: 100vw !important;
            border-radius: 8px !important;
            padding: 4px !important;
          }
          .video-player-box video {
            height: 220px !important;
            border-radius: 8px 8px 0 0 !important;
          }
        }
        input[type="range"].custom-seeker {
          -webkit-appearance: none;
          width: 100%;
          height: 8px;
          background: linear-gradient(90deg, #0d6efd 0%, #23272f 100%);
          border-radius: 4px;
          outline: none;
          transition: box-shadow 0.2s;
          box-shadow: 0 2px 8px #0d6efd22;
        }
        input[type="range"].custom-seeker:hover,
        input[type="range"].custom-seeker:focus {
          box-shadow: 0 4px 16px #0d6efd55;
          background: linear-gradient(90deg, #0d6efd 40%, #23272f 100%);
        }
        input[type="range"].custom-seeker::-webkit-slider-thumb {
          -webkit-appearance: none;
          appearance: none;
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #0d6efd;
          box-shadow: 0 2px 8px #0d6efd55;
          transition: transform 0.18s, box-shadow 0.18s;
          cursor: pointer;
        }
        input[type="range"].custom-seeker:hover::-webkit-slider-thumb,
        input[type="range"].custom-seeker:focus::-webkit-slider-thumb {
          transform: scale(1.18);
          box-shadow: 0 4px 16px #0d6efd88;
        }
        input[type="range"].custom-seeker::-moz-range-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #0d6efd;
          box-shadow: 0 2px 8px #0d6efd55;
          transition: transform 0.18s, box-shadow 0.18s;
          cursor: pointer;
        }
        input[type="range"].custom-seeker:hover::-moz-range-thumb,
        input[type="range"].custom-seeker:focus::-moz-range-thumb {
          transform: scale(1.18);
          box-shadow: 0 4px 16px #0d6efd88;
        }
        input[type="range"].custom-seeker::-ms-thumb {
          width: 18px;
          height: 18px;
          border-radius: 50%;
          background: #fff;
          border: 3px solid #0d6efd;
          box-shadow: 0 2px 8px #0d6efd55;
          transition: transform 0.18s, box-shadow 0.18s;
          cursor: pointer;
        }
        input[type="range"].custom-seeker:focus::-ms-fill-lower {
          background: #0d6efd;
        }
        input[type="range"].custom-seeker::-webkit-slider-runnable-track {
          height: 8px;
          border-radius: 4px;
        }
        input[type="range"].custom-seeker::-ms-fill-lower {
          background: #0d6efd;
        }
        input[type="range"].custom-seeker::-ms-fill-upper {
          background: #23272f;
        }
        input[type="range"].custom-seeker:focus {
          outline: none;
        }
        input[type="range"].custom-seeker::-ms-tooltip {
          display: none;
        }

        /* Progress marker styles */
        .progress-markers .marker {
          position: absolute;
          top: -1px;
          width: 4px;
          height: 10px;
          background:rgba(211, 243, 6, 0.84);
          opacity: 0.7;
          border-radius: 2px;
          transition: transform 0.15s, box-shadow 0.15s, background 0.15s;
          cursor: pointer;
          z-index: 2;
        }
        .progress-markers .marker:hover {
          transform: scale(1.4);
          background:rgb(179, 255, 0);
          box-shadow: 0 2px 12px #ffb30055;
          opacity: 1;
        }
        .progress-markers .marker-tooltip {
          position: absolute;
          left: 50%;
          top: -24px;
          transform: translateX(-50%);
          background: #23272f;
          color: #fff;
          padding: 4px 8px;
          border-radius: 5px;
          font-size: 0.64em;
          white-space: nowrap;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.15s;
          z-index: 10;
        }
        .progress-markers .marker:hover .marker-tooltip {
          opacity: 0.7;
        }
      `}
      </style>
    </div>
  );
};

export default VideoPlayer;