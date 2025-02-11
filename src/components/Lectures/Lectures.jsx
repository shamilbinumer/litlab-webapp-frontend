import { useState, useEffect, useMemo } from 'react';
import { Link, useParams } from 'react-router-dom';
import SideNave from '../common/SideNav/SideNave';
import './Lectures.scss';
import { FaArrowLeft } from 'react-icons/fa';
import UserProfile from '../common/UserProfile/UserProfile';
import { IoPlayCircleSharp, IoSearchOutline } from 'react-icons/io5';
import { LuEye, LuHeart } from 'react-icons/lu';
import baseUrl from '../../baseUrl';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';

const Lectures = () => {
  const { videoId, paperId,paperTitle } = useParams();
  const [videoDetails, setVideoDetails] = useState(null);
  const [videoClasses, setVideoClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');

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

  // Filter videos based on search query
  const filteredVideos = useMemo(() => {
    if (!searchQuery.trim()) return videoClasses;

    const searchTerm = searchQuery.toLowerCase().trim();
    return videoClasses.filter(video =>
      video.title?.toLowerCase().includes(searchTerm) ||
      video.description?.toLowerCase().includes(searchTerm) ||
      video.teacherName?.toLowerCase().includes(searchTerm)
    );
  }, [videoClasses, searchQuery]);

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
      <div className="lecture-main">
        <div className="left-side">
          <SideNave />
        </div>
        <div className="right-side">
          <UserProfile />
          <div></div>
          <Link to={`/paper-details/${paperTitle}/${paperId}`}>
            <div className="back-btn-container">
              <FaArrowLeft className='back-btn' />
            </div>
          </Link>
          <div className="content-wrapper">
            <div><img src="/Images/Group 1000004455.png" alt="" className='header-image' /></div>
            <div><h1>Lit Lab s Recorded Classes</h1></div>
            <div className="main-content">
              <div className="row">
                <div className="col-lg-7 main-content-left">
                  <div className="search-bar">
                    <IoSearchOutline className='search-icon' />
                    <input
                      type="text"
                      placeholder='Search Live Classes, Recorded, Modules'
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                  </div>
                  {videoDetails && (
                    <div className="vedio-card">
                      <div className="vedio-container">
                        <a href={videoDetails.tutorial} target='_blank'>
                          <img src="/Images/playicon.png" alt="" className="play-image" />
                          <img
                            src={videoDetails.thumbnail || "/Images/teacher.jpg"}
                            className='main-img'
                            alt={videoDetails.title}
                          /></a>
                        <div className="vedio-details">
                          <div>
                            <h1>{videoDetails.title}</h1>
                            <p>Description: {videoDetails.description}</p>
                          </div>
                          <div>
                            <LuHeart className='fav-icon' />
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
                <div className="col-lg-5 main-content-right">
                  <h3>
                    {filteredVideos.length} Vedio in this Paper
                    {searchQuery && ` (filtered from ${videoClasses.length})`}
                  </h3>
                  <div className="vedio-list-wrapper">
                    {filteredVideos.length > 0 ? (
                      filteredVideos.map((video, index) => (
                        <Link to={`/lectures/${paperId}/${video.id}`} key={video.id || index}>
                          <div className="vedio-item row">
                            <div className="col-lg-5 col-md-5 col-sm-5 col-5">
                              <div className="vedio-item-left">
                                <div className="thumbnile">
                                  <img
                                    src={video.thumbnail || "/Images/teacher.jpg"}
                                    className='thumbnile-image'
                                    alt={video.title}
                                  />
                                  <IoPlayCircleSharp className='play-icon' />
                                </div>
                              </div>
                            </div>
                            <div className="col-lg-7 col-md-7 col-sm-7 col-7">
                              <div className="vedio-item-right">
                                <h1>{video.title}</h1>
                                <div className="teacer-name">{video.teacherName}</div>
                                <p className='vedio-description'>{video.description}</p>
                                <div className="button-icon">
                                  <button>Watch now <LuEye /></button>
                                  <LuHeart className='heart-icon' />
                                </div>
                              </div>
                            </div>
                          </div>
                        </Link>
                      ))
                    ) : (
                      <div className="no-results">
                        <p>No videos found matching your search.</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Lectures;