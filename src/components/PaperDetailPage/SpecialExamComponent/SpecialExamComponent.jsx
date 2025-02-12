import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import baseUrl from '../../../baseUrl';
import { MdOutlineRemoveRedEye } from 'react-icons/md';

const SpecialExam = ({ paperId }) => {
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
  const [totalTime, setTotalTime] = useState(0);
  const [questionTimes, setQuestionTimes] = useState([]);

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

    const fetchSpecialExam = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${baseUrl}/api/fetch-special-exam/${selectedModule.id}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch special exam');
        }

        const data = await response.json();
        setQuestions(data || []);
      } catch (err) {
        setError(err.message);
      }
    };

    fetchSpecialExam();
  }, [selectedModule]);

  // Timer effect - only start when module and questions are loaded
  useEffect(() => {
    if (!selectedModule || !questions.length) return;

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
  }, [selectedModule, questions, currentQuestionIndex]);

  const handleModuleSelect = (module) => {
    setSelectedModule(module);
    // Reset all states when selecting a new module
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setIgnoredQuestions([]);
    setTimeLeft(60);
    setTotalTime(0);
    setQuestionTimes([]);
  };

  const handleModuleBack = () => {
    setSelectedModule(null);
    setQuestions([]);
    // Reset all states when going back to module selection
    setCurrentQuestionIndex(0);
    setSelectedOption(null);
    setAnswers([]);
    setIgnoredQuestions([]);
    setTimeLeft(60);
    setTotalTime(0);
    setQuestionTimes([]);
  };

  // Keep your existing helper functions
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

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  const handleOptionSelect = (selectedOptionText) => {
    setSelectedOption(selectedOptionText);
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      selected: selectedOptionText,
      correct: selectedOptionText === currentQuestion.correctAnswer,
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
      answeredQuestions.length
    );

    navigate(`/quiz-analysis?paperId=${paperId}&total=${totalQuestions}&correct=${correctCount}&wrong=${wrongCount}&ignored=${ignoredCount}&totalTime=${totalTime}&avgTime=${avgTimePerQuestion}`);
  };

  const handleNextQuestion = () => {
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

  const getOptionLetter = (index) => {
    return String.fromCharCode(65 + index);
  };

  const getOptionStyle = (optionText) => {
    if (selectedOption === null) return {};
    
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

  // Display modules if no module is selected
  if (!selectedModule) {
    return (
        <div className="modules-container">
          <div className="modules-grid">
            {modules.map((module) => (
              <div
                key={module.id}
                className="module-card"
                onClick={() => handleModuleSelect(module)}
              >
                <div>
                  <h3>{module.title}</h3>
                  {module.description && <p>{module.description}</p>}
                  <div className="button-heart">
                    <button>
                      Start Assessment <MdOutlineRemoveRedEye style={{ fontSize: '14px' }} />
                    </button>
                  </div>
               
                </div>
                <div>
  
                </div>
                <div className="module-card-right">
                    <img src="/Images/Module-icon.png" alt="" />
                  </div> </div>
            ))}
          </div>
        </div>
      );
  }

  // Display quiz if module is selected and questions are loaded
  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return <div className="quiz-container">
      <div className="quiz-content">No questions available for this module</div>
    </div>;
  }

  return (
    <div className="quiz-container">
      <div className="quiz-header">
        <button onClick={handleModuleBack} className="back-button">
          ← Back to Modules
        </button>
        <h2>{selectedModule.title}</h2>
      </div>
      <div className="quiz-content">
        <div className="quiz-header">
          <span>{currentQuestionIndex + 1}/{questions.length}</span>
          <span>{formatTime(timeLeft)}</span>
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
                <span className="option-letter">{getOptionLetter(index)}</span>
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