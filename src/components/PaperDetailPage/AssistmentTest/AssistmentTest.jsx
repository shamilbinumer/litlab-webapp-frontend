import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import baseUrl from '../../../baseUrl';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import { MdOutlineRemoveRedEye, MdPlayCircle } from 'react-icons/md';
import { FaArrowLeft } from 'react-icons/fa';
import { LuLock } from 'react-icons/lu';
import './AssesmentTest.scss';
import Question from '../Question';
import PurchasePopup from '../../common/Alerts/PurchasePopup/PurchasePopup';

const AssessmentTest = ({ paperId, userDetails, isAccessible, onPurchaseClick }) => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [selectedVideo, setSelectedVideo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [videos, setVideos] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [ignoredQuestions, setIgnoredQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60);
  const [totalTime, setTotalTime] = useState(0);
  const [questionTimes, setQuestionTimes] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [purchasePopupIsOpen, setPurchasePopupIsOpen] = useState(false);

  // Helper function to check if a module is accessible
  const isModuleAccessible = (index) => {
    return isAccessible || index < 2;
  };

  useEffect(() => {
    const fetchModules = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${baseUrl}/api/fetch-modules/${paperId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch modules');
        }

        const data = await response.json();
        setModules(data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchModules();
  }, [paperId]);

  useEffect(() => {
    if (!selectedVideo) return;

    const fetchVideoAssessment = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${baseUrl}/api/fetch-video-assessment/${paperId}/${selectedVideo.title}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch video assessment');
        }

        const data = await response.json();
        setQuestions(data.data || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchVideoAssessment();
  }, [selectedVideo, paperId]);

  useEffect(() => {
    if (!selectedVideo || !questions.length) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          handleTimesUp();
          return 60;
        }
        return prevTime - 1;
      });

      setTotalTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedVideo, questions, currentQuestionIndex]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleModuleSelect = async (module, index) => {
    if (!isModuleAccessible(index)) {
      setPurchasePopupIsOpen(true);
      return;
    }

    // Check if module is already completed
    const isModuleSubmitted = userDetails?.mockTestResult?.some(
      result => 
        result.module === module.module && 
        result.category === "Assessment Test" &&
        result.isSubmitted === true
    );

    if (isModuleSubmitted) {
      alert("You have already submitted this module's assessment!");
      return;
    }

    setSelectedModule(module);
    setSelectedVideo(null);
    resetQuizState();
    setVideoLoading(true);

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('No authentication token found');
      }

      const videoResponse = await fetch(`${baseUrl}/api/fetch-vedio-classes/${paperId}/${module.module}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!videoResponse.ok) {
        throw new Error('Failed to fetch videos');
      }
      const videoData = await videoResponse.json();
      setVideos(videoData || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setVideoLoading(false);
    }
  };

  const handleVideoSelect = async (video) => {
    setSelectedVideo(video);
    resetQuizState();
  };

  const handleModuleBack = () => {
    setSelectedModule(null);
    setSelectedVideo(null);
    resetQuizState();
  };

  const handleVideoBack = () => {
    setSelectedVideo(null);
    resetQuizState();
  };

  const resetQuizState = () => {
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setIgnoredQuestions([]);
    setTimeLeft(60);
    setTotalTime(0);
    setQuestionTimes([]);
  };

  const handleTimesUp = () => {
    const newQuestionTimes = [...questionTimes];
    newQuestionTimes[currentQuestionIndex] = 60 - timeLeft;
    setQuestionTimes(newQuestionTimes);

    if (!selectedOption) {
      handleIgnore();
    } else {
      handleNextQuestion();
    }
  };

  const handleOptionSelect = (selectedOptionText) => {
    setSelectedOption(selectedOptionText);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      selected: selectedOptionText,
      correct: selectedOptionText === currentQuestion?.correctAnswer,
      ignored: false,
      timeTaken: 60 - timeLeft
    };
    setAnswers(newAnswers);
  };

  const handleIgnore = () => {
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      selected: null,
      correct: false,
      ignored: true,
      timeTaken: 60 - timeLeft
    };
    setAnswers(newAnswers);
    setIgnoredQuestions([...ignoredQuestions, currentQuestionIndex]);

    if (currentQuestionIndex < questions.length - 1) {
      moveToNextQuestion();
    } else {
      handleFinish();
    }
  };

  const moveToNextQuestion = () => {
    setCurrentQuestionIndex(prev => prev + 1);
    setSelectedOption(null);
    setTimeLeft(60);
  };

  const handleNextQuestion = () => {
    const newQuestionTimes = [...questionTimes];
    newQuestionTimes[currentQuestionIndex] = 60 - timeLeft;
    setQuestionTimes(newQuestionTimes);

    if (currentQuestionIndex < questions.length - 1) {
      moveToNextQuestion();
    } else {
      handleFinish();
    }
  };

  const handleFinish = () => {
    const totalQuestions = questions.length;
    const ignoredCount = ignoredQuestions.length;
    const answeredQuestions = answers.filter(answer => !answer?.ignored);
    const correctCount = answeredQuestions.filter(answer => answer?.correct).length;
    const wrongCount = answeredQuestions.filter(answer => answer?.correct === false).length;
    const avgTimePerQuestion = Math.round(
      answeredQuestions.reduce((acc, curr) => acc + (curr?.timeTaken || 0), 0) /
      (answeredQuestions.length || 1)
    );

    // Add mock test result
    const addMockTest = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          throw new Error("No authentication token found");
        }
    
        const mockTestData = {
          category: "Assessment Test",
          isSubmitted: true,
          marks: correctCount,
          module: selectedModule?.module || 0,
          moduleTitle: selectedModule?.title || "",
          paperTitle: selectedVideo?.title || "",
        };
    
        const response = await axios.post(
          `${baseUrl}/api/add-mock-test`,
          mockTestData,
          {
            headers: {
              Authorization: `Bearer ${authToken}`,
              "Content-Type": "application/json",
            },
          }
        );
    
        console.log("Mock test added successfully:", response.data);
        alert("Mock test submitted successfully!");
      } catch (error) {
        console.error("Error adding mock test:", error.response?.data?.message || error.message);
        alert("Failed to submit mock test. Try again.");
      }
    };
    addMockTest();

    navigate(`/quiz-analysis?paperId=${paperId}&total=${totalQuestions}&correct=${correctCount}&wrong=${wrongCount}&ignored=${ignoredCount}&totalTime=${totalTime}&avgTime=${avgTimePerQuestion}`);
  };

  const getOptionStyle = (optionText) => {
    if (selectedOption === null) return {};

    const isCorrect = optionText === currentQuestion?.correctAnswer;

    if (selectedOption === optionText) {
      return {
        backgroundColor: isCorrect ? '#e6ffe6' : '#ffe6e6',
        borderColor: isCorrect ? '#00cc00' : '#ff0000',
        color: isCorrect ? '#006600' : '#cc0000'
      };
    }

    if (isCorrect) {
      return {
        backgroundColor: '#e6ffe6',
        borderColor: '#00cc00',
        color: '#006600'
      };
    }

    return {};
  };

  if (loading) {
    return (
      <div style={{ textAlign: "center" }}>
        <Box sx={{ width: '100%' }}>
          <LinearProgress />
        </Box>
      </div>
    );
  }

  if (error) {
    return (
      <div className="quiz-container">
        <div className="quiz-content">Error: {error}</div>
      </div>
    );
  }

  if (!selectedModule) {
    return (
      <div className="modules-container">
        <div className="modules-grid">
          {modules.map((module, index) => {
            const isCompleted = userDetails?.mockTestResult?.some(
              result => 
                result.module === module.module && 
                result.category === "Assessment Test" &&
                result.isSubmitted === true
            );

            const completedScore = userDetails?.mockTestResult?.find(
              result => 
                result.module === module.module && 
                result.category === "Assessment Test" &&
                result.isSubmitted === true
            )?.marks || 0;

            const moduleAccessible = isModuleAccessible(index);

            return (
              <div
                key={module.id}
                className={`module-card ${isCompleted ? 'completed' : ''} ${!moduleAccessible ? 'locked' : ''}`}
                style={{
                  opacity: isCompleted || !moduleAccessible ? 0.8 : 1,
                  position: 'relative'
                }}
              >
                {isCompleted && (
                  <div className="completion-badge">
                    Completed (Score: {completedScore})
                  </div>
                )}
                <div>
                  <h3>Module {module.module} : {module.title}</h3>
                  {module.description && <p>{module.description}</p>}
                  <div className="button-heart">
                    {moduleAccessible ? (
                      <button 
                        onClick={() => handleModuleSelect(module, index)}
                        style={{
                          backgroundColor: isCompleted ? '#e0e0e0' : '',
                          cursor: isCompleted ? 'not-allowed' : 'pointer'
                        }}
                        disabled={isCompleted}
                      >
                        {isCompleted ? 'Already Completed' : 'View Videos'} 
                        <MdOutlineRemoveRedEye style={{ fontSize: '14px', marginLeft: '5px' }} />
                      </button>
                    ) : (
                      <button 
                        className="locked-button"
                        onClick={() => setPurchasePopupIsOpen(true)}
                      >
                        <LuLock className="lock-icon" />
                        Purchase to Unlock
                      </button>
                    )}
                  </div>
                </div>
                <div className="module-card-right">
                  <img src="/Images/Module-icon.png" alt="" />
                </div>
              </div>
            );
          })}
        </div>
        {purchasePopupIsOpen && (
          <PurchasePopup onClose={() => setPurchasePopupIsOpen(false)} />
        )}
      </div>
    );
  }

  if (!selectedVideo) {
    return (
      <div className="quiz-container">
        <div className="quiz-header" style={{display:'flex',gap:'1rem'}}>
          <FaArrowLeft onClick={handleModuleBack} style={{cursor:"pointer",fontSize:"25px"}}/>
          <h2 style={{fontFamily:'Montserrat',fontSize:"25px",fontWeight:'600'}}>{selectedModule.title}</h2>
        </div>
            
        <div className="videos-container">
          <div className="videos-header">
            <h3 style={{fontFamily:'Montserrat',fontSize:"25px"}}>Module Videos</h3>
          </div>
                
          {videoLoading ? (
            <div>
              <Box sx={{ width: '100%' }}>
                <LinearProgress />
              </Box>
            </div>
          ) : (
            <div className="videos-grid">
              {videos?.map((video, index) => (
                <div 
                  key={video.id || index} 
                  className="video-card"
                  onClick={() => handleVideoSelect(video)}
                >
                  <div className="video-thumbnail">
                  <img 
                      src={video.thumbnail || "/Images/video-placeholder.png"} 
                      alt={video.title}
                    />
                  </div>
                  <div className="video-info">
                    <h4>{video.title}</h4>
                    <button>Start Assessment</button>
                  </div>
                </div>
              ))}
              {!videoLoading && videos.length === 0 && (
                <div className="no-videos">
                  No videos available for this module
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];
  
  if (!questions || questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-content">No questions available for this video</div>
      </div>
    );
  }

  if (!currentQuestion) {
    return (
      <div className="quiz-container">
        <div className="quiz-content">Question not found</div>
      </div>
    );
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button onClick={handleVideoBack} className="back-button">
          ← Back to Videos
        </button>
        <h2>{selectedVideo.title} - Assessment</h2>
      </div>
      
      <Question 
        currentQuestion={currentQuestion}
        currentQuestionIndex={currentQuestionIndex}
        totalQuestions={questions.length}
        timeLeft={timeLeft}
        selectedOption={selectedOption}
        onOptionSelect={handleOptionSelect}
        onIgnore={handleIgnore}
        onNext={handleNextQuestion}
      />
    </div>
  );
};

export default AssessmentTest;