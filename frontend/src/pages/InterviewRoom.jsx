import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './InterviewRoom.css';

const InterviewRoom = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [textAnswer, setTextAnswer] = useState('');
  const [isRecording, setIsRecording] = useState(false);
  const [timeRemaining, setTimeRemaining] = useState(150); // 2:30 in seconds
  const [interviewSetup, setInterviewSetup] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);

  const navigate = useNavigate();

  useEffect(() => {
    // Get interview setup from localStorage
    const setup = localStorage.getItem('interviewSetup');
    const storedQuestions = localStorage.getItem('interviewQuestions');
    
    if (setup) {
      setInterviewSetup(JSON.parse(setup));
    } else {
      navigate('/interview-setup');
      return;
    }

    // Load AI-generated questions from localStorage
    if (storedQuestions) {
      try {
        const parsedQuestions = JSON.parse(storedQuestions);
        // Handle both string questions and object questions
        const formattedQuestions = parsedQuestions.map(q => 
          typeof q === 'string' ? q : q.questionText
        );
        setQuestions(formattedQuestions);
        console.log('Loaded AI-generated questions:', formattedQuestions);
      } catch (error) {
        console.error('Error parsing questions:', error);
        // Fallback to default questions
        setQuestions([
          "Tell me about yourself and your experience.",
          "What are your key strengths?",
          "Why are you interested in this role?",
          "Describe a challenging project you worked on.",
          "Where do you see yourself in 5 years?",
          "How do you handle tight deadlines?",
          "What motivates you in your career?",
          "Describe a time you worked in a team.",
          "How do you approach problem-solving?",
          "What are your career goals?"
        ]);
      }
    } else {
      // Fallback to default questions
      setQuestions([
        "Tell me about yourself and your experience.",
        "What are your key strengths?",
        "Why are you interested in this role?",
        "Describe a challenging project you worked on.",
        "Where do you see yourself in 5 years?",
        "How do you handle tight deadlines?",
        "What motivates you in your career?",
        "Describe a time you worked in a team.",
        "How do you approach problem-solving?",
        "What are your career goals?"
      ]);
    }
    
    setLoading(false);

    // Timer countdown
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitAnswer();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [navigate]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleMicrophoneClick = () => {
    setIsRecording(!isRecording);
    if (!isRecording) {
      // Start recording logic here
      console.log('Recording started...');
    } else {
      // Stop recording logic here
      console.log('Recording stopped...');
    }
  };

  const handleSubmitAnswer = () => {
    // Save answer and move to next question
    console.log('Answer submitted:', textAnswer);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTextAnswer('');
      setTimeRemaining(150); // Reset timer for next question
    } else {
      // Interview completed, navigate to results
      navigate('/results');
    }
  };

  const getProgressStatus = (index) => {
    if (index < currentQuestion) return 'completed';
    if (index === currentQuestion) return 'current';
    return 'upcoming';
  };

  return (
    <div className="interview-room-page">
      {/* Header */}
      <header className="interview-header">
        <div className="interview-title">
          {interviewSetup?.role || 'Technical'} Interview
        </div>
        <div className="timer">
          <span className="timer-icon">⏱️</span>
          {formatTime(timeRemaining)}
        </div>
      </header>

      {/* Loading State */}
      {loading && (
        <div className="loading-container">
          <div className="loading-spinner">
            <div className="spinner"></div>
            <p>Loading AI-generated questions...</p>
          </div>
        </div>
      )}

      {/* Main Content */}
      {!loading && (
        <div className="interview-container">
          {/* Main Interview Area */}
          <main className="main-interview">
            {/* AI Question Section */}
            <section className="question-section">
              <div className="question-label">AI Question</div>
              <h2 className="question-text">"{questions[currentQuestion]}"</h2>
              <p className="question-hint">Take your time to think through your answer</p>
            </section>

          {/* Answer Section */}
          <section className="answer-section">
            <label className="answer-label">Your Answer</label>
            
            <div className="answer-options">
              {/* Microphone Button */}
              <button 
                className={`microphone-btn ${isRecording ? 'recording' : ''}`}
                onClick={handleMicrophoneClick}
              >
                <span className="microphone-icon">🎤</span>
                {isRecording ? 'Stop Recording' : 'Start Voice Answer'}
              </button>

              {/* OR Divider */}
              <div className="or-divider">or</div>

              {/* Text Answer Box */}
              <textarea
                className="text-answer-box"
                placeholder="Type your answer here..."
                value={textAnswer}
                onChange={(e) => setTextAnswer(e.target.value)}
                rows={4}
              />

              {/* Submit Button */}
              <button 
                className="submit-btn"
                onClick={handleSubmitAnswer}
                disabled={!textAnswer.trim() && !isRecording}
              >
                Submit Answer
              </button>
            </div>
          </section>
        </main>

        {/* Progress Panel */}
        <aside className="progress-panel">
          <h3 className="progress-title">Interview Progress</h3>
          <ul className="progress-list">
            {questions.map((_, index) => (
              <li 
                key={index} 
                className={`progress-item ${getProgressStatus(index)}`}
              >
                <div className="progress-number">
                  {getProgressStatus(index) === 'completed' ? '✓' : index + 1}
                </div>
                <span>Question {index + 1}/{questions.length}</span>
              </li>
            ))}
          </ul>
        </aside>
      </div>
      )}
    </div>
  );
};

export default InterviewRoom;
