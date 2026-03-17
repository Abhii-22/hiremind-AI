import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Result.css';

const Result = () => {
  const [score, setScore] = useState(7.5);
  const [animateScore, setAnimateScore] = useState(false);
  const navigate = useNavigate();

  const interviewResults = {
    score: 7.5,
    maxScore: 10,
    strengths: [
      'Communication',
      'React Basics'
    ],
    weaknesses: [
      'Data Structures',
      'System Design'
    ],
    aiFeedback: 'You explained concepts clearly but need stronger DSA knowledge.',
    scoreBreakdown: {
      'Communication': 8.5,
      'Technical': 7.0,
      'Problem Solving': 6.5,
      'Code Quality': 8.0
    }
  };

  useEffect(() => {
    // Animate score on mount
    setTimeout(() => setAnimateScore(true), 100);
  }, []);

  const getScoreGrade = (score) => {
    if (score >= 9) return 'Excellent';
    if (score >= 8) return 'Good';
    if (score >= 7) return 'Average';
    if (score >= 6) return 'Below Average';
    return 'Needs Improvement';
  };

  const getScoreColor = (score) => {
    if (score >= 8) return '#28a745';
    if (score >= 7) return '#ffc107';
    if (score >= 6) return '#fd7e14';
    return '#dc3545';
  };

  const handlePracticeAgain = () => {
    navigate('/interview-setup');
  };

  const handleBackToDashboard = () => {
    navigate('/dashboard');
  };

  return (
    <div className="results-page">
      <div className="results-container">
        {/* Header */}
        <div className="results-header">
          <h1 className="results-title">Interview Results</h1>
        </div>

        {/* Score Display */}
        <div className="score-display">
          <div className={`score-number ${animateScore ? 'animate' : ''}`}>
            {score.toFixed(1)} / {interviewResults.maxScore}
          </div>
          <div className="score-label">Overall Score</div>
          <div className="score-grade">{getScoreGrade(score)}</div>
        </div>

        {/* Progress Bar */}
        <div className="progress-bar">
          <div 
            className="progress-fill" 
            style={{ 
              width: `${animateScore ? (score / interviewResults.maxScore) * 100 : 0}%`,
              backgroundColor: getScoreColor(score)
            }}
          ></div>
        </div>

        {/* Score Breakdown */}
        <div className="score-breakdown">
          {Object.entries(interviewResults.scoreBreakdown).map(([category, value]) => (
            <div key={category} className="score-item">
              <div className="score-category">{category}</div>
              <div className="score-value" style={{ color: getScoreColor(value) }}>
                {value.toFixed(1)}
              </div>
            </div>
          ))}
        </div>

        {/* Strengths */}
        <div className="feedback-section">
          <h3 className="feedback-title">
            <span>💪</span>
            Strengths
          </h3>
          <ul className="feedback-list">
            {interviewResults.strengths.map((strength, index) => (
              <li key={index} className="feedback-item strength-item">
                <span className="feedback-icon">✔</span>
                {strength}
              </li>
            ))}
          </ul>
        </div>

        {/* Weaknesses */}
        <div className="feedback-section">
          <h3 className="feedback-title">
            <span>📚</span>
            Weaknesses
          </h3>
          <ul className="feedback-list">
            {interviewResults.weaknesses.map((weakness, index) => (
              <li key={index} className="feedback-item weakness-item">
                <span className="feedback-icon">✘</span>
                {weakness}
              </li>
            ))}
          </ul>
        </div>

        {/* AI Feedback */}
        <div className="ai-feedback">
          <div className="ai-feedback-text">
            "{interviewResults.aiFeedback}"
          </div>
          <div className="ai-attribution">- AI Interview Coach</div>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center', flexWrap: 'wrap' }}>
          <button className="practice-again-btn" onClick={handlePracticeAgain}>
            <span>🔄</span>
            Practice Again
          </button>
          <button 
            className="practice-again-btn" 
            onClick={handleBackToDashboard}
            style={{ background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)' }}
          >
            <span>📊</span>
            Back to Dashboard
          </button>
        </div>
      </div>
    </div>
  );
};

export default Result;
