import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './History.css';

const History = () => {
  const [interviewHistory, setInterviewHistory] = useState([]);
  const navigate = useNavigate();

  const mockHistory = [
    {
      id: 1,
      date: '10 Feb',
      role: 'React Dev',
      score: 7.5,
      status: 'completed'
    },
    {
      id: 2,
      date: '12 Feb',
      role: 'Python Dev',
      score: 6.8,
      status: 'completed'
    },
    {
      id: 3,
      date: '14 Feb',
      role: 'HR Interview',
      score: 8.2,
      status: 'completed'
    },
    {
      id: 4,
      date: '16 Feb',
      role: 'Frontend Dev',
      score: 7.0,
      status: 'completed'
    },
    {
      id: 5,
      date: '18 Feb',
      role: 'Full Stack',
      score: 8.5,
      status: 'completed'
    }
  ];

  useEffect(() => {
    // In a real app, this would fetch from an API
    setInterviewHistory(mockHistory);
  }, []);

  const getScoreClass = (score) => {
    if (score >= 8.0) return 'score-high';
    if (score >= 7.0) return 'score-medium';
    return 'score-low';
  };

  const handleViewResults = (interviewId) => {
    // Navigate to results page with specific interview data
    navigate('/results');
  };

  const handleStartNewInterview = () => {
    navigate('/interview-setup');
  };

  const totalInterviews = interviewHistory.length;
  const averageScore = interviewHistory.length > 0 
    ? (interviewHistory.reduce((sum, interview) => sum + interview.score, 0) / interviewHistory.length).toFixed(1)
    : 0;
  const highScoreCount = interviewHistory.filter(interview => interview.score >= 8.0).length;

  return (
    <div className="history-page">
      <div className="history-container">
        {/* Header */}
        <div className="history-header">
          <h1 className="history-title">Interview History</h1>
          <p className="history-subtitle">Track your progress over time</p>
        </div>

        {/* Stats Summary */}
        <div className="stats-summary">
          <div className="stat-card">
            <div className="stat-value">{totalInterviews}</div>
            <div className="stat-label">Total Interviews</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{averageScore}</div>
            <div className="stat-label">Average Score</div>
          </div>
          <div className="stat-card">
            <div className="stat-value">{highScoreCount}</div>
            <div className="stat-label">High Scores (8+)</div>
          </div>
        </div>

        {/* Table */}
        <div className="history-table-container">
          {interviewHistory.length > 0 ? (
            <table className="history-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Role</th>
                  <th>Score</th>
                  <th>Action</th>
                </tr>
              </thead>
              <tbody>
                {interviewHistory.map((interview) => (
                  <tr key={interview.id}>
                    <td className="date-cell">{interview.date}</td>
                    <td className="role-cell">{interview.role}</td>
                    <td className="score-cell">
                      <span className={`score-badge ${getScoreClass(interview.score)}`}>
                        {interview.score}
                      </span>
                    </td>
                    <td className="action-cell">
                      <button 
                        className="view-btn"
                        onClick={() => handleViewResults(interview.id)}
                      >
                        View
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <div className="empty-state">
              <div className="empty-state-icon">📝</div>
              <h2 className="empty-state-title">No Interview History Yet</h2>
              <p className="empty-state-text">
                Start practicing to see your interview history and progress here.
              </p>
              <button 
                className="start-interview-btn"
                onClick={handleStartNewInterview}
              >
                Start Your First Interview
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default History;
