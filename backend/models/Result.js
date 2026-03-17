const mongoose = require('mongoose');

const resultSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  interviewId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Interview',
    required: true
  },
  score: {
    type: Number,
    required: true,
    min: 0,
    max: 100
  },
  feedback: {
    type: String,
    maxlength: [2000, 'Feedback cannot exceed 2000 characters']
  },
  weakAreas: [{
    type: String,
    trim: true
  }],
  strengths: [{
    type: String,
    trim: true
  }],
  improvements: [{
    type: String,
    trim: true
  }],
  recommendations: [{
    type: String,
    trim: true
  }],
  categoryScores: {
    'Technical Skills': {
      type: Number,
      min: 0,
      max: 100
    },
    'Problem Solving': {
      type: Number,
      min: 0,
      max: 100
    },
    'Communication': {
      type: Number,
      min: 0,
      max: 100
    },
    'Code Quality': {
      type: Number,
      min: 0,
      max: 100
    }
  },
  questionResults: [{
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
      enum: ['multiple-choice', 'text', 'coding'],
      required: true
    },
    userAnswer: mongoose.Schema.Types.Mixed,
    correctAnswer: mongoose.Schema.Types.Mixed,
    isCorrect: Boolean,
    score: {
      type: Number,
      min: 0,
      max: 100
    },
    timeSpent: Number,
    feedback: String,
    aiAnalysis: {
      communication: Number,
      technical: Number,
      confidence: Number,
      detailedFeedback: String
    },
    submittedAt: Date
  }],
  performanceMetrics: {
    totalQuestions: {
      type: Number,
      required: true
    },
    correctAnswers: {
      type: Number,
      required: true
    },
    accuracy: {
      type: Number,
      min: 0,
      max: 100
    },
    averageTimePerQuestion: Number,
    totalTimeSpent: Number,
    difficultyBreakdown: {
      Easy: {
        total: Number,
        correct: Number,
        score: Number
      },
      Medium: {
        total: Number,
        correct: Number,
        score: Number
      },
      Hard: {
        total: Number,
        correct: Number,
        score: Number
      }
    }
  },
  aiAnalysis: {
    communicationScore: Number,
    technicalAccuracy: Number,
    problemSolvingApproach: String,
    codeQualityMetrics: {
      readability: Number,
      efficiency: Number,
      bestPractices: Number
    },
    behavioralInsights: [String],
    overallFeedback: String
  },
  status: {
    type: String,
    enum: ['pending', 'processing', 'completed'],
    default: 'pending'
  },
  processedAt: Date,
  sharedWith: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    sharedAt: {
      type: Date,
      default: Date.now
    }
  }],
  isPublic: {
    type: Boolean,
    default: false
  },
  tags: [{
    type: String,
    trim: true
  }]
}, {
  timestamps: true
});

// Calculate performance metrics
resultSchema.methods.calculateMetrics = function() {
  const totalQuestions = this.questionResults.length;
  const correctAnswers = this.questionResults.filter(qr => qr.isCorrect).length;
  const totalTimeSpent = this.questionResults.reduce((sum, qr) => sum + (qr.timeSpent || 0), 0);
  
  this.performanceMetrics = {
    totalQuestions,
    correctAnswers,
    accuracy: totalQuestions > 0 ? Math.round((correctAnswers / totalQuestions) * 100) : 0,
    averageTimePerQuestion: totalQuestions > 0 ? Math.round(totalTimeSpent / totalQuestions) : 0,
    totalTimeSpent,
    difficultyBreakdown: {
      Easy: { total: 0, correct: 0, score: 0 },
      Medium: { total: 0, correct: 0, score: 0 },
      Hard: { total: 0, correct: 0, score: 0 }
    }
  };
  
  // Calculate difficulty breakdown
  this.questionResults.forEach(qr => {
    const question = qr;
    const difficulty = question.difficulty || 'Medium';
    
    if (this.performanceMetrics.difficultyBreakdown[difficulty]) {
      this.performanceMetrics.difficultyBreakdown[difficulty].total++;
      if (qr.isCorrect) {
        this.performanceMetrics.difficultyBreakdown[difficulty].correct++;
      }
      this.performanceMetrics.difficultyBreakdown[difficulty].score += qr.score || 0;
    }
  });
  
  // Calculate average scores for each difficulty
  Object.keys(this.performanceMetrics.difficultyBreakdown).forEach(difficulty => {
    const breakdown = this.performanceMetrics.difficultyBreakdown[difficulty];
    if (breakdown.total > 0) {
      breakdown.score = Math.round(breakdown.score / breakdown.total);
    }
  });
};

// Generate feedback based on performance
resultSchema.methods.generateFeedback = function() {
  const strengths = [];
  const improvements = [];
  const recommendations = [];
  
  const accuracy = this.performanceMetrics.accuracy;
  const overallScore = this.score;
  
  // Generate strengths
  if (accuracy >= 80) {
    strengths.push('Strong technical knowledge and accuracy');
  }
  if (overallScore >= 85) {
    strengths.push('Excellent overall performance');
  }
  if (this.categoryScores['Problem Solving'] >= 80) {
    strengths.push('Good problem-solving skills');
  }
  if (this.categoryScores['Code Quality'] >= 80) {
    strengths.push('Clean and efficient code');
  }
  
  // Generate improvements
  if (accuracy < 60) {
    improvements.push('Focus on improving technical accuracy');
  }
  if (this.categoryScores['Communication'] < 70) {
    improvements.push('Work on communication clarity');
  }
  if (this.performanceMetrics.averageTimePerQuestion > 300) {
    improvements.push('Practice time management during interviews');
  }
  
  // Generate recommendations
  if (overallScore < 70) {
    recommendations.push('Review fundamental concepts and practice more problems');
  }
  if (this.performanceMetrics.difficultyBreakdown.Hard.score < 60) {
    recommendations.push('Focus on practicing harder problems');
  }
  recommendations.push('Continue practicing to maintain consistency');
  
  this.strengths = strengths;
  this.improvements = improvements;
  this.recommendations = recommendations;
  
  // Update weakAreas based on performance
  this.weakAreas = improvements;
};

// Get performance summary
resultSchema.methods.getPerformanceSummary = function() {
  return {
    overallScore: this.score,
    accuracy: this.performanceMetrics.accuracy,
    totalQuestions: this.performanceMetrics.totalQuestions,
    correctAnswers: this.performanceMetrics.correctAnswers,
    timeSpent: this.performanceMetrics.totalTimeSpent,
    grade: this.score >= 90 ? 'A' : 
           this.score >= 80 ? 'B' : 
           this.score >= 70 ? 'C' : 
           this.score >= 60 ? 'D' : 'F'
  };
};

module.exports = mongoose.model('Result', resultSchema);
