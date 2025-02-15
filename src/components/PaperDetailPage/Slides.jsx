import { useState, useEffect } from 'react';
import { LuEye, LuLock } from 'react-icons/lu';
import baseUrl from '../../baseUrl';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';
import PurchasePopup from '../common/Alerts/PurchasePopup/PurchasePopup';

const Slides = ({ paperId, paperTitle, isAccessible }) => {
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
                        <div className="teacer-name" style={{marginBottom:"1rem"}}>
                          Module : {video.Module}
                        </div>
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