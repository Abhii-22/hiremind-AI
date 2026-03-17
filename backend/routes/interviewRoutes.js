const express = require('express');
const interviewController = require('../controllers/interviewController');
const { protect } = require('../middleware/auth');
const { 
  generateQuestions, 
  analyzeAnswer, 
  generateFollowUp, 
  analyzeCode,
  extractSkillsFromResume,
  generatePracticeRecommendations 
} = require('../services/aiService.js');

const router = express.Router();

// All routes are protected
router.use(protect);

// Interview management
router.get('/available', interviewController.getAvailableInterviews);
router.get('/:id', interviewController.getInterviewById);
router.post('/session', interviewController.createInterviewSession);
router.get('/session/:sessionId', interviewController.getInterviewSession);
router.post('/session/:sessionId/complete', interviewController.completeInterviewSession);
router.get('/session/:sessionId/results', interviewController.getInterviewResults);

// Question and answer handling
router.post('/session/:sessionId/answer', interviewController.submitAnswer);
router.post('/session/:sessionId/code', interviewController.submitCode);
router.post('/session/:sessionId/run-test', interviewController.runCodeTest);

// Interview history and statistics
router.get('/history', interviewController.getInterviewHistory);
router.get('/stats', interviewController.getInterviewStats);

// Interview actions
router.post('/:id/retry', interviewController.retryInterview);
router.get('/session/:sessionId/resume', interviewController.resumeInterview);

// Questions and problems
router.get('/questions', interviewController.getQuestionsByCategory);
router.get('/coding-problems', interviewController.getCodingProblems);

// Feedback and tips
router.post('/session/:sessionId/feedback', interviewController.saveInterviewFeedback);
router.get('/session/:sessionId/tips', interviewController.getInterviewTips);

// AI-powered endpoints
router.post("/generate-questions", async (req, res) => {
  try {
    const { role, experience, type } = req.body;
    
    console.log('🎯 /generate-questions endpoint called with:', { role, experience, type });
    
    if (!role || !experience || !type) {
      return res.status(400).json({ 
        error: "Missing required fields: role, experience, type" 
      });
    }

    const questions = await generateQuestions(role, experience, type);
    
    console.log('📤 Sending response with', questions.length, 'questions');
    
    res.json({ 
      success: true,
      questions 
    });
  } catch (error) {
    console.error('Error in generate-questions:', error);
    res.status(500).json({ 
      error: "Failed to generate questions",
      details: error.message 
    });
  }
});

router.post("/analyze-answer", async (req, res) => {
  try {
    const { question, answer, role } = req.body;
    
    if (!question || !answer || !role) {
      return res.status(400).json({ 
        error: "Missing required fields: question, answer, role" 
      });
    }

    const analysis = await analyzeAnswer(question, answer, role);
    
    res.json({ 
      success: true,
      analysis 
    });
  } catch (error) {
    console.error('Error in analyze-answer:', error);
    res.status(500).json({ 
      error: "Failed to analyze answer",
      details: error.message 
    });
  }
});

router.post("/generate-followup", async (req, res) => {
  try {
    const { originalQuestion, userAnswer, previousQuestions } = req.body;
    
    if (!originalQuestion || !userAnswer) {
      return res.status(400).json({ 
        error: "Missing required fields: originalQuestion, userAnswer" 
      });
    }

    const followUp = await generateFollowUp(
      originalQuestion, 
      userAnswer, 
      previousQuestions || []
    );
    
    res.json({ 
      success: true,
      followUp 
    });
  } catch (error) {
    console.error('Error in generate-followup:', error);
    res.status(500).json({ 
      error: "Failed to generate follow-up question",
      details: error.message 
    });
  }
});

router.post("/analyze-code", async (req, res) => {
  try {
    const { code, problem, language } = req.body;
    
    if (!code || !problem || !language) {
      return res.status(400).json({ 
        error: "Missing required fields: code, problem, language" 
      });
    }

    const analysis = await analyzeCode(code, problem, language);
    
    res.json({ 
      success: true,
      analysis 
    });
  } catch (error) {
    console.error('Error in analyze-code:', error);
    res.status(500).json({ 
      error: "Failed to analyze code",
      details: error.message 
    });
  }
});

router.post("/extract-skills", async (req, res) => {
  try {
    const { resumeText } = req.body;
    
    if (!resumeText) {
      return res.status(400).json({ 
        error: "Missing required field: resumeText" 
      });
    }

    const skills = await extractSkillsFromResume(resumeText);
    
    res.json({ 
      success: true,
      skills 
    });
  } catch (error) {
    console.error('Error in extract-skills:', error);
    res.status(500).json({ 
      error: "Failed to extract skills",
      details: error.message 
    });
  }
});

router.post("/generate-recommendations", async (req, res) => {
  try {
    const { userHistory, targetRole } = req.body;
    
    if (!userHistory || !targetRole) {
      return res.status(400).json({ 
        error: "Missing required fields: userHistory, targetRole" 
      });
    }

    const recommendations = await generatePracticeRecommendations(
      userHistory, 
      targetRole
    );
    
    res.json({ 
      success: true,
      recommendations 
    });
  } catch (error) {
    console.error('Error in generate-recommendations:', error);
    res.status(500).json({ 
      error: "Failed to generate recommendations",
      details: error.message 
    });
  }
});

router.post("/voice-to-text", async (req, res) => {
  try {
    // This would integrate with a speech-to-text service
    // For now, return a placeholder response
    res.json({ 
      success: true,
      text: "Voice-to-text feature coming soon",
      confidence: 0.95
    });
  } catch (error) {
    console.error('Error in voice-to-text:', error);
    res.status(500).json({ 
      error: "Failed to process voice",
      details: error.message 
    });
  }
});

module.exports = router;
