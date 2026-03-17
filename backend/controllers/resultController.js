const Result = require('../models/Result');
const Interview = require('../models/Interview');

// @desc    Get all user results
// @route   GET /api/results
// @access  Private
exports.getUserResults = async (req, res) => {
  try {
    const { page = 1, limit = 10, status } = req.query;
    
    const query = { userId: req.user.id };
    if (status) query.status = status;

    const results = await Result.find(query)
      .populate('interviewId', 'jobRole company difficulty type')
      .limit(limit * 1)
      .skip((page - 1) * limit)
      .sort({ createdAt: -1 });

    const total = await Result.countDocuments(query);

    res.status(200).json({
      success: true,
      data: results,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Get user results error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching results'
    });
  }
};

// @desc    Get result by ID
// @route   GET /api/results/:id
// @access  Private
exports.getResultById = async (req, res) => {
  try {
    const result = await Result.findOne({
      _id: req.params.id,
      userId: req.user.id
    })
    .populate('interviewId', 'jobRole company difficulty type questions');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    console.error('Get result by ID error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching result'
    });
  }
};

// @desc    Share result
// @route   POST /api/results/:id/share
// @access  Private
exports.shareResult = async (req, res) => {
  try {
    const { shareWith } = req.body; // Array of user IDs or email addresses

    const result = await Result.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    // Add users to sharedWith array
    if (shareWith && Array.isArray(shareWith)) {
      shareWith.forEach(userId => {
        if (!result.sharedWith.some(shared => shared.user.toString() === userId)) {
          result.sharedWith.push({ user: userId });
        }
      });
    }

    await result.save();

    res.status(200).json({
      success: true,
      message: 'Result shared successfully',
      data: result
    });
  } catch (error) {
    console.error('Share result error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error sharing result'
    });
  }
};

// @desc    Delete result
// @route   DELETE /api/results/:id
// @access  Private
exports.deleteResult = async (req, res) => {
  try {
    const result = await Result.findOne({
      _id: req.params.id,
      userId: req.user.id
    });

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    await result.deleteOne();

    res.status(200).json({
      success: true,
      message: 'Result deleted successfully'
    });
  } catch (error) {
    console.error('Delete result error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error deleting result'
    });
  }
};

// @desc    Get result analytics overview
// @route   GET /api/results/analytics/overview
// @access  Private
exports.getResultAnalytics = async (req, res) => {
  try {
    const userId = req.user.id;

    const results = await Result.find({ userId: userId, status: 'completed' });
    
    const totalResults = results.length;
    const averageScore = totalResults > 0 
      ? Math.round(results.reduce((sum, r) => sum + r.score, 0) / totalResults)
      : 0;

    const categoryAverages = {
      'Technical Skills': 0,
      'Problem Solving': 0,
      'Communication': 0,
      'Code Quality': 0
    };

    results.forEach(result => {
      Object.keys(categoryAverages).forEach(category => {
        if (result.categoryScores[category]) {
          categoryAverages[category] += result.categoryScores[category];
        }
      });
    });

    Object.keys(categoryAverages).forEach(category => {
      categoryAverages[category] = totalResults > 0 
        ? Math.round(categoryAverages[category] / totalResults)
        : 0;
    });

    const recentTrend = results.slice(-10).map(r => ({
      date: r.createdAt,
      score: r.score
    }));

    res.status(200).json({
      success: true,
      data: {
        totalResults,
        averageScore,
        categoryAverages,
        recentTrend
      }
    });
  } catch (error) {
    console.error('Get result analytics error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching analytics'
    });
  }
};

// @desc    Get progress chart data
// @route   GET /api/results/analytics/progress
// @access  Private
exports.getProgressChart = async (req, res) => {
  try {
    const { timeframe = '30d' } = req.query;
    
    let startDate = new Date();
    if (timeframe === '7d') {
      startDate.setDate(startDate.getDate() - 7);
    } else if (timeframe === '30d') {
      startDate.setDate(startDate.getDate() - 30);
    } else if (timeframe === '90d') {
      startDate.setDate(startDate.getDate() - 90);
    }

    const results = await Result.find({
      userId: req.user.id,
      status: 'completed',
      createdAt: { $gte: startDate }
    })
    .sort({ createdAt: 1 });

    const progressData = results.map(result => ({
      date: result.createdAt,
      overallScore: result.score,
      accuracy: result.performanceMetrics?.accuracy || 0
    }));

    res.status(200).json({
      success: true,
      data: progressData
    });
  } catch (error) {
    console.error('Get progress chart error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching progress data'
    });
  }
};

// @desc    Get comparison data
// @route   GET /api/results/analytics/comparison
// @access  Private
exports.getComparisonData = async (req, res) => {
  try {
    const userResults = await Result.find({ 
      userId: req.user.id, 
      status: 'completed' 
    });

    const allResults = await Result.find({ 
      status: 'completed' 
    });

    const userAverage = userResults.length > 0
      ? Math.round(userResults.reduce((sum, r) => sum + r.score, 0) / userResults.length)
      : 0;

    const globalAverage = allResults.length > 0
      ? Math.round(allResults.reduce((sum, r) => sum + r.score, 0) / allResults.length)
      : 0;

    const userPercentile = allResults.length > 0
      ? Math.round((allResults.filter(r => r.score < userAverage).length / allResults.length) * 100)
      : 50;

    res.status(200).json({
      success: true,
      data: {
        userAverage,
        globalAverage,
        userPercentile,
        totalUsers: await Result.distinct('userId').then(users => users.length)
      }
    });
  } catch (error) {
    console.error('Get comparison data error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error fetching comparison data'
    });
  }
};

// Placeholder export functions
exports.exportToPDF = async (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: 'PDF export feature coming soon'
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error exporting PDF'
    });
  }
};

exports.exportToJSON = async (req, res) => {
  try {
    const result = await Result.findOne({
      _id: req.params.id,
      userId: req.user.id
    })
    .populate('interviewId', 'jobRole company difficulty type');

    if (!result) {
      return res.status(404).json({
        success: false,
        message: 'Result not found'
      });
    }

    res.status(200).json({
      success: true,
      data: result
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Server error exporting JSON'
    });
  }
};
