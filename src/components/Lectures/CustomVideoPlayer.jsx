import React, { useRef, useState, useEffect } from 'react';
import ReactPlayer from 'react-player';
import './Lectures.scss';

const CustomVideoPlayer = ({ url }) => {
  const playerRef = useRef(null);
  const containerRef = useRef(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(0.7);
  const [muted, setMuted] = useState(false);
  const [quality, setQuality] = useState('auto');
  const [availableQualities, setAvailableQualities] = useState([]);
  const [showControls, setShowControls] = useState(false);
  const [showQualityMenu, setShowQualityMenu] = useState(false);
  const [isMobile, setIsMobile] = useState(false);

  // Format time display (convert seconds to MM:SS format)
  const formatTime = (time) => {
    if (isNaN(time)) return '0:00';
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds.toString().padStart(2, '0')}`;
  };

  // Check if device is mobile and set up fullscreen API detection
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    checkMobile();
    window.addEventListener('resize', checkMobile);
    
    return () => {
      window.removeEventListener('resize', checkMobile);
    };
  }, []);

  // Handle video progress updates
  const handleProgress = (state) => {
    if (!state.seeking) {
      setCurrentTime(state.playedSeconds);
    }
  };

  // Get video duration
  const handleDuration = (duration) => {
    setDuration(duration);
  };

  // Toggle play/pause
  const togglePlay = () => {
    setIsPlaying(!isPlaying);
  };

  // Toggle mute
  const toggleMute = () => {
    setMuted(!muted);
  };

  // Handle volume change
  const handleVolumeChange = (e) => {
    const newVolume = parseFloat(e.target.value);
    setVolume(newVolume);
    if (newVolume === 0) {
      setMuted(true);
    } else {
      setMuted(false);
    }
  };

  // Handle timeline seek
  const handleSeek = (e) => {
    const time = parseFloat(e.target.value);
    setCurrentTime(time);
    playerRef.current?.seekTo(time);
  };

  // Handle fullscreen toggle with improved mobile support
  const handleFullscreen = () => {
    try {
      // Check if currently in fullscreen
      if (document.fullscreenElement || 
          document.webkitFullscreenElement || 
          document.mozFullScreenElement ||
          document.msFullscreenElement) {
        // Exit fullscreen
        if (document.exitFullscreen) {
          document.exitFullscreen();
        } else if (document.webkitExitFullscreen) { // Safari, Chrome
          document.webkitExitFullscreen();
        } else if (document.mozCancelFullScreen) { // Firefox
          document.mozCancelFullScreen();
        } else if (document.msExitFullscreen) { // IE/Edge
          document.msExitFullscreen();
        }
      } else {
        // Enter fullscreen
        const element = containerRef.current;
        if (element.requestFullscreen) {
          element.requestFullscreen();
        } else if (element.webkitRequestFullscreen) { // Safari, Chrome
          element.webkitRequestFullscreen();
        } else if (element.mozRequestFullScreen) { // Firefox
          element.mozRequestFullScreen();
        } else if (element.msRequestFullscreen) { // IE/Edge
          element.msRequestFullscreen();
        } else if (isMobile) {
          // Fallback for mobile: try to use video element directly
          const videoElement = document.querySelector('.react-player video');
          if (videoElement) {
            if (videoElement.requestFullscreen) {
              videoElement.requestFullscreen();
            } else if (videoElement.webkitEnterFullscreen) { // iOS Safari
              videoElement.webkitEnterFullscreen();
            } else if (videoElement.webkitRequestFullscreen) {
              videoElement.webkitRequestFullscreen();
            }
          }
        }
      }
    } catch (error) {
      console.error('Fullscreen error:', error);
    }
  };

  // Set video quality
  const changeQuality = (newQuality) => {
    setQuality(newQuality);
    setShowQualityMenu(false);
  };

  // Show/hide quality selection menu
  const toggleQualityMenu = () => {
    setShowQualityMenu(!showQualityMenu);
  };

  // Get available quality options when player loads
  const handleReady = (player) => {
    removeShareElements();
    
    // For YouTube videos, get quality options
    try {
      const iframe = document.querySelector('.react-player iframe');
      if (iframe && iframe.contentWindow) {
        const qualities = ['auto', '1080p', '720p', '480p', '360p', '240p'];
        setAvailableQualities(qualities);
      }
    } catch (error) {
      console.error('Error getting quality options:', error);
    }
  };

  // Remove YouTube sharing elements
  const removeShareElements = () => {
    try {
      const iframe = document.querySelector('.react-player iframe');
      if (iframe) {
        const iframeDoc = iframe.contentWindow.document;
  
        const style = document.createElement('style');
        style.textContent = `
          .ytp-watermark, /* YouTube logo watermark */
          .ytp-chrome-top, /* Top controls */
          .ytp-show-cards-title, /* Cards */
          .ytp-share-button, /* Share button */
          .ytp-share-panel, /* Share panel */
          .ytp-share-menu, /* Share menu */
          .ytp-button[aria-label*="Share"], /* Share button */
          .ytp-button[title*="Share"], /* Share button */
          .ytp-menuitem[aria-label*="Share"], /* Share menu item */
          [data-title-no-tooltip*="Share"], /* Share tooltip */
          [data-tooltip-text*="Share"], /* Share tooltip */
          .ytp-contextmenu, /* Context menu */
          .ytp-popup, /* Popups */
          .ytp-branding-logo, /* YouTube logo */
          .ytp-branding-icon /* YouTube icon */
          {
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

  // Toggle controls visibility (for mobile interaction)
  const toggleControlsVisibility = () => {
    setShowControls(!showControls);
  };

  // Handle YouTube quality change
  useEffect(() => {
    if (quality !== 'auto' && playerRef.current) {
      try {
        const iframe = document.querySelector('.react-player iframe');
        if (iframe && iframe.contentWindow) {
          const player = iframe.contentWindow.player;
          if (player && player.setPlaybackQuality) {
            const qualityLevel = quality.replace('p', '');
            player.setPlaybackQuality(qualityLevel);
          }
        }
      } catch (error) {
        console.error('Error setting quality:', error);
      }
    }
  }, [quality]);

  // Add observer to monitor iframe changes
  useEffect(() => {
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
    <div 
      ref={containerRef} 
      className={`video-container ${showControls ? 'controls-visible' : ''} ${isMobile ? 'mobile' : ''}`} 
      onContextMenu={e => e.preventDefault()}
    >
      <div className="player-wrapper">
        <ReactPlayer
          ref={playerRef}
          url={url}
          width="100%"
          height="100%"
          playing={isPlaying}
          volume={volume}
          muted={muted}
          onProgress={handleProgress}
          onDuration={handleDuration}
          onReady={handleReady}
          config={{
            youtube: {
              playerVars: {
                controls: 0,
                showinfo: 0,
                rel: 0,
                modestbranding: 1,
                disablekb: 0, // Allow keyboard controls on mobile
                iv_load_policy: 3,
                fs: 0,
                playsinline: 1,
                enablejsapi: 1,
                origin: window.location.origin
              },
              embedOptions: {
                controls: 0,
                disablekb: 0,
                enablejsapi: 1,
                iv_load_policy: 3,
                modestbranding: 1
              }
            }
          }}
          style={{ position: 'absolute', top: 0, left: 0 }}
        />
      </div>

      {/* Overlay for mobile taps to show controls */}
      <div 
        className="click-overlay" 
        onClick={toggleControlsVisibility}
      />

      {/* Play/pause overlay button for easy mobile access */}
      <div className="center-play-container" onClick={togglePlay}>
        {!isPlaying && (
          <div className="center-play-button">
            <svg className="center-play-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        )}
      </div>

      {/* Video controls bar */}
      {/* Mobile fullscreen button - large and centered for easy access */}
      {isMobile && (
        <div className="mobile-fullscreen-btn" onClick={handleFullscreen}>
          <svg className="mobile-fullscreen-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
          </svg>
        </div>
      )}

      <div className={`controls ${showControls ? 'force-show' : ''}`}>
        <button onClick={togglePlay} className="control-btn" aria-label={isPlaying ? "Pause" : "Play"}>
          {isPlaying ? (
            <svg className="control-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 9v6m4-6v6m7-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          ) : (
            <svg className="control-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          )}
        </button>

        <div className="time-controls">
          <span className="time-display">{formatTime(currentTime)}</span>
          <input
            type="range"
            min={0}
            max={duration || 0}
            value={currentTime}
            onChange={handleSeek}
            className="progress-bar"
            aria-label="Video progress"
          />
          <span className="time-display">{formatTime(duration)}</span>
        </div>

        <div className="control-buttons-group">
          <div className="volume-controls">
            <button onClick={toggleMute} className="control-btn volume-btn" aria-label={muted ? "Unmute" : "Mute"}>
              {muted || volume === 0 ? (
                <svg className="control-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2" />
                </svg>
              ) : volume < 0.5 ? (
                <svg className="control-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072" />
                </svg>
              ) : (
                <svg className="control-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5.586 15H4a1 1 0 01-1-1v-4a1 1 0 011-1h1.586l4.707-4.707C10.923 3.663 12 4.109 12 5v14c0 .891-1.077 1.337-1.707.707L5.586 15z" clipRule="evenodd" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.536 8.464a5 5 0 010 7.072" />
                </svg>
              )}
            </button>
            <div className="volume-slider-container">
              <input
                type="range"
                min={0}
                max={1}
                step={0.1}
                value={volume}
                onChange={handleVolumeChange}
                className="volume-slider"
                aria-label="Volume"
              />
            </div>
          </div>

          <div className="quality-controls">
            <button onClick={toggleQualityMenu} className="control-btn quality-btn" aria-label="Video quality">
              <svg className="control-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              <span className="quality-label">{quality}</span>
            </button>
            
            {showQualityMenu && (
              <div className="quality-menu">
                {availableQualities.map((q) => (
                  <button 
                    key={q} 
                    className={`quality-option ${q === quality ? 'active' : ''}`} 
                    onClick={() => changeQuality(q)}
                  >
                    {q}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button onClick={handleFullscreen} className="control-btn fullscreen-btn" aria-label="Fullscreen">
            <svg className="control-icon" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 8V4m0 0h4M4 4l5 5m11-1V4m0 0h-4m4 0l-5 5M4 16v4m0 0h4m-4 0l5-5m11 5l-5-5m5 5v-4m0 4h-4" />
            </svg>
          </button>
        </div>
      </div>

      <style jsx>{`
        .video-container {
          position: relative;
          width: 100%;
          padding-top: 56.25%;
          background: #000;
          overflow: hidden;
          border-radius: 12px;
          box-shadow: 0 10px 20px rgba(0, 0, 0, 0.2);
        }

        .player-wrapper {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
        }

        /* Overlay for click handling */
        .click-overlay {
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 48px;
          z-index: 1;
        }

        /* Center play button for mobile */
        .center-play-container {
          position: absolute;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 2;
          pointer-events: none;
        }

        .center-play-button {
          width: 80px;
          height: 80px;
          background: rgba(0, 0, 0, 0.5);
          border-radius: 50%;
          display: flex;
          justify-content: center;
          align-items: center;
          pointer-events: auto;
          cursor: pointer;
          opacity: 0.8;
          transition: all 0.3s ease;
        }

        .center-play-button:hover {
          transform: scale(1.1);
          background: rgba(230, 30, 77, 0.8);
        }

        .center-play-icon {
          width: 40px;
          height: 40px;
          color: white;
        }

        /* Control bar */
        .controls {
          position: absolute;
          bottom: 0;
          left: 0;
          right: 0;
          background: linear-gradient(to top, rgba(0, 0, 0, 0.9), rgba(0, 0, 0, 0.7) 50%, transparent);
          padding: 15px 15px 10px;
          display: flex;
          align-items: center;
          gap: 12px;
          opacity: 0;
          transition: opacity 0.3s ease, transform 0.3s ease;
          z-index: 2;
          transform: translateY(10px);
        }

        .controls.force-show {
          opacity: 1;
          transform: translateY(0);
        }

        .video-container:hover .controls {
          opacity: 1;
          transform: translateY(0);
        }

        /* Buttons */
        .control-btn {
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          padding: 8px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }

        .control-btn:hover {
          background: rgba(255, 255, 255, 0.2);
        }

        .control-icon {
          width: 24px;
          height: 24px;
        }

        /* Time display and slider */
        .time-controls {
          flex: 1;
          display: flex;
          align-items: center;
          gap: 10px;
          color: white;
          font-size: 14px;
        }

        .time-display {
          min-width: 40px;
          text-align: center;
          font-family: monospace;
        }

        .progress-bar {
          flex: 1;
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          position: relative;
          overflow: hidden;
        }

        .progress-bar::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #e61e4d;
          cursor: pointer;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
          margin-top: -4px;
        }

        .progress-bar::-moz-range-thumb {
          width: 14px;
          height: 14px;
          border-radius: 50%;
          background: #e61e4d;
          cursor: pointer;
          box-shadow: 0 0 5px rgba(0, 0, 0, 0.5);
          border: none;
        }

        /* Control buttons group - right side controls */
        .control-buttons-group {
          display: flex;
          align-items: center;
          gap: 12px;
        }

        /* Volume controls */
        .volume-controls {
          display: flex;
          align-items: center;
          gap: 8px;
          position: relative;
        }

        .volume-slider-container {
          width: 80px;
        }
        
        .volume-slider {
          height: 6px;
          border-radius: 3px;
          background: rgba(255, 255, 255, 0.2);
          cursor: pointer;
          width: 100%;
        }

        .volume-slider::-webkit-slider-thumb {
          -webkit-appearance: none;
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
        }

        .volume-slider::-moz-range-thumb {
          width: 12px;
          height: 12px;
          border-radius: 50%;
          background: white;
          cursor: pointer;
          border: none;
        }

        /* Quality selection */
        .quality-controls {
          position: relative;
        }

        .quality-btn {
          display: flex;
          align-items: center;
          gap: 5px;
          border-radius: 4px;
          padding: 6px 10px;
        }

        .quality-label {
          font-size: 12px;
          text-transform: uppercase;
        }

        .quality-menu {
          position: absolute;
          bottom: 40px;
          right: 0;
          background: rgba(0, 0, 0, 0.9);
          border-radius: 4px;
          overflow: hidden;
          width: 100px;
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.5);
        }

        .quality-option {
          width: 100%;
          padding: 8px 10px;
          text-align: left;
          background: none;
          border: none;
          color: white;
          cursor: pointer;
          font-size: 13px;
        }

        .quality-option:hover {
          background: rgba(255, 255, 255, 0.1);
        }

        .quality-option.active {
          background: #e61e4d;
          font-weight: bold;
        }

        /* Mobile fullscreen button */
        .mobile-fullscreen-btn {
          position: absolute;
          top: 15px;
          right: 15px;
          background: rgba(0, 0, 0, 0.5);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 5;
          cursor: pointer;
          opacity: 0.7;
          transition: opacity 0.3s, transform 0.3s;
        }
        
        .mobile-fullscreen-btn:hover, 
        .mobile-fullscreen-btn:active {
          opacity: 1;
          transform: scale(1.1);
        }
        
        .mobile-fullscreen-icon {
          width: 24px;
          height: 24px;
          color: white;
        }

        /* Mobile optimization */
        .mobile .volume-controls {
          display: flex;
        }
        
        .mobile .controls {
          padding: 15px 10px 10px;
        }

        .mobile .time-display {
          font-size: 12px;
          min-width: 35px;
        }
        
        .mobile .fullscreen-btn {
          display: none; /* Hide bottom fullscreen button on mobile since we have the corner one */
        }
        
        /* Smaller screens */
        @media (max-width: 576px) {
          .volume-slider-container {
            width: 60px;
          }
          
          .time-display {
            min-width: 35px;
            font-size: 11px;
          }
          
          .control-icon {
            width: 20px;
            height: 20px;
          }
          
          .controls {
            gap: 8px;
          }
          
          .quality-label {
            display: none;
          }
          
          .center-play-button {
            width: 60px;
            height: 60px;
          }
          
          .center-play-icon {
            width: 30px;
            height: 30px;
          }
        }
        
        /* Very small screens - adjust controls further */
        @media (max-width: 400px) {
          .volume-slider-container {
            display: none;
          }
          
          .control-buttons-group {
            gap: 5px;
          }
          
          .time-display {
            min-width: 30px;
            font-size: 10px;
          }
        }

        /* Fix for React Player */
        :global(.react-player) {
          pointer-events: none !important;
        }
        
        :global(.react-player iframe) {
          pointer-events: none !important;
        }

        /* Hide YouTube branding */
        :global(.ytp-watermark) {
          display: none !important;
        }
      `}</style>
    </div>
  );
};

export default CustomVideoPlayer;