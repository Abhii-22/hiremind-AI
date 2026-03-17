require('dotenv').config();
const { generateQuestions } = require('./services/aiService');

async function test10Questions() {
  try {
    console.log('Testing 10 AI Question Generation...');
    
    const questions = await generateQuestions('Frontend Developer', 'Mid-level', 'Technical');
    
    console.log(`✅ Generated ${questions.length} questions:`);
    questions.forEach((q, index) => {
      console.log(`  ${index + 1}. ${q.questionText}`);
      console.log(`     Difficulty: ${q.difficulty}, Time: ${q.timeLimit}s, Category: ${q.category}`);
    });
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

test10Questions();
