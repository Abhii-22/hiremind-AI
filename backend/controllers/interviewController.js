const Interview = require('../models/Interview');
const Result = require('../models/Result');
const { generateQuestions } = require('../services/aiService');

// @desc    Get available interviews
// @route   GET /api/interviews/available
// @access  Private
exports.getAvailableInterviews = async (req, res) => {
  try {
    const { difficulty, type, page = 1, limit = 10 } = req.query;
    
    // Build query
    const query = { userId: req.user.id };
    if (difficulty) query.difficulty = difficulty;
    if (type) query.type = type;

    const interviews = await Interview.find(query)
      .select('jobRole company difficulty duration type topics date')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Interview.countDocuments(query);

    res.status(200).json({
      success: true,
      data: interviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get available interviews error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching available interviews'
    });
  }
};

// @desc    Get interview by ID
// @route   GET /api/interviews/:id
// @access  Private
exports.getInterviewById = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview not found'
      });
    }

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    console.error('Get interview by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching interview'
    });
  }
};

// @desc    Create interview session
// @route   POST /api/interviews/session
// @access  Private
exports.createInterviewSession = async (req, res) => {
  try {
    const { jobRole, company, difficulty, duration, topics, type, useAI = false } = req.body;

    let questions = [];
    
    // If AI generation is requested, generate questions based on role
    if (useAI) {
      try {
        questions = await generateQuestions(jobRole, difficulty || 'Mid-level', type || 'Technical');
      } catch (error) {
        console.error('AI question generation failed, using fallback:', error);
        // Fallback to mock questions if AI fails
        questions = await generateMockQuestions(topics, difficulty, type);
      }
    } else {
      // Use existing mock question generation
      questions = await generateMockQuestions(topics, difficulty, type);
    }

    const interview = await Interview.create({
      userId: req.user.id,
      jobRole,
      company,
      difficulty,
      duration,
      topics,
      type,
      questions: questions || []
    });

    res.status(201).json({
      success: true,
      data: interview
    });
  } catch (error) {
    console.error('Create interview session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error creating interview session'
    });
  }
};

// @desc    Get interview session
// @route   GET /api/interviews/session/:sessionId
// @access  Private
exports.getInterviewSession = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      sessionId: req.params.sessionId,
      userId: req.user.id
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    console.error('Get interview session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching interview session'
    });
  }
};

// @desc    Submit answer
// @route   POST /api/interviews/session/:sessionId/answer
// @access  Private
exports.submitAnswer = async (req, res) => {
  try {
    const { questionId, answer, timeSpent } = req.body;

    const interview = await Interview.findOne({
      sessionId: req.params.sessionId,
      userId: req.user.id
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }

    await interview.submitAnswer(questionId, answer, timeSpent);

    res.status(200).json({
      success: true,
      data: interview
    });
  } catch (error) {
    console.error('Submit answer error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting answer'
    });
  }
};

// @desc    Submit code
// @route   POST /api/interviews/session/:sessionId/code
// @access  Private
exports.submitCode = async (req, res) => {
  try {
    const { questionId, code, language } = req.body;

    const interview = await Interview.findOne({
      sessionId: req.params.sessionId,
      userId: req.user.id
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }

    // Run code tests (mock implementation)
    const testResults = await runCodeTests(code, language, questionId);

    await interview.submitCode(questionId, code, language, testResults);

    res.status(200).json({
      success: true,
      data: {
        testResults,
        interview
      }
    });
  } catch (error) {
    console.error('Submit code error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error submitting code'
    });
  }
};

// @desc    Run code test
// @route   POST /api/interviews/session/:sessionId/run-test
// @access  Private
exports.runCodeTest = async (req, res) => {
  try {
    const { questionId, code, language } = req.body;

    // Run code tests (mock implementation)
    const testResults = await runCodeTests(code, language, questionId);

    res.status(200).json({
      success: true,
      data: testResults
    });
  } catch (error) {
    console.error('Run code test error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error running code tests'
    });
  }
};

// @desc    Complete interview session
// @route   POST /api/interviews/session/:sessionId/complete
// @access  Private
exports.completeInterviewSession = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      sessionId: req.params.sessionId,
      userId: req.user.id
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }

    await interview.completeInterview();

    // Generate results (this would typically be done by a background job)
    const results = await generateResults(interview);

    res.status(200).json({
      success: true,
      data: {
        interview,
        results
      }
    });
  } catch (error) {
    console.error('Complete interview session error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error completing interview session'
    });
  }
};

// @desc    Get interview results
// @route   GET /api/interviews/session/:sessionId/results
// @access  Private
exports.getInterviewResults = async (req, res) => {
  try {
    const interview = await Interview.findOne({
      sessionId: req.params.sessionId,
      userId: req.user.id
    });

    if (!interview) {
      return res.status(404).json({
        success: false,
        message: 'Interview session not found'
      });
    }

    const result = await Result.findOne({ 
      interviewId: interview._id, 
      userId: req.user.id 
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Results not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get interview results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching interview results'
    });
  }
};

// @desc    Get interview history
// @route   GET /api/interviews/history
// @access  Private
exports.getInterviewHistory = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { userId: req.user.id };
    if (status) query.status = status;

    const interviews = await Interview.find(query)
      .select('jobRole company difficulty status startedAt completedAt date')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Interview.countDocuments(query);

    res.status(200).json({
      success: true,
      data: interviews,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get interview history error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching interview history'
    });
  }
};

// @desc    Get interview statistics
// @route   GET /api/interviews/stats
// @access  Private
exports.getInterviewStats = async (req, res) => {
  try {
    const userId = req.user.id;

    const totalInterviews = await Interview.countDocuments({ userId });
    const completedInterviews = await Interview.countDocuments({ 
      userId, 
      status: 'completed' 
    });

    const results = await Result.find({ userId });
    const averageScore = results.length > 0 
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / results.length)
      : 0;

    const stats = {
      totalInterviews,
      completedInterviews,
      averageScore,
      successRate: totalInterviews > 0 ? Math.round((completedInterviews / totalInterviews) * 100) : 0
    };

    res.status(200).json({
      success: true,
      data: stats
    });
  } catch (error) {
    console.error('Get interview stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching interview statistics'
    });
  }
};

// Helper functions (mock implementations)
async function generateMockQuestions(topics, difficulty, type) {
  // Mock questions - in production, this would fetch from a question bank
  return [
    {
      questionId: new mongoose.Types.ObjectId(),
      questionText: "What is the difference between let and const in JavaScript?",
      type: "multiple-choice",
      options: [
        { text: "let can be reassigned, const cannot", isCorrect: true },
        { text: "const can be reassigned, let cannot", isCorrect: false },
        { text: "There is no difference", isCorrect: false },
        { text: "let is function scoped, const is block scoped", isCorrect: false }
      ],
      correctAnswer: "let can be reassigned, const cannot",
      difficulty,
      category: "JavaScript",
      timeLimit: 60,
      aiGenerated: false
    }
  ];
}

async function runCodeTests(code, language, questionId) {
  // Mock code testing - in production, this would use a sandboxed environment
  return [
    {
      input: "[2,7,11,15], 9",
      expectedOutput: "[0,1]",
      actualOutput: "[0,1]",
      passed: true,
      executionTime: 45
    },
    {
      input: "[3,2,4], 6",
      expectedOutput: "[1,2]",
      actualOutput: "[1,2]",
      passed: true,
      executionTime: 38
    }
  ];
}

async function generateResults(interview) {
  // Mock result generation - in production, this would involve AI analysis
  const overallScore = Math.floor(Math.random() * 30) + 70; // 70-100 range
  
  const result = await Result.create({
    userId: interview.userId,
    interviewId: interview._id,
    score: overallScore,
    categoryScores: {
      'Technical Skills': overallScore + Math.floor(Math.random() * 10) - 5,
      'Problem Solving': overallScore + Math.floor(Math.random() * 10) - 5,
      'Communication': overallScore + Math.floor(Math.random() * 10) - 5,
      'Code Quality': overallScore + Math.floor(Math.random() * 10) - 5
    },
    status: 'completed',
    processedAt: new Date()
  });

  result.calculateMetrics();
  result.generateFeedback();
  await result.save();

  return result;
}

// Additional controller methods would be implemented here...
exports.retryInterview = async (req, res) => {
  // Implementation for retrying interviews
};

exports.resumeInterview = async (req, res) => {
  // Implementation for resuming interviews
};

exports.getQuestionsByCategory = async (req, res) => {
  // Implementation for getting questions by category
};

exports.getCodingProblems = async (req, res) => {
  // Implementation for getting coding problems
};

exports.saveInterviewFeedback = async (req, res) => {
  // Implementation for saving interview feedback
};

exports.getInterviewTips = async (req, res) => {
  // Implementation for getting interview tips
};
