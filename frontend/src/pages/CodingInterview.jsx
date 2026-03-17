import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import './CodingInterview.css';

const CodingInterview = () => {
  const [code, setCode] = useState('function reverseString(str){\n\n}');
  const [language, setLanguage] = useState('javascript');
  const [timeRemaining, setTimeRemaining] = useState(1800); // 30 minutes
  const [isRunning, setIsRunning] = useState(false);
  const [testResults, setTestResults] = useState(null);
  const [consoleOutput, setConsoleOutput] = useState([]);
  const [showConsole, setShowConsole] = useState(false);
  const codeEditorRef = useRef(null);

  const navigate = useNavigate();

  const codingProblem = {
    title: "Reverse String",
    difficulty: "Easy",
    description: "Write a function to reverse a string.",
    example: {
      input: '"hello"',
      output: '"olleh"'
    },
    constraints: [
      "1 <= s.length <= 10^5",
      "s may contain any printable ASCII characters",
      "Do not use built-in reverse functions"
    ]
  };

  const languageTemplates = {
    javascript: 'function reverseString(str){\n\n}',
    python: 'def reverse_string(s):\n    pass',
    java: 'public String reverseString(String s) {\n    \n}',
    cpp: 'string reverseString(string s) {\n    \n}'
  };

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeRemaining(prev => {
        if (prev <= 1) {
          clearInterval(timer);
          handleSubmitCode();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleLanguageChange = (newLanguage) => {
    setLanguage(newLanguage);
    setCode(languageTemplates[newLanguage] || '');
  };

  const runCode = () => {
    setIsRunning(true);
    setShowConsole(true);
    setConsoleOutput([
      { type: 'info', text: 'Running code...' },
      { type: 'info', text: 'Test case 1: Input: "hello"' }
    ]);

    // Simulate code execution
    setTimeout(() => {
      const testPassed = Math.random() > 0.3; // 70% pass rate for demo
      
      if (testPassed) {
        setConsoleOutput(prev => [
          ...prev,
          { type: 'success', text: 'Test case 1: Output: "olleh"' },
          { type: 'success', text: 'Test case 1: ✓ Passed' },
          { type: 'info', text: 'Test case 2: Input: "world"' },
          { type: 'success', text: 'Test case 2: Output: "dlrow"' },
          { type: 'success', text: 'Test case 2: ✓ Passed' },
          { type: 'success', text: 'All test cases passed!' }
        ]);
        setTestResults({ passed: 2, total: 2, status: 'pass' });
      } else {
        setConsoleOutput(prev => [
          ...prev,
          { type: 'error', text: 'Test case 1: Output: undefined' },
          { type: 'error', text: 'Test case 1: ✗ Failed - Expected: "olleh"' },
          { type: 'error', text: 'All test cases did not pass' }
        ]);
        setTestResults({ passed: 0, total: 2, status: 'fail' });
      }
      
      setIsRunning(false);
    }, 2000);
  };

  const handleSubmitCode = () => {
    console.log('Submitting code:', code, 'Language:', language);
    // Navigate to results after submission
    navigate('/results');
  };

  const getDifficultyClass = (difficulty) => {
    switch (difficulty.toLowerCase()) {
      case 'easy': return 'difficulty-easy';
      case 'medium': return 'difficulty-medium';
      case 'hard': return 'difficulty-hard';
      default: return 'difficulty-easy';
    }
  };

  const getTestStatusClass = (status) => {
    switch (status) {
      case 'pass': return 'pass';
      case 'fail': return 'fail';
      default: return 'pending';
    }
  };

  return (
    <div className="coding-interview-page">
      {/* Header */}
      <header className="coding-header">
        <div className="coding-title">Coding Interview</div>
        <div className="timer">
          <span>⏱️</span>
          {formatTime(timeRemaining)}
        </div>
      </header>

      {/* Main Content */}
      <div className="coding-container">
        {/* Problem Section */}
        <section className="problem-section">
          <div className="problem-header">
            <h2 className="problem-title">{codingProblem.title}</h2>
            <span className={`problem-difficulty ${getDifficultyClass(codingProblem.difficulty)}`}>
              {codingProblem.difficulty}
            </span>
          </div>

          <div className="problem-description">
            <h3>Problem Description</h3>
            <p>{codingProblem.description}</p>
          </div>

          <div className="example-section">
            <h4>Example:</h4>
            <div className="example-code">
              Input: {codingProblem.example.input}
            </div>
            <div className="example-code">
              Output: {codingProblem.example.output}
            </div>
          </div>

          <div className="constraints-section">
            <h4>Constraints:</h4>
            <ul className="constraints-list">
              {codingProblem.constraints.map((constraint, index) => (
                <li key={index}>{constraint}</li>
              ))}
            </ul>
          </div>
        </section>

        {/* Code Editor Section */}
        <section className="editor-section">
          <div className="editor-header">
            <div className="editor-title">Solution</div>
            <div className="language-selector">
              <label>Language:</label>
              <select 
                value={language} 
                onChange={(e) => handleLanguageChange(e.target.value)}
              >
                <option value="javascript">JavaScript</option>
                <option value="python">Python</option>
                <option value="java">Java</option>
                <option value="cpp">C++</option>
              </select>
            </div>
          </div>

          <div className="code-editor-container">
            <textarea
              ref={codeEditorRef}
              className="code-editor"
              value={code}
              onChange={(e) => setCode(e.target.value)}
              placeholder={`// Write your ${language} solution here...`}
              spellCheck={false}
            />
          </div>

          <div className="editor-actions">
            <button 
              onClick={runCode} 
              disabled={isRunning}
              className="run-btn"
            >
              <span>▶</span>
              {isRunning ? 'Running...' : 'Run Code'}
            </button>
            <button onClick={handleSubmitCode} className="submit-btn">
              <span>✓</span>
              Submit
            </button>
            
            {testResults && (
              <div className="test-case-section">
                <div className={`test-status ${getTestStatusClass(testResults.status)}`}>
                  <span>{testResults.status === 'pass' ? '✓' : '✗'}</span>
                  Test Cases: {testResults.passed}/{testResults.total}
                </div>
              </div>
            )}
          </div>

          {/* Console Output */}
          {showConsole && (
            <div className="console-output show">
              {consoleOutput.map((line, index) => (
                <div key={index} className={`console-line ${line.type}`}>
                  {line.text}
                </div>
              ))}
            </div>
          )}
        </section>
      </div>
    </div>
  );
};

export default CodingInterview;
