require('dotenv').config();
const { generateQuestions } = require('./services/aiService');

async function testNewGemini() {
  try {
    console.log('Testing new Gemini AI integration...');
    
    const questions = await generateQuestions('Frontend Developer', 'Mid-level', 'Technical');
    
    console.log(`Generated ${questions.length} questions:`);
    questions.forEach((q, index) => {
      console.log(`${index + 1}. ${q.questionText}`);
    });
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testNewGemini();
