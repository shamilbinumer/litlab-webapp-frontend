import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoPlayCircleSharp } from 'react-icons/io5';
import { LuHeart, LuEye, LuLock } from 'react-icons/lu';
import { IoIosHeart, IoIosHeartEmpty } from 'react-icons/io';
import baseUrl from '../../../baseUrl';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';
import PurchasePopup from '../../common/Alerts/PurchasePopup/PurchasePopup';
import CircularProgress from '@mui/material/CircularProgress';

const VideoClasses = ({ paperId, paperTitle, isAccessible }) => {
  const [videoClasses, setVideoClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showPurchasePopup, setShowPurchasePopup] = useState(false);
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loadingWishlist, setLoadingWishlist] = useState({});
  const [wishlistAlert, setWishlistAlert] = useState({ show: false, message: '' });

  // Fetch wishlist items
  const fetchWishlistItems = async () => {
    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${baseUrl}/api/fetch-wishlist-items`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch wishlist items');
      }

      const data = await response.json();
      setWishlistItems(data.wishlist || []);
    } catch (error) {
      console.error("Error fetching wishlist items:", error);
    }
  };

  // Check if video is in wishlist
  const isInWishlist = (videoId) => {
    return wishlistItems.some(item => item.id === videoId);
  };

  // Handle wishlist toggle
  const handleWishlist = async (videoId, e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setLoadingWishlist(prev => ({ ...prev, [videoId]: true }));

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (isInWishlist(videoId)) {
        // Remove from wishlist
        const response = await fetch(`${baseUrl}/api/delete-wishlist-item/${videoId}`, {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          }
        });

        if (response.ok) {
          await fetchWishlistItems();
          setWishlistAlert({
            show: true,
            message: 'Video removed from wishlist'
          });
        }
      } else {
        // Add to wishlist
        const response = await fetch(`${baseUrl}/api/add-to-wishlist`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            id: videoId,
            category: 'video'
          })
        });

        if (response.ok) {
          await fetchWishlistItems();
          setWishlistAlert({
            show: true,
            message: 'Video added to wishlist'
          });
        }
      }
    } catch (error) {
      console.error("Error updating wishlist:", error);
      setWishlistAlert({
        show: true,
        message: 'Error updating wishlist'
      });
    } finally {
      setLoadingWishlist(prev => ({ ...prev, [videoId]: false }));
      setTimeout(() => {
        setWishlistAlert({ show: false, message: '' });
      }, 3000);
    }
  };

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
    fetchWishlistItems(); // Fetch wishlist items when component mounts
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
              <button
                className="wishlist-btn"
                onClick={(e) => handleWishlist(video.id, e)}
                disabled={loadingWishlist[video.id]}
                style={{ background: 'none', border: 'none', padding: 0 }}
              >
                {loadingWishlist[video.id] ? (
                  <span className="loading-wishlist">  <Box sx={{ display: 'flex' }}>
                  <CircularProgress size={22} /> 
              </Box></span>
                ) : isInWishlist(video.id) ? (
                  <IoIosHeart className="heart-icon active" style={{color:'red'}} />
                ) : (
                  <IoIosHeartEmpty  className="heart-icon" />
                )}
              </button>
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
      {/* Wishlist Alert */}
      {wishlistAlert.show && (
        <div className="wishlist-alert" 
          style={{
            position: 'fixed',
            top: '20px',
            right: '20px',
            padding: '10px 20px',
            backgroundColor: '#4CAF50',
            color: 'white',
            borderRadius: '4px',
            zIndex: 1000,
            animation: 'fadeIn 0.3s ease-in-out'
          }}
        >
          {wishlistAlert.message}
        </div>
      )}

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