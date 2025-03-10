import { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import baseUrl from '../../../baseUrl';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { LuArrowLeft, LuLock } from 'react-icons/lu';
import axios from 'axios';
import Box from '@mui/material/Box';
import LinearProgress from '@mui/material/LinearProgress';
import PurchasePopup from '../../common/Alerts/PurchasePopup/PurchasePopup';
import { FaArrowLeft } from 'react-icons/fa';

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
  const [totalTimeLeft, setTotalTimeLeft] = useState(0);
  const [totalTime, setTotalTime] = useState(0);
  const [questionTimes, setQuestionTimes] = useState([]);
  const [videoLoading, setVideoLoading] = useState(false);
  const [purchasePopupIsOpen, setPurchasePopupIsOpen] = useState(false);

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

        // Access the questions array from the first object in the data array
        const questions = data.data[0]?.questions || [];
        setQuestions(questions);
        setTotalTimeLeft(questions.length * 60);
      } catch (err) {
        setError(err.message);
      }
    };
    fetchVideoAssessment();
  }, [selectedVideo, paperId]);

  useEffect(() => {
    if (!selectedVideo || !questions || questions.length === 0) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          handleTimesUp();
          return 60;
        }
        return prevTime - 1;
      });

      setTotalTimeLeft(prevTotal => {
        if (prevTotal <= 1) {
          handleFinish();
          return 0;
        }
        return prevTotal - 1;
      });

      setTotalTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [selectedVideo, questions, currentQuestionIndex]);

  const handleModuleSelect = async (module, index) => {
    if (!isModuleAccessible(index)) {
      setPurchasePopupIsOpen(true);
      return;
    }

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
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setIgnoredQuestions([]);
    setTimeLeft(60);
    setTotalTime(0);
    setTotalTimeLeft(0);
    setQuestionTimes([]);
    setVideoLoading(true);

    try {
      const authToken = localStorage.getItem('authToken');
      if (!authToken) {
        throw new Error('No authentication token found');
      }

      const response = await fetch(`${baseUrl}/api/fetch-vedio-classes/${paperId}/${module.module}`, {
        headers: {
          'Authorization': `Bearer ${authToken}`,
          'Content-Type': 'application/json'
        }
      });

      if (!response.ok) {
        throw new Error('Failed to fetch videos');
      }

      const data = await response.json();
      setVideos(data || []);
    } catch (err) {
      setError(err.message);
    } finally {
      setVideoLoading(false);
    }
  };

  const handleVideoSelect = (video) => {
    if (!video || !video.title) {
      console.error("Invalid video object:", video);
      return;
    }
    setSelectedVideo(video);
  };

  const handleModuleBack = () => {
    setSelectedModule(null);
    setSelectedVideo(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setIgnoredQuestions([]);
    setTimeLeft(60);
    setTotalTime(0);
    setTotalTimeLeft(0);
    setQuestionTimes([]);
  };

  const handleVideoBack = () => {
    setSelectedVideo(null);
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleTimesUp = () => {
    if (!currentQuestion) return;

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
    if (!currentQuestion) return;

    setSelectedOption(selectedOptionText);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      selected: selectedOptionText,
      correct: selectedOptionText === currentQuestion.correctAnswer,
      ignored: false,
      timeTaken: 60 - timeLeft,
      moduleNumber: selectedModule.id
    };
    setAnswers(newAnswers);
  };

  const handleIgnore = () => {
    if (!currentQuestion) return;

    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      questionId: currentQuestion.id,
      selected: null,
      correct: false,
      ignored: true,
      timeTaken: 60 - timeLeft,
      moduleNumber: selectedModule.id
    };
    setAnswers(newAnswers);
    setIgnoredQuestions([...ignoredQuestions, currentQuestionIndex]);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimeLeft(60);
    } else {
      handleFinish();
    }
  };

  const handleNextQuestion = () => {
    if (!currentQuestion) return;

    const newQuestionTimes = [...questionTimes];
    newQuestionTimes[currentQuestionIndex] = 60 - timeLeft;
    setQuestionTimes(newQuestionTimes);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimeLeft(60);
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
    const examType = 'assessment';
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
          paperType: selectedModule?.paperType || ""
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

    navigate(`/quiz-analysis?paperId=${paperId}&moduleId=${selectedModule.id}&tutorialTitle=${selectedVideo?.title}&module=${selectedModule.module}&total=${totalQuestions}&correct=${correctCount}&wrong=${wrongCount}&ignored=${ignoredCount}&totalTime=${totalTime}&avgTime=${avgTimePerQuestion}&examType=${examType}`);
  };

  const getOptionStyle = (optionText) => {
    if (!currentQuestion || selectedOption === null) return {};

    const isCorrect = optionText === currentQuestion.correctAnswer;

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
    // Handle case when no modules are available
    if (modules.length === 0) {
      return (
        <div className="modules-container" style={{textAlign: "center", padding: "2rem"}}>
          <div className="empty-state" style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            minHeight: "200px",
            backgroundColor: "#f9f9f9",
            borderRadius: "8px",
            padding: "2rem"
          }}>
            {/* <img 
              src="/Images/empty-folder.png" 
              alt="No modules available" 
              style={{
                width: "80px",
                marginBottom: "1rem"
              }}
            /> */}
            <h3 style={{
              fontFamily: "Montserrat",
              fontSize: "20px",
              color: "#333",
              marginBottom: "0.5rem"
            }}>No Modules Available</h3>
            <p style={{
              fontFamily: "Montserrat",
              fontSize: "14px",
              color: "#666",
              maxWidth: "400px",
              margin: "0 auto"
            }}>
              There are currently no modules available for assessment tests. 
              Please check back later or contact your administrator for assistance.
            </p>
            <Link to="/" style={{
              marginTop: "1.5rem",
              padding: "10px 20px",
              backgroundColor: "#4a90e2",
              color: "white",
              borderRadius: "4px",
              textDecoration: "none",
              fontFamily: "Montserrat",
              fontSize: "14px",
              fontWeight: "500"
            }}>
              Return to Dashboard
            </Link>
          </div>
        </div>
      );
    }

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
                  <div className="completion-badge" style={{ position: 'absolute', right: '1rem', top: '10px', backgroundColor: 'green', color: "white", padding: "5px 10px", borderRadius: '8px', fontFamily: 'Montserrat', fontSize: '13px' }}>
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
    // Handle case when no videos are available
    if (!videoLoading && videos.length === 0) {
      return (
        <div className="quiz-container">
          <div className="quiz-header" style={{ display: 'flex', gap: '1rem' }}>
            <FaArrowLeft onClick={handleModuleBack} style={{ cursor: "pointer", fontSize: "25px" }} />
            <h2 style={{ fontFamily: 'Montserrat', fontSize: "25px", fontWeight: '600' }}>{selectedModule.title}</h2>
          </div>
          <div className="videos-container">
            <div className="videos-header">
              <h3 style={{ fontFamily: 'Montserrat', fontSize: "25px" }}>Module Videos</h3>
            </div>
            <div className="empty-state" style={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              minHeight: "200px",
              backgroundColor: "#f9f9f9",
              borderRadius: "8px",
              padding: "2rem",
              margin: "1rem 0"
            }}>
              <img 
                src="/Images/empty-video.png" 
                alt="No videos available" 
                style={{
                  width: "80px",
                  marginBottom: "1rem"
                }}
              />
              <h3 style={{
                fontFamily: "Montserrat",
                fontSize: "20px",
                color: "#333",
                marginBottom: "0.5rem"
              }}>No Videos Available</h3>
              <p style={{
                fontFamily: "Montserrat",
                fontSize: "14px",
                color: "#666",
                maxWidth: "400px",
                margin: "0 auto"
              }}>
                There are currently no videos available for this module.
                Please check back later or select a different module.
              </p>
              <button onClick={handleModuleBack} style={{
                marginTop: "1.5rem",
                padding: "10px 20px",
                backgroundColor: "#4a90e2",
                color: "white",
                border: "none",
                borderRadius: "4px",
                textDecoration: "none",
                fontFamily: "Montserrat",
                fontSize: "14px",
                fontWeight: "500",
                cursor: "pointer"
              }}>
                Return to Modules
              </button>
            </div>
          </div>
        </div>
      );
    }

    return (
      <div className="quiz-container">
        <div className="quiz-header" style={{ display: 'flex', gap: '1rem' }}>
          <FaArrowLeft onClick={handleModuleBack} style={{ cursor: "pointer", fontSize: "25px" }} />
          <h2 style={{ fontFamily: 'Montserrat', fontSize: "25px", fontWeight: '600' }}>{selectedModule.title}</h2>
        </div>
        <div className="videos-container">
          <div className="videos-header">
            <h3 style={{ fontFamily: 'Montserrat', fontSize: "25px" }}>Module Videos</h3>
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
                <div key={video.id || index} className="video-card" style={{ display: 'flex', marginBottom: '1rem', gap: '1rem', alignItems: "center" }} onClick={() => handleVideoSelect(video)}>
                  <div className="video-thumbnail" style={{ width: "30%", height: '100px', overflow: "hidden", borderRadius: '9px' }}>
                    <img src={video.thumbnail || "/Images/video-placeholder.png"} alt={video.title} style={{ width: "100%", height: "100%", objectFit: 'cover' }} />
                  </div>
                  <div className="video-info" style={{ width: '70%' }}>
                    <h4 style={{ fontFamily: 'Montserrat', fontSize: '20px', fontWeight: '700' }}>{video.title}</h4>
                    <button style={{ backgroundColor: '#FBD63C', border: 'none', fontFamily: "Montserrat", fontWeight: '600', fontSize: '14px', padding: '5px 20px', borderRadius: '8px' }}>Start Assessment</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return (
      <div className="quiz-container">
        <div className="quiz-header">
          <LuArrowLeft
            onClick={handleVideoBack}
            style={{ fontSize: '30px', cursor: 'pointer', marginTop: '-1rem' }}
          />
          <div className="paper-info">
            <h2 className='moduleTitle' style={{ fontSize: '25px', fontFamily: 'Montserrat', fontWeight: '600' }}>
              {selectedVideo.title}
            </h2>
          </div>
        </div>
        <div className="empty-state" style={{
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          justifyContent: "center",
          minHeight: "200px",
          backgroundColor: "#f9f9f9",
          borderRadius: "8px",
          padding: "2rem",
          margin: "1rem 0"
        }}>
          {/* <img 
            src="/Images/empty-questions.png" 
            alt="No questions available" 
            style={{
              width: "80px",
              marginBottom: "1rem"
            }}
          /> */}
          <h3 style={{
            fontFamily: "Montserrat",
            fontSize: "20px",
            color: "#333",
            marginBottom: "0.5rem"
          }}>No Questions Available</h3>
          <p style={{
            fontFamily: "Montserrat",
            fontSize: "14px",
            color: "#666",
            maxWidth: "400px",
            margin: "0 auto"
          }}>
            There are currently no assessment questions available for this video.
            Please select a different video or check back later.
          </p>
          <button onClick={handleVideoBack} style={{
            marginTop: "1.5rem",
            padding: "10px 20px",
            backgroundColor: "#4a90e2",
            color: "white",
            border: "none",
            borderRadius: "4px",
            textDecoration: "none",
            fontFamily: "Montserrat",
            fontSize: "14px",
            fontWeight: "500",
            cursor: "pointer"
          }}>
            Return to Videos
          </button>
        </div>
      </div>
    );
  }

  const currentQuestion = questions[currentQuestionIndex];

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
        <LuArrowLeft
          onClick={handleVideoBack}
          style={{ fontSize: '30px', cursor: 'pointer', marginTop: '-1rem' }}
        />
        <div className="paper-info">
          <h2 className='moduleTitle' style={{ fontSize: '25px', fontFamily: 'Montserrat', fontWeight: '600' }}>
            {selectedVideo.title}
          </h2>
        </div>
      </div>
      <div className="quiz-content">
        <div className="quiz-header">
          <div className="timer-container">
            <div className="total-timer">
              Total Time: {formatTime(totalTime)}
            </div>
          </div>
          <span>{currentQuestionIndex + 1}/{questions.length}</span>
        </div>
        <div className="question">
          <h3>
            <span>Qs {currentQuestionIndex + 1} : </span>
            <p>{currentQuestion.question}</p>
          </h3>
          <div className="options">
            {currentQuestion.options.map((option, index) => (
              <div
                key={index}
                onClick={() => handleOptionSelect(option)}
                className="option"
                style={{
                  cursor: selectedOption ? 'default' : 'pointer',
                  transition: 'all 0.3s ease',
                  ...getOptionStyle(option)
                }}
              >
                <span className="option-letter">{String.fromCharCode(65 + index)}</span>
                <span>{option}</span>
              </div>
            ))}
          </div>
        </div>
        <div className="buttons">
          <button
            className="ignore"
            onClick={handleIgnore}
            style={{
              cursor: 'pointer',
              opacity: selectedOption ? 0.5 : 1,
              pointerEvents: selectedOption ? 'none' : 'auto'
            }}
          >
            Ignore
          </button>
          <button
            className="next"
            onClick={handleNextQuestion}
            style={{
              opacity: selectedOption ? 1 : 0.5,
              cursor: selectedOption ? 'pointer' : 'not-allowed'
            }}
          >
            {currentQuestionIndex < questions.length - 1 ? 'Next' : 'Finish'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AssessmentTest;