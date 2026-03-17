const mongoose = require('mongoose');

const interviewSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  jobRole: {
    type: String,
    required: true,
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  difficulty: {
    type: String,
    enum: ['Easy', 'Medium', 'Hard'],
    default: 'Medium'
  },
  duration: {
    type: Number, // in minutes
    required: true
  },
  topics: [{
    type: String,
    trim: true
  }],
  type: {
    type: String,
    enum: ['Technical', 'Behavioral', 'System Design', 'Coding Challenge', 'HR Interview', 'Mixed'],
    required: true
  },
  questions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    questionText: {
      type: String,
      required: true
    },
    type: {
      type: String,
      enum: ['text', 'multiple-choice', 'coding'],
      required: true
    },
    options: [{
      text: String,
      isCorrect: Boolean
    }],
    correctAnswer: String,
    difficulty: String,
    category: String,
    timeLimit: Number, // in seconds
    aiGenerated: {
      type: Boolean,
      default: false
    }
  }],
  answers: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    answer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    timeSpent: Number,
    submittedAt: {
      type: Date,
      default: Date.now
    },
    aiAnalysis: {
      score: Number,
      feedback: String,
      communication: Number,
      technical: Number,
      confidence: Number
    }
  }],
  codeSubmissions: [{
    questionId: {
      type: mongoose.Schema.Types.ObjectId,
      required: true
    },
    code: String,
    language: String,
    testResults: [{
      input: String,
      expectedOutput: String,
      actualOutput: String,
      passed: Boolean,
      executionTime: Number
    }],
    submittedAt: {
      type: Date,
      default: Date.now
    },
    aiAnalysis: {
      correctness: Number,
      efficiency: Number,
      readability: Number,
      feedback: String,
      suggestions: String
    }
  }],
  status: {
    type: String,
    enum: ['created', 'in-progress', 'completed', 'abandoned'],
    default: 'created'
  },
  startedAt: Date,
  completedAt: Date,
  date: {
    type: Date,
    default: Date.now
  },
  sessionId: {
    type: String,
    unique: true,
    required: true
  },
  settings: {
    allowRetries: {
      type: Boolean,
      default: true
    },
    showResultsImmediately: {
      type: Boolean,
      default: true
    },
    randomizeQuestions: {
      type: Boolean,
      default: false
    }
  }
}, {
  timestamps: true
});

// Generate session ID before saving
interviewSchema.pre('save', function(next) {
  if (!this.sessionId) {
    this.sessionId = require('crypto').randomBytes(16).toString('hex');
  }
  next();
});

// Start interview
interviewSchema.methods.startInterview = function() {
  this.status = 'in-progress';
  this.startedAt = new Date();
  return this.save();
};

// Submit answer with AI analysis
interviewSchema.methods.submitAnswer = async function(questionId, answer, timeSpent, aiAnalysis = null) {
  const questionIndex = this.questions.findIndex(q => q._id.toString() === questionId);
  
  if (questionIndex === -1) {
    throw new Error('Question not found');
  }
  
  const question = this.questions[questionIndex];
  let isCorrect = false;
  
  if (question.type === 'multiple-choice') {
    isCorrect = answer === question.correctAnswer;
  } else if (question.type === 'text') {
    // Simple text matching - in production, you'd use more sophisticated NLP
    isCorrect = answer.toLowerCase().trim() === question.correctAnswer.toLowerCase().trim();
  }
  
  // Remove existing answer for this question if any
  this.answers = this.answers.filter(a => a.questionId.toString() !== questionId);
  
  // Add new answer
  this.answers.push({
    questionId,
    answer,
    isCorrect,
    timeSpent,
    submittedAt: new Date(),
    aiAnalysis
  });
  
  return this.save();
};

// Submit code with AI analysis
interviewSchema.methods.submitCode = async function(questionId, code, language, testResults, aiAnalysis = null) {
  // Remove existing code submission for this question if any
  this.codeSubmissions = this.codeSubmissions.filter(c => c.questionId.toString() !== questionId);
  
  // Add new code submission
  this.codeSubmissions.push({
    questionId,
    code,
    language,
    testResults,
    submittedAt: new Date(),
    aiAnalysis
  });
  
  return this.save();
};

// Complete interview
interviewSchema.methods.completeInterview = function() {
  this.status = 'completed';
  this.completedAt = new Date();
  return this.save();
};

// Get performance summary
interviewSchema.methods.getPerformanceSummary = function() {
  const totalQuestions = this.questions.length;
  const answeredQuestions = this.answers.length;
  const correctAnswers = this.answers.filter(a => a.isCorrect).length;
  const totalTimeSpent = this.answers.reduce((sum, a) => sum + (a.timeSpent || 0), 0);
  
  return {
    totalQuestions,
    answeredQuestions,
    correctAnswers,
    accuracy: answeredQuestions > 0 ? Math.round((correctAnswers / answeredQuestions) * 100) : 0,
    averageTimePerQuestion: answeredQuestions > 0 ? Math.round(totalTimeSpent / answeredQuestions) : 0,
    totalTimeSpent
  };
};

module.exports = mongoose.model('Interview', interviewSchema);
