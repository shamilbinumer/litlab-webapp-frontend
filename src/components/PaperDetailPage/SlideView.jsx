import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import baseUrl from "../../baseUrl";
import Splash from "../common/Splash/Splash";

const SlideView = () => {
  const { videoId } = useParams();
  const [videoData, setVideoData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchVideoDetails = async () => {
        setLoading(true);
      try {
        const response = await axios.get(`${baseUrl}/api/fetch-vedio-details/${videoId}`);
        setVideoData(response.data);
        
      } catch (err) {
        setError("Failed to fetch video details");
      } finally {
        setLoading(false);
      }
    };

    if (videoId) {
      fetchVideoDetails();
    }
  }, [videoId]);

  if (loading) return <div><Splash/></div>;
  if (error) return <div>{error}</div>;

  return (
    <div >
      {videoData?.fileUrl? (
        <img src={videoData.fileUrl} alt="Slide Thumbnail" style={{display:'block',margin:'0 auto'}} />
      ) : (
        <p>No Thumbnail Available</p>
      )}
     
    </div>
  );
};

export default SlideView;
