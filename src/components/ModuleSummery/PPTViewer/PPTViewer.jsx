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
  const [isRendering, setIsRendering] = useState(false);
  const canvasRef = useRef(null);
  
  // Refs to store the actual current values for use in callbacks
  const currentPageRef = useRef(1);
  const scaleRef = useRef(1.0);
  
  // Update refs when state changes
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);
  
  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      try {
        const response = await axios.get(`${baseUrl}/api/fetch-module-details/${moduleId}`);
        setModuleDetails(response.data.data);
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
    let isMounted = true;
    
    const loadPdfDocument = async () => {
      if (!moduleDetails?.fileUrl) return;
      
      try {
        setLoading(true);
        
        const loadingTask = pdfjs.getDocument(moduleDetails.fileUrl);
        const pdf = await loadingTask.promise;
        
        if (isMounted) {
          setPdfDocument(pdf);
          setTotalPages(pdf.numPages);
          setCurrentPage(1);
          currentPageRef.current = 1;
        }
      } catch (err) {
        console.error("Error loading PDF:", err);
        if (isMounted) {
          setError('Failed to load PDF document');
        }
      } finally {
        if (isMounted) {
          setLoading(false);
        }
      }
    };

    loadPdfDocument();
    
    return () => {
      isMounted = false;
    };
  }, [moduleDetails]);

  const renderPage = async () => {
    if (!pdfDocument || !canvasRef.current || isRendering) return;
    
    try {
      setIsRendering(true);
      
      // Get the current page
      const pageNum = currentPageRef.current;
      const currentScale = scaleRef.current;
      
      console.log(`Rendering page ${pageNum} at scale ${currentScale}`);
      
      const page = await pdfDocument.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');
      
      // Clear previous content
      context.clearRect(0, 0, canvas.width, canvas.height);
      
      // Calculate viewport
      const container = canvas.parentElement;
      const containerWidth = container.clientWidth;
      
      const viewport = page.getViewport({ scale: 1.0 });
      const scaleFactor = Math.min(containerWidth / viewport.width, 1.0);
      const scaledViewport = page.getViewport({ scale: scaleFactor * currentScale });
      
      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;
      
      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport
      };
      
      await page.render(renderContext).promise;
      console.log("Rendering complete");
      
    } catch (err) {
      console.error("Error rendering page:", err);
    } finally {
      setIsRendering(false);
    }
  };

  // Effect to trigger page rendering when dependencies change
  useEffect(() => {
    renderPage();
  }, [pdfDocument, currentPage, scale]);

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      if (pdfDocument && !isRendering) {
        renderPage();
      }
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [pdfDocument, isRendering]);

  const goToPreviousPage = () => {
    if (currentPage > 1 && !isRendering) {
      const newPage = currentPage - 1;
      setCurrentPage(newPage);
      currentPageRef.current = newPage;
    }
  };

  const goToNextPage = () => {
    if (currentPage < totalPages && !isRendering) {
      const newPage = currentPage + 1;
      setCurrentPage(newPage);
      currentPageRef.current = newPage;
    }
  };

  const handleZoomIn = () => {
    if (!isRendering && scale < 3.0) {
      const newScale = Math.min(scale + 0.2, 3.0).toFixed(1);
      console.log(`Zoom in from ${scale} to ${newScale}`);
      setScale(parseFloat(newScale));
      scaleRef.current = parseFloat(newScale);
    }
  };

  const handleZoomOut = () => {
    if (!isRendering && scale > 0.5) {
      const newScale = Math.max(scale - 0.2, 0.5).toFixed(1);
      console.log(`Zoom out from ${scale} to ${newScale}`);
      setScale(parseFloat(newScale));
      scaleRef.current = parseFloat(newScale);
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
            disabled={currentPage <= 1 || isRendering}
            className="control-button"
          >
            Previous
          </button>
          <span className="page-info">
            {currentPage} / {totalPages}
          </span>
          <button 
            onClick={goToNextPage} 
            disabled={currentPage >= totalPages || isRendering}
            className="control-button"
          >
            Next
          </button>
          <button 
            onClick={handleZoomOut} 
            disabled={scale <= 0.5 || isRendering}
            className="control-button"
          >
            -
          </button>
          <span className="zoom-info">{Math.round(scale * 100)}%</span>
          <button 
            onClick={handleZoomIn} 
            disabled={scale >= 3.0 || isRendering}
            className="control-button"
          >
            +
          </button>
        </div>
      </div>
      <div className="pdf-wrapper">
        <div className="canvas-container">
          <canvas ref={canvasRef} className="pdf-canvas" />
          {isRendering && (
            <div className="rendering-indicator">Rendering...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default PptViewer;