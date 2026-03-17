import React, { useState } from 'react';

const QuestionCard = ({ question, options, onAnswer, showResult }) => {
  const [selectedAnswer, setSelectedAnswer] = useState(null);

  const handleAnswerSelect = (option) => {
    setSelectedAnswer(option);
    if (onAnswer) {
      onAnswer(option);
    }
  };

  return (
    <div className="question-card">
      <div className="question-header">
        <h3>Question</h3>
      </div>
      <div className="question-body">
        <p className="question-text">{question}</p>
        <div className="options">
          {options.map((option, index) => (
            <button
              key={index}
              className={`option-btn ${
                showResult && option.isCorrect ? 'correct' : 
                showResult && selectedAnswer === option.text && !option.isCorrect ? 'incorrect' : 
                selectedAnswer === option.text ? 'selected' : ''
              }`}
              onClick={() => handleAnswerSelect(option.text)}
              disabled={showResult}
            >
              {option.text}
            </button>
          ))}
        </div>
      </div>
      {showResult && (
        <div className="result">
          <p className={selectedAnswer === options.find(opt => opt.isCorrect)?.text ? 'correct-text' : 'incorrect-text'}>
            {selectedAnswer === options.find(opt => opt.isCorrect)?.text ? 'Correct!' : 'Incorrect. Try again!'}
          </p>
        </div>
      )}
    </div>
  );
};

export default QuestionCard;
