import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    // Get user data from localStorage
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleStartInterview = () => {
    navigate('/interview-setup');
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    navigate('/login');
  };

  const recentInterviews = [
    { type: 'React Interview', score: 7, date: '2024-01-15' },
    { type: 'Python Interview', score: 6, date: '2024-01-14' },
    { type: 'HR Interview', score: 8, date: '2024-01-13' }
  ];

  const getScoreClass = (score) => {
    if (score >= 8) return 'high';
    if (score >= 6) return 'medium';
    return 'low';
  };

  return (
    <div className="dashboard-page">
      {/* Sidebar */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <h2>HireMind AI</h2>
        </div>
        <nav className="sidebar-nav">
          <div className="sidebar-item">
            <button className="sidebar-link active">
              <span className="sidebar-icon">📊</span>
              Dashboard
            </button>
          </div>
          <div className="sidebar-item">
            <button className="sidebar-link" onClick={handleStartInterview}>
              <span className="sidebar-icon">🎤</span>
              Start Interview
            </button>
          </div>
          <div className="sidebar-item">
            <button className="sidebar-link">
              <span className="sidebar-icon">📝</span>
              Interview History
            </button>
          </div>
          <div className="sidebar-item">
            <button className="sidebar-link">
              <span className="sidebar-icon">👤</span>
              Profile
            </button>
          </div>
          <div className="sidebar-item">
            <button className="sidebar-link" onClick={handleLogout}>
              <span className="sidebar-icon">🚪</span>
              Logout
            </button>
          </div>
        </nav>
      </aside>

      {/* Main Content */}
      <main className="main-content">
        <div className="dashboard-header">
          <div className="welcome-section">
            <h1 className="welcome-title">
              Welcome {user?.name || 'Abhishek'} 👋
            </h1>
            <button className="start-interview-btn" onClick={handleStartInterview}>
              Start New Interview
            </button>
          </div>
        </div>

        {/* Stats Section */}
        <section className="stats-section">
          <h2 className="stats-title">Stats</h2>
          <div className="stats-grid">
            <div className="stat-card">
              <div className="stat-value">12</div>
              <div className="stat-label">Interviews Completed</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">7.2</div>
              <div className="stat-label">Average Score</div>
            </div>
            <div className="stat-card">
              <div className="stat-value">DSA</div>
              <div className="stat-label">Weak Skill</div>
            </div>
          </div>
        </section>

        {/* Recent Interviews */}
        <section className="recent-interviews">
          <h2 className="recent-title">Recent Interviews</h2>
          <ul className="interview-list">
            {recentInterviews.map((interview, index) => (
              <li key={index} className="interview-item">
                <div className="interview-info">
                  <div className="interview-type">{interview.type}</div>
                  <div className="interview-date">{interview.date}</div>
                </div>
                <div className="interview-score">
                  <span className={`score-badge ${getScoreClass(interview.score)}`}>
                    Score {interview.score}
                  </span>
                </div>
              </li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
};

export default Dashboard;
