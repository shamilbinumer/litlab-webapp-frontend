import { useState, useEffect } from 'react';
import { LuEye, LuLock } from 'react-icons/lu';
import { IoIosHeartEmpty, IoIosHeart } from 'react-icons/io';
import baseUrl from '../../baseUrl';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';
import PurchasePopup from '../common/Alerts/PurchasePopup/PurchasePopup';
import CircularProgress from '@mui/material/CircularProgress';


const Slides = ({ paperId, paperTitle, isAccessible }) => {
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

  // Check if slide is in wishlist
  const isInWishlist = (slideId) => {
    return wishlistItems.some(item => item.id === slideId);
  };

  // Handle wishlist toggle
  const handleWishlist = async (slideId, e) => {
    e.preventDefault();
    e.stopPropagation();

    setLoadingWishlist(prev => ({ ...prev, [slideId]: true }));

    try {
      const token = localStorage.getItem('authToken');
      if (!token) {
        throw new Error('No authentication token found');
      }

      if (isInWishlist(slideId)) {
        // Remove from wishlist
        const response = await fetch(`${baseUrl}/api/delete-wishlist-item/${slideId}`, {
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
            message: 'Slide removed from wishlist'
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
            id: slideId,
            category: 'slide'
          })
        });

        if (response.ok) {
          await fetchWishlistItems();
          setWishlistAlert({
            show: true,
            message: 'Slide added to wishlist'
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
      setLoadingWishlist(prev => ({ ...prev, [slideId]: false }));
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
            {videoClasses.map((video, index) => {
              const isLocked = !isAccessible && index > 1;

              return (
                <div className="vedio-item row" key={video.id || index}>
                  <div>
                    <div
                      className={`vedio-item-right ${isLocked ? 'locked' : ''}`}
                      style={{
                        backgroundColor: isLocked ? '#e0e0e0' : '#6BCCE5',
                        padding: '1rem',
                        borderRadius: '10px',
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "space-between",
                        opacity: isLocked ? 0.8 : 1,
                        cursor: isLocked ? 'pointer' : 'default'
                      }}
                      onClick={isLocked ? handleLockedClick : undefined}
                    >
                      <div>
                        <h1>{video.title}</h1>
                        <div className="teacer-name" style={{ marginBottom: "1rem" }}>
                          Module : {video.Module}
                        </div>
                        <div className="button-icon">
                          {isLocked ? (
                            <button
                              className="locked-button"
                              onClick={handleLockedClick}
                              style={{
                                backgroundColor: '#999',
                                cursor: 'pointer',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}
                            >
                              Locked <LuLock />
                            </button>
                          ) : (
                            <a href={video.fileUrl} target='_blank' rel="noopener noreferrer">
                              <button style={{
                                display: 'flex',
                                alignItems: 'center',
                                gap: '8px'
                              }}>
                                View Slide <LuEye />
                              </button>
                            </a>
                          )}
                        </div>
                      </div>
                      <div style={{ paddingRight: '1rem' }}>
                        <button
                          className="wishlist-btn"
                          onClick={(e) => handleWishlist(video.id, e)}
                          disabled={loadingWishlist[video.id]}
                          style={{
                            background: 'none',
                            border: 'none',
                            padding: 0,
                            cursor: 'pointer'
                          }}
                        >
                          {loadingWishlist[video.id] ? (
                            <span className="loading-wishlist" style={{ fontSize: '26px' }}> <Box sx={{ display: 'flex' }}>
                              <CircularProgress size={22} />
                            </Box></span>
                          ) : isInWishlist(video.id) ? (
                            <IoIosHeart style={{
                              fontSize: '26px',
                              color: '#ff0000',
                              transition: 'all 0.3s ease'
                            }} />
                          ) : (
                            <IoIosHeartEmpty style={{
                              fontSize: '26px',
                              transition: 'all 0.3s ease'
                            }} />
                          )}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {showPurchasePopup && (
        <PurchasePopup onClose={() => setShowPurchasePopup(false)} />
      )}
    </div>
  );
};

Slides.propTypes = {
  paperId: PropTypes.string.isRequired,
  paperTitle: PropTypes.string.isRequired,
  isAccessible: PropTypes.bool.isRequired,
};

export default Slides;