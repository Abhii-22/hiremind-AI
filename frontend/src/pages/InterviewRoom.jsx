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
  const [aiAnswer, setAiAnswer] = useState('');
  const [showAiAnswer, setShowAiAnswer] = useState(false);
  const [generatingAnswer, setGeneratingAnswer] = useState(false);
  const [verifyingAnswer, setVerifyingAnswer] = useState(false);
  const [showWrongMessage, setShowWrongMessage] = useState(false);
  const [evaluationFeedback, setEvaluationFeedback] = useState('');

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

  const generateAiAnswer = async () => {
    if (!questions[currentQuestion]) return;
    
    setGeneratingAnswer(true);
    setShowAiAnswer(false);
    
    try {
      const response = await fetch('http://localhost:5002/api/interviews/generate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          question: questions[currentQuestion],
          role: interviewSetup?.role || 'Frontend Developer',
          experience: interviewSetup?.experience || 'Mid-level',
          type: interviewSetup?.type || 'Technical'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        setAiAnswer(data.answer.answer);
        setShowAiAnswer(true);
      } else {
        console.error('Failed to generate answer:', data.error);
      }
    } catch (error) {
      console.error('Error generating AI answer:', error);
    } finally {
      setGeneratingAnswer(false);
    }
  };

  const handleSubmitAnswer = async () => {
    // Save answer and verify it before moving to next question
    console.log('Answer submitted:', textAnswer);
    
    if (!textAnswer.trim()) return;
    
    setVerifyingAnswer(true);
    setShowWrongMessage(false);
    
    try {
      const response = await fetch('http://localhost:5002/api/interviews/evaluate-answer', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          question: questions[currentQuestion],
          userAnswer: textAnswer,
          role: interviewSetup?.role || 'Frontend Developer',
          experience: interviewSetup?.experience || 'Mid-level',
          type: interviewSetup?.type || 'Technical'
        })
      });
      
      const data = await response.json();
      if (data.success) {
        const evaluation = data.evaluation;
        console.log('Answer evaluation:', evaluation);
        
        if (evaluation.isCorrect && !evaluation.isRandomContent) {
          // Correct answer - move to next question
          console.log('✅ Answer is correct, moving to next question');
          
          if (currentQuestion < questions.length - 1) {
            setCurrentQuestion(currentQuestion + 1);
            setTextAnswer('');
            setAiAnswer('');
            setShowAiAnswer(false);
            setShowWrongMessage(false);
            setEvaluationFeedback('');
            setTimeRemaining(150); // Reset timer for next question
          } else {
            // Interview completed, navigate to results
            navigate('/results');
          }
        } else {
          // Wrong answer - show wrong message
          console.log('❌ Answer is wrong, showing error');
          setShowWrongMessage(true);
          setEvaluationFeedback(evaluation.feedback || 'Your answer is not correct. Please try again.');
        }
      } else {
        console.error('Failed to evaluate answer:', data.error);
        setShowWrongMessage(true);
        setEvaluationFeedback('Failed to verify answer. Please try again.');
      }
    } catch (error) {
      console.error('Error evaluating answer:', error);
      setShowWrongMessage(true);
      setEvaluationFeedback('Error verifying answer. Please try again.');
    } finally {
      setVerifyingAnswer(false);
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

              {/* Generate AI Answer Button */}
              <button 
                className="generate-ai-answer-btn"
                onClick={generateAiAnswer}
                disabled={generatingAnswer}
              >
                <span className="ai-icon">🤖</span>
                {generatingAnswer ? 'Generating AI Answer...' : 'Generate AI Answer'}
              </button>

              {/* AI Answer Display */}
              {showAiAnswer && (
                <div className="ai-answer-section">
                  <div className="ai-answer-label">
                    <span className="ai-icon">🤖</span>
                    AI Generated Answer
                  </div>
                  <div className="ai-answer-text">
                    {aiAnswer}
                  </div>
                </div>
              )}

              {/* Wrong Answer Message */}
              {showWrongMessage && (
                <div className="wrong-answer-message">
                  <div className="wrong-answer-header">
                    <span className="wrong-icon">❌</span>
                    Wrong Answer
                  </div>
                  <div className="wrong-answer-feedback">
                    {evaluationFeedback}
                  </div>
                  <button 
                    className="try-again-btn"
                    onClick={() => {
                      setShowWrongMessage(false);
                      setEvaluationFeedback('');
                      setTextAnswer('');
                    }}
                  >
                    Try Again
                  </button>
                </div>
              )}

              {/* Submit Button */}
              <button 
                className="submit-btn"
                onClick={handleSubmitAnswer}
                disabled={!textAnswer.trim() && !isRecording || verifyingAnswer}
              >
                {verifyingAnswer ? 'Verifying Answer...' : 'Submit Answer'}
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
