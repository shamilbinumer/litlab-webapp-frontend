import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoPlayCircleSharp } from 'react-icons/io5';
import { LuHeart, LuEye } from 'react-icons/lu';
import baseUrl from '../../../baseUrl';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import PropTypes from 'prop-types';
// import './VideoClass.scss'
// ✅ Add PropTypes validation

const VideoClasses = ({ paperId ,paperTitle}) => {
  const [videoClasses, setVideoClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

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
            {videoClasses.map((video, index) => (
              // <Link to={`/lectures/${video.id}`} key={video.id || index}>
                <div className="vedio-item row" key={video.id || index}>
                  <div className="col-lg-5 col-md-5 col-sm-12 col-12">
                   <Link to={`/lectures/${paperTitle}/${paperId}/${video.id}`}>
                   <div className="vedio-item-left">
                      <div className="thumbnile">
                        <img 
                          src={video.thumbnail || "/Images/teacher.jpg"} 
                          className="thumbnile-image" 
                          alt={video.title} 
                        />
                        <IoPlayCircleSharp className="play-icon" />
                      </div>
                    </div>
                   </Link>
                  </div>
                  <div className="col-lg-7 col-md-7 col-sm-12 col-12">
                    <div className="vedio-item-right">
                      <h1>{video.title}</h1>
                      <div className="teacer-name" style={{marginBottom:"1rem"}}>Module : {video.Module}</div>
                      {/* <p className="vedio-description">{video.description}</p> */}
                      <div className="button-icon">
                      <Link to={`/lectures/${paperTitle}/${paperId}/${video.id}`}> <button>Watch now <LuEye /></button></Link>
                        <LuHeart className="heart-icon" />
                      </div>
                    </div>
                  </div>
                </div>
              // </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

VideoClasses.propTypes = {
  paperId: PropTypes.string.isRequired,  // or number, depending on your data
  paperTitle: PropTypes.string.isRequired,
};

export default VideoClasses;