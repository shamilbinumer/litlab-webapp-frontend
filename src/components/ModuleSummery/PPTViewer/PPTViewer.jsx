import React, { useEffect, useState, useRef } from "react";  
import axios from "axios";
import { useParams } from "react-router-dom";
import baseUrl from "../../../baseUrl";
import './PptViewer.scss';

// Import PDF.js correctly
import * as pdfjs from 'pdfjs-dist';

// Set the worker source correctly
pdfjs.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/pdf.worker.min.js`;

const PptViewer = () => {
  const { moduleId } = useParams();
  const [moduleDetails, setModuleDetails] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [pdfDocument, setPdfDocument] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [scale, setScale] = useState(1.0);
  const canvasRef = useRef(null);
  const renderingRef = useRef(false);

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

  useEffect(() => {
    const loadPdfDocument = async () => {
      if (!moduleDetails?.fileUrl) return;
      
      try {
        setLoading(true);
        
        // Load document directly rather than using iframe
        const loadingTask = pdfjs.getDocument(moduleDetails.fileUrl);
        const pdf = await loadingTask.promise;
        
        setPdfDocument(pdf);
        setTotalPages(pdf.numPages);
        setCurrentPage(1);
      } catch (err) {
        console.error("Error loading PDF:", err);
        setError('Failed to load PDF document');
      } finally {
        setLoading(false);
      }
    };

    loadPdfDocument();
  }, [moduleDetails]);

  const renderPage = async (pageNum, pageScale) => {
    if (!pdfDocument || renderingRef.current) return;
    
    try {
      renderingRef.current = true;
      const page = await pdfDocument.getPage(pageNum);
      const canvas = canvasRef.current;
      if (!canvas) {
        renderingRef.current = false;
        return;
      }
      
      const context = canvas.getContext('2d');
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate viewport based on container width for responsiveness
      const container = canvas.parentElement;
      const containerWidth = container.clientWidth;
      
      const viewport = page.getViewport({ scale: 1.0 });
      const scaleFactor = containerWidth / viewport.width;
      const scaledViewport = page.getViewport({ scale: scaleFactor * pageScale });
      
      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport
      };
      
      await page.render(renderContext).promise;
    } catch (err) {
      console.error("Error rendering page:", err);
    } finally {
      renderingRef.current = false;
    }
  };

  useEffect(() => {
    renderPage(currentPage, scale);
  }, [pdfDocument, currentPage, scale]);

  // Handle window resize for responsive rendering
  useEffect(() => {
    const handleResize = () => {
      // Re-render current page when window is resized
      if (pdfDocument && !renderingRef.current) {
        renderPage(currentPage, scale);
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pdfDocument, currentPage, scale]);

  const goToPreviousPage = () => {
    if (currentPage > 1 && !renderingRef.current) {
      setCurrentPage(prevPage => prevPage - 1);
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages && !renderingRef.current) {
      setCurrentPage(prevPage => prevPage + 1);
    }
  };

  const zoomIn = () => {
    if (!renderingRef.current) {
      setScale(prevScale => {
        const newScale = Math.min(prevScale + 0.2, 3.0);
        console.log(`Zoom in: ${prevScale} → ${newScale}`);
        return newScale;
      });
    }
  };

  const zoomOut = () => {
    if (!renderingRef.current) {
      setScale(prevScale => {
        const newScale = Math.max(prevScale - 0.2, 0.5);
        console.log(`Zoom out: ${prevScale} → ${newScale}`);
        return newScale;
      });
    }
  };

  if (loading && !pdfDocument) {
    return <div className="loading-container">Loading...</div>;
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!moduleDetails || !moduleDetails.fileUrl) {
    return <div className="error-container">No file URL available</div>;
  }

  return (
    <div className="pdf-container">
      <div className="pdf-header">
        <span>PDF Viewer</span>
        <div className="pdf-controls">
          <button 
            onClick={goToPreviousPage} 
            disabled={currentPage <= 1 || renderingRef.current}
            className="control-button"
          >
            Previous
          </button>
          <span className="page-info">
            {currentPage} / {totalPages}
          </span>
          <button 
            onClick={goToNextPage} 
            disabled={currentPage >= totalPages || renderingRef.current}
            className="control-button"
          >
            Next
          </button>
          <button 
            onClick={zoomOut} 
            disabled={scale <= 0.5 || renderingRef.current}
            className="control-button"
          >
            -
          </button>
          <span className="zoom-info">{Math.round(scale * 100)}%</span>
          <button 
            onClick={zoomIn} 
            disabled={scale >= 3.0 || renderingRef.current}
            className="control-button"
          >
            +
          </button>
        </div>
      </div>
      <div className="pdf-wrapper">
        <div className="canvas-container">
          <canvas ref={canvasRef} className="pdf-canvas" />
          {renderingRef.current && (
            <div className="rendering-indicator">Rendering...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PptViewer;