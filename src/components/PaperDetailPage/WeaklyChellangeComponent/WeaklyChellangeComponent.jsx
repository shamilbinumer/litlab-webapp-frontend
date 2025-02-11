import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
// import './PaperDetailPage.scss';
import baseUrl from '../../../baseUrl';

const WeeklyChallenge = ({paperId}) => {
  const navigate = useNavigate();
  const [questions, setQuestions] = useState([]);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [ignoredQuestions, setIgnoredQuestions] = useState([]);
  const [timeLeft, setTimeLeft] = useState(60); // 60 seconds per question
  const [totalTime, setTotalTime] = useState(0);
  const [questionTimes, setQuestionTimes] = useState([]); // Track time per question

  useEffect(() => {
    const fetchWeeklyChallenge = async () => {
      try {
        const authToken = localStorage.getItem('authToken');
        if (!authToken) {
          throw new Error('No authentication token found');
        }

        const response = await fetch(`${baseUrl}/api/fetch-weakly-chellange/${paperId}`, {
          headers: {
            'Authorization': `Bearer ${authToken}`,
            'Content-Type': 'application/json'
          }
        });

        if (!response.ok) {
          throw new Error('Failed to fetch weekly challenge');
        }

        const data = await response.json();
        setQuestions(data || []);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchWeeklyChallenge();
  }, [paperId]);

  // Timer effect
  useEffect(() => {
    if (loading || !questions.length) return;

    const timer = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          // Time's up for this question
          handleTimesUp();
          return 60; // Reset for next question
        }
        return prevTime - 1;
      });
      
      setTotalTime(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, [loading, currentQuestionIndex, questions]);

  const handleTimesUp = () => {
    // Save the time taken for this question
    const newQuestionTimes = [...questionTimes];
    newQuestionTimes[currentQuestionIndex] = 60 - timeLeft;
    setQuestionTimes(newQuestionTimes);

    // If no option selected, mark as ignored
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
    // Save the answer
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
    // Mark current question as ignored
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      selected: null,
      correct: false,
      ignored: true,
      timeTaken: 60 - timeLeft
    };
    setAnswers(newAnswers);
    setIgnoredQuestions([...ignoredQuestions, currentQuestionIndex]);
    
    // Move to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimeLeft(60); // Reset timer
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

    // Calculate average time per question (excluding ignored)
    const avgTimePerQuestion = Math.round(
      answeredQuestions.reduce((acc, curr) => acc + (curr?.timeTaken || 0), 0) / 
      answeredQuestions.length
    );

    // Navigate with all parameters
    navigate(`/quiz-analysis?paperId=${paperId}&total=${totalQuestions}&correct=${correctCount}&wrong=${wrongCount}&ignored=${ignoredCount}&totalTime=${totalTime}&avgTime=${avgTimePerQuestion}`);
  };

  const handleNextQuestion = () => {
    // Save time taken for current question
    const newQuestionTimes = [...questionTimes];
    newQuestionTimes[currentQuestionIndex] = 60 - timeLeft;
    setQuestionTimes(newQuestionTimes);

    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
      setTimeLeft(60); // Reset timer
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
      <div className="quiz-content">Loading weekly challenge...</div>
    </div>;
  }

  if (error) {
    return <div className="quiz-container">
      <div className="quiz-content">Error: {error}</div>
    </div>;
  }

  const currentQuestion = questions[currentQuestionIndex];
  if (!currentQuestion) {
    return <div className="quiz-container">
      <div className="quiz-content">No questions available</div>
    </div>;
  }

  return (
    <div className="quiz-container">
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

export default WeeklyChallenge;