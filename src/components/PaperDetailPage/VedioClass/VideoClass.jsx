import { useState, useEffect } from 'react';
import baseUrl from '../../../baseUrl';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { MdPlayCircle } from 'react-icons/md';
import { LuLock } from 'react-icons/lu';
import PurchasePopup from '../../common/Alerts/PurchasePopup/PurchasePopup';
import { FaCirclePlay } from 'react-icons/fa6';
import { Link } from 'react-router-dom';

const VideoClasses = ({ paperId, paperTitle, isAccessible }) => {
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [modules, setModules] = useState([]);
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [videoLoading, setVideoLoading] = useState(false);
  const [error, setError] = useState(null);
  const [purchasePopupIsOpen, setPurchasePopupIsOpen] = useState(false);

  const isModuleAccessible = (index) => {
    return isAccessible || index < 2;
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${baseUrl}/api/fetch-modules/${paperId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }

        const data = await response.json();
        setModules(data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchModules();
  }, [paperId]);

  useEffect(() => {
    if (!selectedModule) return;

    const fetchVideos = async () => {
      setVideoLoading(true);
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${baseUrl}/api/fetch-vedio-classes/${paperId}/${selectedModule.module}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch videos');
        }

        const data = await response.json();
        setVideos(data || []);
      } catch (err) {
        setError(err.message);
      } finally {
        setVideoLoading(false);
      }
    };

    fetchVideos();
  }, [selectedModule, paperId]);

  const handleModuleSelect = (module, index) => {
    if (!isModuleAccessible(index)) {
      setPurchasePopupIsOpen(true);
      return;
    }
    setSelectedModule(module);
    setSelectedVideo(null);
  };

  const handleVideoSelect = (video) => {
    setSelectedVideo(video);
  };

  const handleBack = () => {
    if (selectedVideo) {
      setSelectedVideo(null);
    } else {
      setSelectedModule(null);
    }
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center" }}>
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </div>
    );
  }

  if (error) {
    return <div className="error-message">Error: {error}</div>;
  }

  if (!selectedModule) {
    return (
      <div className="modules-container">
        <div className="modules-grid">
          {modules.map((module, index) => {
            const moduleAccessible = isModuleAccessible(index);

            return (
              <div
                key={module.id}
                className={`module-card ${!moduleAccessible ? 'locked' : ''}`}
                style={{
                  opacity: !moduleAccessible ? 0.8 : 1,
                  position: 'relative'
                }}
              >
                <div>
                  <h3>Module {module.module} : {module.title}</h3>
                  {module.description && <p>{module.description}</p>}
                  <div className="button-heart">
                    {moduleAccessible ? (
                      <button 
                        onClick={() => handleModuleSelect(module, index)}
                      >
                        View Videos <MdPlayCircle style={{ fontSize: '14px', marginLeft: '5px' }} />
                      </button>
                    ) : (
                      <button 
                        className="locked-button"
                        onClick={() => setPurchasePopupIsOpen(true)}
                      >
                        <LuLock className="lock-icon" />
                        Purchase to Unlock
                      </button>
                    )}
                  </div>
                </div>
                <div className="module-card-right">
                  <img src="/Images/Module-icon.png" alt="" />
                </div>
              </div>
            );
          })}
        </div>
        {purchasePopupIsOpen && (
          <PurchasePopup onClose={() => setPurchasePopupIsOpen(false)} />
        )}
      </div>
    );
  }

  if (!selectedVideo) {
    return (
      <div className="video-container">
        <div className="module-header">
          <button onClick={handleBack} className="back-button">
            ← Back to Modules
          </button>
          <h2>{selectedModule.title} Videos</h2>
        </div>

        {videoLoading ? (
          <div className="loading">
            <Box sx={{ width: '100%' }}>
              <LinearProgress />
            </Box>
          </div>
        ) : (
          <div className="videos-grid">
            {videos.map((video, index) => (
              <div 
                key={video.id || index} 
                className="video-card"
                onClick={() => handleVideoSelect(video)}
              >
                <div className="video-thumbnail">
                  <img 
                    src={video.thumbnail || "/Images/video-placeholder.png"} 
                    alt={video.title} 
                  />
                  <div className="play-button">
                    <MdPlayCircle />
                  </div>
                </div>
                <div className="video-info">
                  <h4>{video.title}</h4>
                <Link to={`/lectures/${paperTitle}/${paperId}/${video.id}`}><button>Play The Vedio <FaCirclePlay /></button></Link>
                </div>
              </div>
            ))}
            {!videoLoading && videos.length === 0 && (
              <div className="no-videos">
                No videos available for this module
              </div>
            )}
          </div>
        )}
      </div>
    );
  }

  return (
    <div className="video-player-container">
      <div className="video-header">
        <button onClick={handleBack} className="back-button">
          ← Back to Videos
        </button>
        <h2>{selectedVideo.title}</h2>
      </div>
      <div className="video-wrapper">
        {selectedVideo.videoUrl ? (
          <video 
            controls 
            className="video-player"
            poster={selectedVideo.thumbnail}
          >
            <source src={selectedVideo.videoUrl} type="video/mp4" />
            Your browser does not support the video tag.
          </video>
        ) : (
          <div className="video-error">
            Video URL not available
          </div>
        )}
      </div>
      <div className="video-description">
        <h3>Description</h3>
        <p>{selectedVideo.description || 'No description available'}</p>
      </div>
    </div>
  );
};

export default VideoClasses;