import React from 'react';

const InterviewCard = ({ title, company, difficulty, duration, tags, onStart }) => {
  return (
    <div className="interview-card">
      <div className="card-header">
        <h3 className="card-title">{title}</h3>
        <span className={`difficulty ${difficulty.toLowerCase()}`}>{difficulty}</span>
      </div>
      <div className="card-body">
        <p className="company">{company}</p>
        <p className="duration">Duration: {duration}</p>
        <div className="tags">
          {tags.map((tag, index) => (
            <span key={index} className="tag">{tag}</span>
          ))}
        </div>
      </div>
      <div className="card-footer">
        <button className="start-btn" onClick={onStart}>
          Start Interview
        </button>
      </div>
    </div>
  );
};

export default InterviewCard;
