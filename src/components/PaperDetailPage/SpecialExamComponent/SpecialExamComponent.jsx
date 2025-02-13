import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import baseUrl from '../../../baseUrl';
import { MdOutlineRemoveRedEye } from 'react-icons/md';
import { IoArrowBack } from 'react-icons/io5';
import { LuArrowLeft } from 'react-icons/lu';
import axios from 'axios';

const SpecialExam = ({ paperId, userDetails }) => {
  const navigate = useNavigate();
  const [modules, setModules] = useState([]);
  const [selectedModule, setSelectedModule] = useState(null);
  const [questions, setQuestions] = useState([]);
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
  const [paperDetails, setPaperDetails] = useState(null);

  // Fetch modules first
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

  // Fetch questions when a module is selected
  useEffect(() => {
    if (!selectedModule) return;
    console.log('Selected Module ID:', selectedModule.id);

    const fetchSpecialExam = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${baseUrl}/api/fetch-special-exam/${paperId}/${selectedModule.id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch special exam');
        }

        const data = await response.json();
        console.log('API Response:', data);
        
        if (Array.isArray(data) && data.length > 0) {
          setPaperDetails(data[0]);
          const questionsList = data[0]?.questions || [];
          const validQuestions = questionsList.filter(q => !q.delete);
          console.log('Valid Questions:', validQuestions);
          setQuestions(validQuestions);
          setTotalTimeLeft(validQuestions.length * 60);
        } else {
          setPaperDetails(null);
          setQuestions([]);
          setTotalTimeLeft(0);
        }
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSpecialExam();
  }, [selectedModule, paperId]);

  useEffect(() => {
    if (!selectedModule || !questions || questions.length === 0) return;

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
  }, [selectedModule, questions, currentQuestionIndex]);

  const handleModuleSelect = (module) => {
    console.log(module, 'module');
    console.log(userDetails?.mockTestResult, 'mockTestResult');
    
    // Check if this module has already been submitted
    const isModuleSubmitted = userDetails?.mockTestResult?.some(
      result => 
        result.module === module.module && 
        result.category === "Special Exam" &&
        result.isSubmitted === true
    );

    if (isModuleSubmitted) {
      alert("You have already submitted this module's assessment!");
      return;
    }

    setSelectedModule(module);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setIgnoredQuestions([]);
    setTimeLeft(60);
    setTotalTime(0);
    setTotalTimeLeft(0);
    setQuestionTimes([]);
    setPaperDetails(null);
  };

  const handleModuleBack = () => {
    setSelectedModule(null);
    setQuestions([]);
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setIgnoredQuestions([]);
    setTimeLeft(60);
    setTotalTime(0);
    setTotalTimeLeft(0);
    setQuestionTimes([]);
    setPaperDetails(null);
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
  
    // Call API to add mock test before navigating
    const addMockTest = async () => {
      try {
        const authToken = localStorage.getItem("authToken");
        if (!authToken) {
          throw new Error("No authentication token found");
        }
    
        const mockTestData = {
          category: "Special Exam",
          isSubmitted: true,
          marks: correctCount,
          module: selectedModule?.module || 0,
          moduleTitle: selectedModule?.title || "",
          paperTitle: paperDetails?.paperTitle || "",
          paperType: paperDetails?.paperType || "",
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
  
    navigate(`/quiz-analysis?paperId=${paperId}&moduleId=${selectedModule.id}&total=${totalQuestions}&correct=${correctCount}&wrong=${wrongCount}&ignored=${ignoredCount}&totalTime=${totalTime}&avgTime=${avgTimePerQuestion}`);
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
    return <div className="quiz-container">
      <div className="quiz-content">Loading Special Exam Modules...</div>
    </div>;
  }

  if (error) {
    return <div className="quiz-container">
      <div className="quiz-content">Error: {error}</div>
    </div>;
  }

  if (!selectedModule) {
    return (
      <div className="modules-container">
        <div className="modules-grid">
          {modules.map((module) => {
            // Check if this module is already completed
            const isCompleted = userDetails?.mockTestResult?.some(
              result => 
                result.module === module.module && 
                result.category === "Special Exam" &&
                result.isSubmitted === true
            );

            const completedScore = userDetails?.mockTestResult?.find(
              result => 
                result.module === module.module && 
                result.category === "Special Exam" &&
                result.isSubmitted === true
            )?.marks || 0;

            return (
              <div
                key={module.id}
                className={`module-card ${isCompleted ? 'completed' : ''}`}
                style={{
                  opacity: isCompleted ? 0.8 : 1,
                  position: 'relative'
                }}
              >
                {isCompleted && (
                  <div 
                    style={{
                      position: 'absolute',
                      top: '10px',
                      right: '10px',
                      background: '#4CAF50',
                      color: 'white',
                      padding: '4px 8px',
                      borderRadius: '4px',
                      fontSize: '12px'
                    }}
                  >
                    Completed (Score: {completedScore})
                  </div>
                )}
                <div>
                  <h3>Module {module.module} : {module.title}</h3>
                  {module.description && <p>{module.description}</p>}
                  <div className="button-heart">
                    <button 
                      onClick={() => handleModuleSelect(module)}
                      style={{
                        backgroundColor: isCompleted ? '#e0e0e0' : '',
                        cursor: isCompleted ? 'not-allowed' : 'pointer'
                      }}
                      disabled={isCompleted}
                    >
                      {isCompleted ? 'Already Completed' : 'Start Assessment'} 
                      <MdOutlineRemoveRedEye style={{ fontSize: '14px', marginLeft: '5px' }} />
                    </button>
                  </div>
                </div>
                <div className="module-card-right">
                  <img src="/Images/Module-icon.png" alt="" />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    );
  }

  if (!questions || questions.length === 0) {
    return <div className="quiz-container">
      <div className="quiz-content">No questions available for this module</div>
    </div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return <div className="quiz-container">
      <div className="quiz-content">Question not found</div>
    </div>;
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <LuArrowLeft onClick={handleModuleBack} style={{fontSize:'30px',cursor:'pointer',marginTop:'-1rem'}} />
        <div className="paper-info">
          <h2 className='moduleTitle' style={{fontSize:'25px',fontFamily:'Montserrat',fontWeight:'600'}}>{selectedModule.module} : {selectedModule.title}</h2>
          {paperDetails && (
            <p>{paperDetails.course} - Semester {paperDetails.semester}</p>
          )}
        </div>
      </div>
      <div className="quiz-content">
        <div className="quiz-header">
          <div className="timer-container">
            <div className="total-timer">
              Total Time: {formatTime(totalTimeLeft)}
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

export default SpecialExam;