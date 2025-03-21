import { useEffect, useState, useRef } from "react";
import axios from "axios";
import { Link, useNavigate, useParams } from "react-router-dom";
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
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isPdfAccessible, setIsPdfAccessible] = useState(false);
  const navigate = useNavigate();
  
  // Container reference for responsive calculations
  const containerRef = useRef(null);

  // Refs to store the actual current values for use in callbacks
  const currentPageRef = useRef(1);
  const scaleRef = useRef(1.0);
  const isMountedRef = useRef(true);

  // Update refs when state changes
  useEffect(() => {
    currentPageRef.current = currentPage;
  }, [currentPage]);

  useEffect(() => {
    scaleRef.current = scale;
  }, [scale]);
  
  // Cleanup on unmount
  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  useEffect(() => {
    const fetchModuleDetails = async () => {
      if (!moduleId) return;
      
      try {
        setLoading(true);
        const response = await axios.get(`${baseUrl}/api/fetch-module-details/${moduleId}`);
        
        if (isMountedRef.current) {
          setModuleDetails(response.data.data);
        }
      } catch (err) {
        console.error("Error fetching module details:", err);
        if (isMountedRef.current) {
          setError('Failed to fetch module details');
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    fetchModuleDetails();
  }, [moduleId]);

  // Check user authentication on component mount
  useEffect(() => {
    checkUserAuthentication();
  }, []);
  
  const checkUserAuthentication = async () => {
    setIsLoading(true);
    setError(null);

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
      
      if (isMountedRef.current) {
        setUser(response.data.user);
      }

      if (response.status !== 200) {
        throw new Error('Failed to fetch user data');
      }
    } catch (error) {
      if (isMountedRef.current) {
        setError(error.message);
        navigate('/welcome');
      }
    } finally {
      if (isMountedRef.current) {
        setIsLoading(false);
      }
    }
  };

  // Check if PDF is accessible based on user's purchased courses
  useEffect(() => {
    if (user && moduleDetails) {
      // Check if user has purchased courses array
      if (user.purchasedCourses && Array.isArray(user.purchasedCourses)) {
        // Check if current module's paperId is in the user's purchasedCourses array
        const isAccessible = user.purchasedCourses.some(course =>
          course.courseId === moduleDetails.paperId ||
          course.courseId === moduleDetails.courseId
        );
        setIsPdfAccessible(isAccessible);
      } else {
        // If purchasedCourses doesn't exist or isn't an array
        setIsPdfAccessible(false);
      }
    }
  }, [user, moduleDetails]);

  // Load PDF document when module details are available
  useEffect(() => {
    if (!moduleDetails?.fileUrl) return;

    const loadPdfDocument = async () => {
      try {
        setLoading(true);

        // Use an AbortController to handle cancellation
        const controller = new AbortController();
        const signal = controller.signal;

        const loadingTask = pdfjs.getDocument({
          url: moduleDetails.fileUrl,
          disableStream: false,
          disableAutoFetch: false,
          cMapUrl: `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjs.version}/cmaps/`,
          cMapPacked: true,
        });

        const pdf = await loadingTask.promise;

        if (isMountedRef.current) {
          setPdfDocument(pdf);
          setTotalPages(pdf.numPages);
          setCurrentPage(1);
          currentPageRef.current = 1;
        }
      } catch (err) {
        console.error("Error loading PDF:", err);
        if (isMountedRef.current && !err.message.includes('aborted')) {
          setError('Failed to load PDF document');
        }
      } finally {
        if (isMountedRef.current) {
          setLoading(false);
        }
      }
    };

    loadPdfDocument();
  }, [moduleDetails]);

  // Handle window resize with debounce to improve performance
  useEffect(() => {
    let resizeTimer;
    
    const handleResize = () => {
      clearTimeout(resizeTimer);
      resizeTimer = setTimeout(() => {
        if (pdfDocument && canvasRef.current && !isRendering) {
          renderPage();
        }
      }, 250); // 250ms debounce
    };

    window.addEventListener('resize', handleResize);
    
    // Handle orientation change specifically for mobile
    window.addEventListener('orientationchange', () => {
      // Wait slightly longer after orientation change
      setTimeout(handleResize, 500);
    });
    
    return () => {
      window.removeEventListener('resize', handleResize);
      window.removeEventListener('orientationchange', handleResize);
      clearTimeout(resizeTimer);
    };
  }, [pdfDocument, isRendering]);

  const renderPage = async () => {
    if (!pdfDocument || !canvasRef.current || isRendering) return;

    try {
      setIsRendering(true);

      // Get the current page
      const pageNum = currentPageRef.current;
      const currentScale = scaleRef.current;

      const page = await pdfDocument.getPage(pageNum);
      const canvas = canvasRef.current;
      const context = canvas.getContext('2d');

      // Clear previous content
      context.clearRect(0, 0, canvas.width, canvas.height);

      // Calculate viewport - get container width more reliably
      const container = containerRef.current;
      const containerWidth = container ? container.clientWidth : window.innerWidth;
      
      // Default viewport at scale 1.0
      const defaultViewport = page.getViewport({ scale: 1.0 });
      
      // Calculate scale factor to fit width, with a maximum scale of 1.0
      // For mobile, we want to ensure it fits within the screen width
      const scaleFactor = Math.min(containerWidth / defaultViewport.width, 1.0);
      
      // Apply current zoom level to the calculated scale
      const scaledViewport = page.getViewport({ scale: scaleFactor * currentScale });

      // Set canvas dimensions to match the viewport
      canvas.height = scaledViewport.height;
      canvas.width = scaledViewport.width;
      
      // Ensure canvas style width is set to 100% for mobile
      canvas.style.width = '100%';
      canvas.style.height = 'auto';

      const renderContext = {
        canvasContext: context,
        viewport: scaledViewport,
        enableWebGL: true,
        renderInteractiveForms: true,
      };

      await page.render(renderContext).promise;
    } catch (err) {
      console.error("Error rendering page:", err);
    } finally {
      if (isMountedRef.current) {
        setIsRendering(false);
      }
    }
  };

  // Effect to trigger page rendering when dependencies change
  useEffect(() => {
    if (pdfDocument && canvasRef.current) {
      renderPage();
    }
  }, [pdfDocument, currentPage, scale]);

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
      const newScale = Math.min(scale + 0.2, 3.0);
      setScale(parseFloat(newScale.toFixed(1)));
      scaleRef.current = parseFloat(newScale.toFixed(1));
    }
  };

  const handleZoomOut = () => {
    if (!isRendering && scale > 0.5) {
      const newScale = Math.max(scale - 0.2, 0.5);
      setScale(parseFloat(newScale.toFixed(1)));
      scaleRef.current = parseFloat(newScale.toFixed(1));
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
    <>
      {!isPdfAccessible && (
        <div className="access-denied-container">
          <div>
            <h2>Access Denied</h2>
            <p>You need to purchase this course to access this content.</p>
            <Link to='/premium-plans'><button>Access Premium Plans</button></Link>
          </div>
        </div>
      )}
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
        <div className="pdf-wrapper" ref={containerRef}>
          <div className="canvas-container">
            <canvas ref={canvasRef} className="pdf-canvas" />
            {isRendering && (
              <div className="rendering-indicator">Rendering...</div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default PptViewer;