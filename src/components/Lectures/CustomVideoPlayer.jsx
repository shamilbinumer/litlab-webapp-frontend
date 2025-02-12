import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';

const CustomVideoPlayer = ({ url }) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);

  const formatTime = (time) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  const handleProgress = (state) => {
    setCurrentTime(state.playedSeconds);
  };

  const handleDuration = (duration) => {
    setDuration(duration);
  };

  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
  };

  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    playerRef.current?.seekTo(time);
  };

  const handleFullscreen = () => {
    if (containerRef.current?.requestFullscreen) {
      containerRef.current.requestFullscreen();
    }
  };

  // Function to remove sharing elements
  const removeShareElements = () => {
    try {
      const iframe = document.querySelector('.react-player iframe');
      if (iframe) {
        const iframeDoc = iframe.contentWindow.document;
        
        const style = document.createElement('style');
        style.textContent = `
          .ytp-chrome-top,
          .ytp-show-cards-title,
          .ytp-share-button,
          .ytp-share-panel,
          .ytp-share-menu,
          .ytp-button[aria-label*="Share"],
          .ytp-button[title*="Share"],
          .ytp-menuitem[aria-label*="Share"],
          [data-title-no-tooltip*="Share"],
          [data-tooltip-text*="Share"],
          .ytp-contextmenu,
          .ytp-popup {
            display: none !important;
            visibility: hidden !important;
            opacity: 0 !important;
            width: 0 !important;
            height: 0 !important;
            position: absolute !important;
            pointer-events: none !important;
          }
          
          .ytp-chrome-controls {
            z-index: 1;
          }
        `;
        iframeDoc.head.appendChild(style);
      }
    } catch (error) {
      console.error('Error removing share elements:', error);
    }
  };

  useEffect(() => {
    // Add observer to handle dynamically added elements
    const observer = new MutationObserver(() => {
      removeShareElements();
    });

    const iframe = document.querySelector('.react-player iframe');
    if (iframe) {
      try {
        observer.observe(iframe.contentWindow.document.body, {
          childList: true,
          subtree: true
        });
      } catch (error) {
        console.error('Error setting up observer:', error);
      }
    }

    return () => observer.disconnect();
  }, []);

  return (
    <div ref={containerRef} className="video-container" onContextMenu={e => e.preventDefault()}>
      <div className="player-wrapper">
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          playing={isPlaying}
          volume={volume}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onReady={removeShareElements}
          config={{
            youtube: {
              playerVars: {
                controls: 0,
                showinfo: 0,
                rel: 0,
                modestbranding: 1,
                disablekb: 1,
                iv_load_policy: 3,
                fs: 0,
                playsinline: 1,
                enablejsapi: 1,
                origin: window.location.origin
              },
              embedOptions: {
                controls: 0,
                disablekb: 1,
                enablejsapi: 1,
                iv_load_policy: 3,
                modestbranding: 1
              }
            }
          }}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>

      {/* Overlay to prevent clicking on YouTube controls */}
      <div className="click-overlay" />

      <div className="controls">
        <button onClick={togglePlay} className="control-btn">
          {isPlaying ? (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>

        <div className="time-controls">
          <span>{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="progress-bar"
          />
          <span>{formatTime(duration)}</span>
        </div>

        <div className="volume-controls">
          <input
            type="range"
            min={0}
            max={1}
            step={0.1}
            value={volume}
            onChange={handleVolumeChange}
            className="volume-slider"
          />
        </div>

        <button onClick={handleFullscreen} className="control-btn">
          <svg className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </button>
      </div>

      <style jsx>{`
        .video-container {
          position: relative;
          width: 100%;
          padding-top: 56.25%;
          background: #000;
          overflow: hidden;
        }

        .player-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        .click-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 48px;
          z-index: 1;
        }

        .controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: rgba(0, 0, 0, 0.7);
          padding: 10px;
          display: flex;
          align-items: center;
          gap: 10px;
          opacity: 0;
          transition: opacity 0.3s;
          z-index: 2;
        }

        .video-container:hover .controls {
          opacity: 1;
        }

        .control-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 5px;
          display: flex;
          align-items: center;
          justify-content: center;
        }

        .control-btn svg {
          width: 24px;
          height: 24px;
        }

        .time-controls {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          font-size: 14px;
        }

        .progress-bar {
          flex: 1;
        }

        .volume-controls {
          width: 100px;
        }

        input[type="range"] {
          -webkit-appearance: none;
          width: 100%;
          height: 5px;
          border-radius: 2px;
          background: rgba(255, 255, 255, 0.3);
        }

        input[type="range"]::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }

        :global(.react-player) {
          pointer-events: none !important;
        }
        
        :global(.react-player iframe) {
          pointer-events: none !important;
        }
      `}</style>
    </div>
  );
};

export default CustomVideoPlayer;