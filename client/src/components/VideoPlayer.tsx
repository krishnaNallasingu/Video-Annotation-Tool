import React, { useRef, useState, useEffect } from 'react';
import AnnotationOverlay from './annotations/AnnotationOverlay';

type ToolType = 'select' | 'circle' | 'rectangle' | 'line' | 'text';

const VideoPlayer: React.FC = () => {
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const [tool, setTool] = useState<ToolType>('select');
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [playbackRate, setPlaybackRate] = useState(1);

  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' + seconds : seconds}`;
  };

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const handleLoadedMetadata = () => setDuration(video.duration);
    const handleTimeUpdate = () => setCurrentTime(video.currentTime);

    const handleKeyDown = (e: KeyboardEvent) => {
      if (document.activeElement?.tagName === 'INPUT') return;

      switch (e.key) {
        case ' ':
          e.preventDefault();
          togglePlayPause();
          break;
        case 'ArrowLeft':
          video.currentTime = Math.max(0, video.currentTime - 5);
          break;
        case 'ArrowRight':
          video.currentTime = Math.min(duration, video.currentTime + 5);
          break;
      }
    };

    video.addEventListener('loadedmetadata', handleLoadedMetadata);
    video.addEventListener('timeupdate', handleTimeUpdate);
    window.addEventListener('keydown', handleKeyDown);

    return () => {
      video.removeEventListener('loadedmetadata', handleLoadedMetadata);
      video.removeEventListener('timeupdate', handleTimeUpdate);
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [duration]);

  const togglePlayPause = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.paused) {
      video.play();
      setIsPlaying(true);
    } else {
      video.pause();
      setIsPlaying(false);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const video = videoRef.current;
    if (!video) return;

    const time = parseFloat(e.target.value);
    video.currentTime = time;
    setCurrentTime(time);
  };

  const handleFullscreen = () => {
    const video = videoRef.current;
    if (!video) return;

    if (video.requestFullscreen) {
      video.requestFullscreen();
    }
  };

  const handleFrameBack = () => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.max(0, video.currentTime - 1 / 30); // 30 FPS
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const handleFrameForward = () => {
    const video = videoRef.current;
    if (!video) return;

    const newTime = Math.min(duration, video.currentTime + 1 / 30);
    video.currentTime = newTime;
    setCurrentTime(newTime);
  };

  const changePlaybackSpeed = (rate: number) => {
    const video = videoRef.current;
    if (!video) return;

    video.playbackRate = rate;
    setPlaybackRate(rate);
  };

  return (
    <div className="video-player">
      {/* Video + Overlay */}
      <div style={{ position: 'relative' }}>
        <video
          ref={videoRef}
          src="/sample.mp4"
          width="100%"
          style={{ borderRadius: '12px' }}
          controls={false}
        />
        <AnnotationOverlay
          tool={tool}
          videoTime={currentTime}
          isPaused={!isPlaying}
        />
      </div>

      {/* Playback Controls */}
      <div className="controls">
        <button onClick={togglePlayPause}>
          {isPlaying ? 'Pause' : 'Play'}
        </button>

        <button onClick={handleFrameBack}>⏮️ Frame</button>
        <button onClick={handleFrameForward}>Frame ⏭️</button>

        <input
          type="range"
          min="0"
          max={duration}
          step="0.1"
          value={currentTime}
          onChange={handleSeek}
        />

        <span style={{ minWidth: '100px', textAlign: 'center' }}>
          {formatTime(currentTime)} / {formatTime(duration)}
        </span>

        <button onClick={handleFullscreen}>⛶ Fullscreen</button>
      </div>

      {/* Speed Control */}
      <div className="speed-buttons controls">
        <span>Speed:</span>
        {[0.5, 1, 1.25, 1.5, 2].map((speed) => (
          <button
            key={speed}
            onClick={() => changePlaybackSpeed(speed)}
            className={playbackRate === speed ? 'active' : ''}
          >
            {speed}x
          </button>
        ))}
      </div>

      {/* Tool Selection */}
      <div className="controls">
        <span>Tool:</span>
        {['select', 'rectangle', 'circle', 'line', 'text'].map((t) => (
          <button
            key={t}
            onClick={() => setTool(t as ToolType)}
            className={tool === t ? 'active' : ''}
          >
            {t}
          </button>
        ))}
      </div>
    </div>
  );
};

export default VideoPlayer;
