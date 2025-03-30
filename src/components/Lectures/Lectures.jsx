import { useState, useEffect, useMemo } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import SideNave from '../common/SideNav/SideNave';
import './Lectures.scss';
import { FaArrowLeft, FaLock } from 'react-icons/fa';
import UserProfile from '../common/UserProfile/UserProfile';
import { IoPlayCircleSharp, IoSearchOutline } from 'react-icons/io5';
import { LuEye, LuHeart } from 'react-icons/lu';
import baseUrl from '../../baseUrl';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import CustomVideoPlayer from './CustomVideoPlayer';
import ScrollTopMount from '../common/ScrollTopMount';
import axios from 'axios';
import PurchasePopup from '../common/Alerts/PurchasePopup/PurchasePopup';

// Purchase Popup Component
// const PurchasePopup = ({ onClose }) => {
//   return (
//     <div className="purchase-popup-overlay">
//       <div className="purchase-popup-content">
//         <button className="close-button" onClick={onClose}>×</button>
//         <h2>Access Premium Content</h2>
//         <p>This content is available for premium members only.</p>
//         <div className="purchase-options">
//           <div className="purchase-option">
//             <h3>Monthly Plan</h3>
//             <p className="price">$9.99/month</p>
//             <ul>
//               <li>Access to all video lectures</li>
//               <li>Download study materials</li>
//               <li>Practice exams</li>
//             </ul>
//             <button className="purchase-button">Subscribe Now</button>
//           </div>
//           <div className="purchase-option featured">
//             <div className="popular-tag">Most Popular</div>
//             <h3>Annual Plan</h3>
//             <p className="price">$89.99/year</p>
//             <p className="saving">Save 25%</p>
//             <ul>
//               <li>All monthly plan features</li>
//               <li>Priority support</li>
//               <li>Exclusive webinars</li>
//             </ul>
//             <button className="purchase-button">Get Started</button>
//           </div>
//         </div>
//         <p className="guarantee">30-day money-back guarantee. No questions asked.</p>
//       </div>
//     </div>
//   );
// };

const Lectures = () => {
  const { videoId, paperId, paperTitle, isAccessible } = useParams();
  const [videoDetails, setVideoDetails] = useState(null);
  const [videoClasses, setVideoClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [showPurchasePopup, setShowPurchasePopup] = useState(false);
  const navigate = useNavigate();
  
  // Convert isAccessible string to boolean
  const isAccessibleBool = isAccessible === 'true';

  useEffect(() => {
    const checkUserAuthentication = async () => {
      try {
        const token = localStorage.getItem('authToken');
        if (!token) {
          navigate('/welcome');
          return;
        }

        const response = await axios.get(`${baseUrl}/api/profile`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (response.status !== 200) {
          navigate('/welcome');
        }
      } catch (error) {
        navigate('/welcome');
      }
    };

    checkUserAuthentication();
  }, [navigate]);

  useEffect(() => {
    const fetchVideoDetails = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${baseUrl}/api/fetch-vedio-details/${videoId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch video details');
        }

        const data = await response.json();
        setVideoDetails(data);
      } catch (err) {
        setError(err.message);
      } finally {
        setLoading(false);
      }
    };

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
      } catch (err) {
        setError(err.message);
      }
    };

    if (videoId) {
      fetchVideoDetails();
    }
    if (paperId) {
      fetchVideoClasses();
    }
  }, [videoId, paperId]);

  // Filter videos based on search query and exclude current video
  const filteredVideos = useMemo(() => {
    // First, filter out the current playing video
    let videosWithoutCurrent = videoClasses.filter(video => video.id !== videoId);
    
    // Then apply search filter if there's a search query
    if (!searchQuery.trim()) return videosWithoutCurrent;

    const searchTerm = searchQuery.toLowerCase().trim();
    return videosWithoutCurrent.filter(video =>
      video.title?.toLowerCase().includes(searchTerm) ||
      video.description?.toLowerCase().includes(searchTerm) ||
      video.teacherName?.toLowerCase().includes(searchTerm)
    );
  }, [videoClasses, searchQuery, videoId]);

  // Handle click on disabled video
  const handleDisabledVideoClick = (e) => {
    e.preventDefault();
    setShowPurchasePopup(true);
  };

  if (loading) {
    return (
      <div className="LecturesMainWrapper">
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </div>
    );
  }

  if (error) {
    return <div className="LecturesMainWrapper">Error loading video details: {error}</div>;
  }

  return (
    <div className='LecturesMainWrapper'>
      <ScrollTopMount/>
      <div className="lecture-main">
        <div className="left-side">
          <SideNave />
        </div>
        <div className="right-side">
         <div className="user-pro">
         <UserProfile />
         </div>
          <div></div>
          <Link to={`/paper-details/${paperTitle}/${paperId}`}>
            <div className="back-btn-container">
              <FaArrowLeft className='back-btn' />
            </div>
          </Link>
          <div className="content-wrapper">
            <div><img src="/Images/Group 1000004455.png" alt="" className='header-image' /></div>
            <div><h1>Lit Lab's Recorded Classes</h1></div>
            <div className="main-content">
              <div className="row">
                <div className="col-lg-7 main-content-left">
                  {/* <div className="search-bar desktop-search-bar">
                   <div> <IoSearchOutline className='search-icon' /></div>
                   <div>  <input
                      type="text"
                      placeholder='Search Live Classes, Recorded, Modules'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    /></div>
                  </div> */}
                  {videoDetails && videoDetails.tutorial && (
                    <div className="vedio-card">
                      <div className="vedio-container">
                        <div className="vedio-wrapper">
                          <CustomVideoPlayer url={videoDetails.tutorial} />
                        </div>
                      </div>
                      <div className="vedio-details">
                          <div>
                            <h1>{videoDetails.title}</h1>
                            <p>Description: {videoDetails.description}</p>
                          </div>
                          {/* <div>
                            <LuHeart className="fav-icon" />
                          </div> */}
                        </div>
                    </div>
                  )}
                  
                </div>
                <div className="col-lg-5 main-content-right">
                  <h3>
                    {filteredVideos.length} {filteredVideos.length === 1 ? 'Video' : 'Videos'} in this Paper
                    {searchQuery && ` (filtered from ${videoClasses.length - 1})`}
                  </h3>
                  <div className="vedio-list-wrapper">
                    {filteredVideos.length > 0 ? (
                      filteredVideos.map((video, index) => {
                        // Determine if this video item should be clickable
                        const isClickable = isAccessibleBool || index === 0;
                        
                        // Create the video item element
                        const videoItem = (
                          <div className={`vedio-item row ${!isClickable ? 'disabled-video' : ''}`}>
                            <div className="col-lg-5 col-md-5 col-sm-5 col-5">
                              <div className="vedio-item-left">
                                <div className="thumbnile">
                                  <img
                                    src={video.thumbnail || "/Images/teacher.jpg"}
                                    className='thumbnile-image'
                                    alt={video.title}
                                  />
                                  {isClickable ? (
                                    <IoPlayCircleSharp className="play-icon" />
                                  ) : (
                                    <div className="lock-icon-container">
                                      <FaLock className="lock-icon" />
                                    </div>
                                  )}
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-7 col-md-7 col-sm-7 col-7">
                              <div className="vedio-item-right">
                                <h1>
                                  {video.title}
                                  {/* {!isClickable && <FaLock className="title-lock-icon" />} */}
                                </h1>
                                <div className="teacer-name">{video.teacherName}</div>
                                <p className='vedio-description' style={{
                                  display: "-webkit-box",
                                  WebkitLineClamp: 2,
                                  WebkitBoxOrient: "vertical",
                                  overflow: "hidden",
                                }}>{video.description}</p>
                                <div className="button-icon">
                                  <button className={!isClickable ? 'disabled-button' : ''}>
                                    {isClickable ? (
                                      <>Watch now <LuEye /></>
                                    ) : (
                                      <>Unlock <FaLock /></>
                                    )}
                                  </button>
                                  {/* <LuHeart className='heart-icon' /> */}
                                </div>
                              </div>
                            </div>
                          </div>
                        );
                        
                        // Wrap in link only if clickable
                        return isClickable ? (
                          <Link to={`/lectures/${paperTitle}/${paperId}/${video.id}/${isAccessible}`} key={video.id || index}>
                            {videoItem}
                          </Link>
                        ) : (
                          <div key={video.id || index} className="disabled-link" onClick={handleDisabledVideoClick}>
                            {videoItem}
                          </div>
                        );
                      })
                    ) : (
                      <div className="no-results">
                        <p>No additional videos found.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Purchase Popup */}
      {showPurchasePopup && <PurchasePopup onClose={() => setShowPurchasePopup(false)} />}

      {/* Global styles to prevent copying and ensure elements stay hidden */}
      <style jsx global>{`
        .react-player {
          pointer-events: auto !important;
        }
        
        .react-player iframe {
          pointer-events: auto !important;
        }
        
        .ytp-copy-link-button,
        .ytp-share-button,
        .ytp-button[aria-label*="Copy"],
        .ytp-button[aria-label*="Share"],
        .ytp-copylink-icon,
        .ytp-share-icon,
        [title*="Copy"],
        [title*="Share"],
        .ytp-chrome-top-buttons {
          display: none !important;
          visibility: hidden !important;
          opacity: 0 !important;
          pointer-events: none !important;
          width: 0 !important;
          height: 0 !important;
          position: absolute !important;
          z-index: -1 !important;
        }
        
        .video-wrapper {
          user-select: none !important;
          -webkit-user-select: none !important;
          -moz-user-select: none !important;
          -ms-user-select: none !important;
          position: relative;
        }
        
        .video-wrapper::after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          pointer-events: none;
        }
        
        /* Styles for disabled videos */
        .disabled-video {
          opacity: 0.8;
          cursor: pointer !important;
          position: relative;
        }
        
        .disabled-video:after {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.05);
          z-index: 1;
        }
        
        /* Lock icon styles */
        .lock-icon-container {
          position: absolute;
          top: 50%;
          left: 50%;
          transform: translate(-50%, -50%);
          background-color: rgba(0, 0, 0, 0.6);
          width: 40px;
          height: 40px;
          border-radius: 50%;
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2;
        }
        
        .lock-icon {
          color: #ffcc00;
          font-size: 18px;
        }
        
        .title-lock-icon {
          font-size: 14px;
          color: #ffcc00;
          margin-left: 8px;
          vertical-align: middle;
        }
        
        .disabled-button {
          background-color: #f1f1f1 !important;
          color: #555 !important;
          border: 1px solid #ddd !important;
          cursor: pointer !important;
          display: flex;
          align-items: center;
          justify-content: center;
          gap: 8px;
        }
        
        .disabled-button svg {
          color: #ffcc00;
        }
        
        .disabled-link {
          cursor: pointer;
          text-decoration: none;
          color: inherit;
        }
        
        /* Purchase Popup Styles */
        .purchase-popup-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          display: flex;
          justify-content: center;
          align-items: center;
          z-index: 1000;
          animation: fadeIn 0.3s ease;
        }
        
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
        
        .purchase-popup-content {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 700px;
          padding: 30px;
          position: relative;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
          animation: slideUp 0.4s ease;
        }
        
        @keyframes slideUp {
          from { transform: translateY(50px); opacity: 0; }
          to { transform: translateY(0); opacity: 1; }
        }
        
        .close-button {
          position: absolute;
          top: 15px;
          right: 15px;
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #555;
          width: 30px;
          height: 30px;
          display: flex;
          align-items: center;
          justify-content: center;
          border-radius: 50%;
          transition: background 0.2s;
        }
        
        .close-button:hover {
          background: #f5f5f5;
        }
        
        .purchase-popup-content h2 {
          font-size: 24px;
          margin-bottom: 15px;
          color: #333;
          text-align: center;
        }
        
        .purchase-popup-content > p {
          text-align: center;
          color: #666;
          margin-bottom: 25px;
        }
        
        .purchase-options {
          display: flex;
          gap: 20px;
          margin-bottom: 20px;
          flex-wrap: wrap;
        }
        
        .purchase-option {
          flex: 1;
          min-width: 240px;
          border-radius: 10px;
          padding: 20px;
          border: 1px solid #eaeaea;
          display: flex;
          flex-direction: column;
          transition: transform 0.2s, box-shadow 0.2s;
          position: relative;
        }
        
        .purchase-option:hover {
          transform: translateY(-5px);
          box-shadow: 0 5px 15px rgba(0, 0, 0, 0.1);
        }
        
        .purchase-option.featured {
          border: 2px solid #4169E1;
          box-shadow: 0 5px 20px rgba(65, 105, 225, 0.15);
        }
        
        .popular-tag {
          position: absolute;
          top: -12px;
          left: 50%;
          transform: translateX(-50%);
          background: #4169E1;
          color: white;
          padding: 4px 12px;
          border-radius: 20px;
          font-size: 12px;
          font-weight: bold;
        }
        
        .purchase-option h3 {
          font-size: 20px;
          margin-bottom: 5px;
          color: #333;
        }
        
        .price {
          font-size: 24px;
          font-weight: bold;
          color: #333;
          margin-bottom: 5px;
        }
        
        .saving {
          color: #4CAF50;
          font-weight: bold;
          margin-bottom: 15px;
        }
        
        .purchase-option ul {
          list-style-type: none;
          padding: 0;
          margin: 15px 0;
          flex-grow: 1;
        }
        
        .purchase-option ul li {
          padding: 5px 0;
          color: #555;
          position: relative;
          padding-left: 25px;
        }
        
        .purchase-option ul li:before {
          content: "✓";
          color: #4CAF50;
          position: absolute;
          left: 0;
          font-weight: bold;
        }
        
        .purchase-button {
          background: #4169E1;
          color: white;
          border: none;
          padding: 12px;
          border-radius: 6px;
          font-weight: bold;
          cursor: pointer;
          transition: background 0.2s;
          width: 100%;
          margin-top: auto;
        }
        
        .purchase-button:hover {
          background: #3058D6;
        }
        
        .guarantee {
          text-align: center;
          color: #666;
          font-size: 14px;
          margin-top: 15px;
        }
        
        @media (max-width: 768px) {
          .purchase-options {
            flex-direction: column;
          }
          
          .purchase-popup-content {
            padding: 20px;
            max-height: 90vh;
            overflow-y: auto;
          }
        }
      `}</style>
    </div>
  );
};

export default Lectures;