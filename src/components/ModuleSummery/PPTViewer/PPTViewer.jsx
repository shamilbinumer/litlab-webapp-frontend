import axios from "axios";
import { useEffect, useState } from "react";
import baseUrl from "../../../baseUrl";
import { useParams } from "react-router-dom";
import './PptViewer.scss';

const PptViewer = () => {
  const { moduleId } = useParams();
  const [moduleDetails, setModuleDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/fetch-module-details/${moduleId}`);
        setModuleDetails(response.data.data);
        console.log("File URL:", response.data.data?.fileUrl);
      } catch (err) {
        console.error("Error fetching module details:", err);
        setError('Failed to fetch module details');
      } finally {
        setLoading(false);
      }
    };

    if (moduleId) {
      fetchModuleDetails();
    }
  }, [moduleId]);

  if (loading) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  // Only try to render when moduleDetails exists
  if (!moduleDetails || !moduleDetails.fileUrl) {
    return <div className="error-container">No file URL available</div>;
  }

  return (
    <div className="pdf-container">
      <div className="pdf-header">
        PDF Viewer
      </div>
      <div className="pdf-wrapper">
        <iframe
          src={`${moduleDetails.fileUrl}#toolbar=0&navpanes=0&view=fitH`}
          className="pdf-iframe"
          title="PDF Viewer"
          allow="fullscreen"
        />
      </div>
    </div>
  );
};

export default PptViewer;