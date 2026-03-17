require('dotenv').config();
const { generateQuestions } = require('./services/aiService');

async function testSmartGenerator() {
  try {
    console.log('Testing Smart AI Question Generator...');
    
    // Test with different roles and configurations
    const testCases = [
      { role: 'Frontend Developer', experience: 'Mid-level', type: 'Technical' },
      { role: 'Backend Developer', experience: 'Senior', type: 'Behavioral' },
      { role: 'React Developer', experience: 'Entry-level', type: 'Technical' }
    ];

    for (const testCase of testCases) {
      console.log(`\n🎯 Testing: ${testCase.role} - ${testCase.experience} - ${testCase.type}`);
      
      const questions = await generateQuestions(testCase.role, testCase.experience, testCase.type);
      
      console.log(`✅ Generated ${questions.length} questions:`);
      questions.forEach((q, index) => {
        console.log(`  ${index + 1}. ${q.questionText}`);
        console.log(`     Difficulty: ${q.difficulty}, Time: ${q.timeLimit}s, Category: ${q.category}`);
      });
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testSmartGenerator();
