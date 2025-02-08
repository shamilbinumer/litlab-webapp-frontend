import { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './PaperDetailPage.scss';
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

  const handleOptionSelect = (selectedOptionText) => {
    setSelectedOption(selectedOptionText);
    // Save the answer
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      selected: selectedOptionText,
      correct: selectedOptionText === currentQuestion.correctAnswer,
      ignored: false
    };
    setAnswers(newAnswers);
  };

  const handleIgnore = () => {
    // Mark current question as ignored
    const newAnswers = [...answers];
    newAnswers[currentQuestionIndex] = {
      selected: null,
      correct: false,
      ignored: true
    };
    setAnswers(newAnswers);
    setIgnoredQuestions([...ignoredQuestions, currentQuestionIndex]);
    
    // Move to next question
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
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

    // Navigate to analysis page with query parameters including ignored count
    navigate(`/quiz-analysis?total=${totalQuestions}&correct=${correctCount}&wrong=${wrongCount}&ignored=${ignoredCount}`);
  };

  const handleNextQuestion = () => {
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(currentQuestionIndex + 1);
      setSelectedOption(null);
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
          <span>00:00:00</span>
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