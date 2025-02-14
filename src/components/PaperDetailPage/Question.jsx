import React from 'react';
import './PaperDetailPage.scss';

const Question = ({
  currentQuestion,
  currentQuestionIndex,
  totalQuestions,
  timeLeft,
  totalTimeLeft,
  selectedOption,
  onOptionSelect,
  onIgnore,
  onNext,
  showTotalTimer = false
}) => {
  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
  };

  // Get the current question object from the questions array
  const questionData = currentQuestion?.questions?.[currentQuestionIndex] || {};

  const getOptionStyle = (optionText) => {
    if (selectedOption === null) return {};

    const isCorrect = optionText === questionData?.correctAnswer;

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

  const getOptionLetter = (index) => String.fromCharCode(65 + index);

  return (
    <div className="quiz-content">
      <div className="quiz-header">
        <div className="timer-container">
          <span>Question {currentQuestionIndex + 1}/{currentQuestion?.questions?.length || totalQuestions}</span>
          <span>Time Left: {formatTime(timeLeft)}</span>
          {showTotalTimer && (
            <div className="total-timer">
              Total Time: {formatTime(totalTimeLeft)}
            </div>
          )}
        </div>
      </div>

      <div className="module-info">
        <h3>
          <span>Module {currentQuestion?.module}: </span>
          <span>{currentQuestion?.tutorialTitle}</span>
        </h3>
        <p className="paper-details">
          {currentQuestion?.paperTitle} | {currentQuestion?.course} - Semester {currentQuestion?.semester}
        </p>
      </div>

      <div className="question">
        <h3>
          <span>Qs {currentQuestionIndex + 1}: </span>
          <p>{questionData.question}</p>
        </h3>
        <div className="options">
          {questionData?.options?.map((option, index) => (
            <div
              key={index}
              onClick={() => !selectedOption && onOptionSelect(option)}
              className="option"
              style={{
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
          onClick={onIgnore}
          style={{
            opacity: selectedOption ? 0.5 : 1,
            cursor: selectedOption ? 'not-allowed' : 'pointer'
          }}
          disabled={selectedOption}
        >
          Ignore
        </button>
        <button
          className="next"
          onClick={onNext}
          style={{
            opacity: selectedOption ? 1 : 0.5,
            cursor: selectedOption ? 'pointer' : 'not-allowed'
          }}
          disabled={!selectedOption}
        >
          {currentQuestionIndex < (currentQuestion?.questions?.length - 1 || totalQuestions - 1) ? 'Next' : 'Finish'}
        </button>
      </div>
    </div>
  );
};

export default Question;