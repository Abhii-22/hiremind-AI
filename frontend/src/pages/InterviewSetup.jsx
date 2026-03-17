import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './InterviewSetup.css';

const InterviewSetup = () => {
  const [setupData, setSetupData] = useState({
    role: 'Frontend Developer',
    experience: 'Mid-level',
    type: 'Technical',
    duration: '30 minutes'
  });
  
  const [isGenerating, setIsGenerating] = useState(false);
  const [questions, setQuestions] = useState([]);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const roles = [
    'Frontend Developer',
    'Backend Developer', 
    'Full Stack Developer',
    'React Developer',
    'Node.js Developer',
    'Python Developer',
    'Java Developer',
    'DevOps Engineer',
    'Data Scientist',
    'Product Manager'
  ];

  const experienceLevels = [
    'Entry-level',
    'Mid-level',
    'Senior',
    'Lead/Principal'
  ];

  const interviewTypes = [
    'Technical',
    'Behavioral',
    'System Design',
    'Coding Challenge',
    'HR Interview',
    'Mixed'
  ];

  const durations = [
    '15 minutes',
    '30 minutes',
    '45 minutes',
    '60 minutes',
    '90 minutes'
  ];

  const generateQuestions = async () => {
    setIsGenerating(true);
    setError('');
    
    // Clear any cached questions
    localStorage.removeItem('interviewQuestions');
    
    try {
      const response = await fetch(`http://localhost:5002/api/interviews/generate-questions?t=${Date.now()}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Cache-Control': 'no-cache'
        },
        body: JSON.stringify({
          role: setupData.role,
          experience: setupData.experience,
          type: setupData.type
        })
      });

      const data = await response.json();
      
      if (data.success) {
        // Extract question text from structured objects
        const formattedQuestions = data.questions.map(q => 
          typeof q === 'string' ? q : q.questionText
        );
        console.log('Received questions from backend:', data.questions.length);
        console.log('Formatted questions:', formattedQuestions.length);
        setQuestions(formattedQuestions);
        
        // Store full structured questions and setup data in localStorage
        localStorage.setItem('interviewQuestions', JSON.stringify(data.questions));
        localStorage.setItem('interviewSetup', JSON.stringify(setupData));
      } else {
        setError(data.error || 'Failed to generate questions');
      }
    } catch (error) {
      console.error('Error generating questions:', error);
      setError('Failed to connect to AI service. Please try again.');
      // Fallback to mock questions
      const fallbackQuestions = [
        "Tell me about yourself and your experience.",
        "Why are you interested in this role?",
        "Describe a challenging project you worked on.",
        "How do you handle tight deadlines?",
        "Where do you see yourself in 5 years?",
        "What are your key strengths?",
        "How do you approach problem-solving?",
        "Describe a time you worked in a team.",
        "What motivates you in your career?",
        "How do you handle constructive feedback?"
      ];
      setQuestions(fallbackQuestions);
      localStorage.setItem('interviewQuestions', JSON.stringify(fallbackQuestions));
      localStorage.setItem('interviewSetup', JSON.stringify(setupData));
    } finally {
      setIsGenerating(false);
    }
  };

  const handleStartInterview = async () => {
    if (questions.length === 0) {
      // Generate questions first, then start interview
      await generateQuestions();
      // Wait a moment for state to update, then navigate
      setTimeout(() => {
        navigateToInterview();
      }, 500);
      return;
    }

    navigateToInterview();
  };

  const navigateToInterview = () => {
    // Store setup data and navigate to appropriate interview page
    localStorage.setItem('interviewSetup', JSON.stringify(setupData));
    
    if (setupData.type === 'Coding Challenge') {
      navigate('/coding-interview');
    } else {
      navigate('/interview-room');
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setSetupData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  return (
    <div className="interview-setup-page">
      <div className="setup-container">
        <div className="setup-header">
          <h1>Interview Setup</h1>
          <p>Configure your interview session</p>
        </div>

        <div className="setup-form">
          <div className="form-group">
            <label htmlFor="role">Role</label>
            <select
              id="role"
              name="role"
              value={setupData.role}
              onChange={handleChange}
              className="form-select"
            >
              {roles.map(role => (
                <option key={role} value={role}>{role}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="experience">Experience Level</label>
            <select
              id="experience"
              name="experience"
              value={setupData.experience}
              onChange={handleChange}
              className="form-select"
            >
              {experienceLevels.map(level => (
                <option key={level} value={level}>{level}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="type">Interview Type</label>
            <select
              id="type"
              name="type"
              value={setupData.type}
              onChange={handleChange}
              className="form-select"
            >
              {interviewTypes.map(type => (
                <option key={type} value={type}>{type}</option>
              ))}
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="duration">Duration</label>
            <select
              id="duration"
              name="duration"
              value={setupData.duration}
              onChange={handleChange}
              className="form-select"
            >
              {durations.map(duration => (
                <option key={duration} value={duration}>{duration}</option>
              ))}
            </select>
          </div>

          {error && (
            <div className="error-message">
              {error}
            </div>
          )}

          {questions.length > 0 && (
            <div className="questions-preview">
              <h3>Generated Questions Preview ({questions.length} questions):</h3>
              <ul>
                {questions.map((question, index) => (
                  <li key={index}>{index + 1}. {question}</li>
                ))}
              </ul>
            </div>
          )}

          <div className="form-actions">
            <button
              onClick={generateQuestions}
              disabled={isGenerating}
              className="btn btn-secondary"
            >
              {isGenerating ? 'Generating AI Questions...' : 'Generate AI Questions'}
            </button>
            
            <button
              onClick={handleStartInterview}
              disabled={isGenerating}
              className="btn btn-primary"
            >
              {questions.length === 0 ? 'Start with Default Questions' : 'Start Interview'}
            </button>
          </div>
        </div>

        <div className="setup-info">
          <div className="info-card">
            <h3>🤖 AI-Powered Questions</h3>
            <p>Our AI generates personalized questions based on your role, experience level, and interview type.</p>
          </div>
          
          <div className="info-card">
            <h3>📊 Real-time Analysis</h3>
            <p>Get instant feedback and scoring on your answers during the interview.</p>
          </div>
          
          <div className="info-card">
            <h3>🎯 Personalized Feedback</h3>
            <p>Receive detailed insights and recommendations to improve your interview skills.</p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default InterviewSetup;
