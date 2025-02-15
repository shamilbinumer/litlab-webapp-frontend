import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoPlayCircleSharp } from 'react-icons/io5';
import { LuHeart, LuEye, LuLock } from 'react-icons/lu';
import baseUrl from '../../../baseUrl';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';
import PurchasePopup from '../../common/Alerts/PurchasePopup/PurchasePopup';
const VideoClasses = ({ paperId, paperTitle, isAccessible }) => {
  const [videoClasses, setVideoClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPurchasePopup, setShowPurchasePopup] = useState(false);

  useEffect(() => {
    const fetchVideoClasses = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${baseUrl}/api/fetch-vedio-classes/${paperId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch video classes');
        }

        const data = await response.json();
        setVideoClasses(data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchVideoClasses();
  }, [paperId]);

  const handleLockedClick = () => {
    setShowPurchasePopup(true);
  };

  const renderVideoItem = (video, index) => {
    const isLocked = !isAccessible && index > 1;
    const VideoWrapper = isLocked ? 'div' : Link;
    const wrapperProps = isLocked ? {
      onClick: handleLockedClick,
      style: { cursor: 'pointer' }
    } : {
      to: `/lectures/${paperTitle}/${paperId}/${video.id}`
    };

    return (
      <div className={`vedio-item row ${isLocked ? 'locked' : ''}`} key={video.id || index}>
        <div className="col-lg-5 col-md-5 col-sm-12 col-12">
          <VideoWrapper {...wrapperProps}>
            <div className="vedio-item-left">
              <div className="thumbnile">
                <img 
                  src={video.thumbnail || "/Images/teacher.jpg"} 
                  className="thumbnile-image" 
                  alt={video.title} 
                />
                {isLocked ? (
                  <div className="lock-overlay">
                    <LuLock className="lock-icon" />
                    <span>Purchase to unlock</span>
                  </div>
                ) : (
                  <IoPlayCircleSharp className="play-icon" />
                )}
              </div>
            </div>
          </VideoWrapper>
        </div>
        <div className="col-lg-7 col-md-7 col-sm-12 col-12">
          <div className="vedio-item-right">
            <h1>{video.title}</h1>
            <div className="teacer-name" style={{marginBottom:"1rem"}}>Module : {video.Module}</div>
            <div className="button-icon">
              {isLocked ? (
                <button 
                style={{backgroundColor:'gray',border:'1px solid gray',color:'white',cursor:'not-allowed'}}
                  className="disabled"
                  onClick={handleLockedClick}
                >
                  Locked <LuLock />
                </button>
              ) : (
                <VideoWrapper {...wrapperProps}>
                  <button>Watch now <LuEye /></button>
                </VideoWrapper>
              )}
              <LuHeart className="heart-icon" />
            </div>
          </div>
        </div>
      </div>
    );
  };

  if (loading) {
    return (
      <div>
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </div>
    );
  }

  if (error) {
    return <div>Error loading video classes: {error}</div>;
  }

  if (!videoClasses.length) {
    return <div>No video classes available for this paper.</div>;
  }

  return (
    <div className="videoMainWrapper">
      <div className="video-content-wrapper">
        <div className="main-content-right">
          <div className="vedio-list-wrapper">
            {videoClasses.map((video, index) => renderVideoItem(video, index))}
          </div>
        </div>
      </div>

      {showPurchasePopup && (
        <PurchasePopup onClose={() => setShowPurchasePopup(false)} />
      )}
    </div>
  );
};

VideoClasses.propTypes = {
  paperId: PropTypes.string.isRequired,
  paperTitle: PropTypes.string.isRequired,
  isAccessible: PropTypes.bool.isRequired,
};

export default VideoClasses;