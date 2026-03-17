require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testGeminiDebug() {
  try {
    console.log('🔑 Testing Gemini API Key...');
    console.log('API Key exists:', !!process.env.GEMINI_API_KEY);
    console.log('API Key length:', process.env.GEMINI_API_KEY?.length);
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' });
    
    const prompt = `Generate exactly 3 interview questions for a Mid-level Frontend Developer. 
Return ONLY a JSON array of strings, no other text.
Example: ["question1", "question2", "question3"]`;

    console.log('📤 Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('📥 Raw Response:');
    console.log('---');
    console.log(text);
    console.log('---');
    console.log('Response length:', text.length);
    
    // Try different parsing approaches
    console.log('\n🔍 Testing parsing approaches...');
    
    // Approach 1: Direct parse
    try {
      const parsed = JSON.parse(text);
      console.log('✅ Direct parse successful:', parsed);
    } catch (e) {
      console.log('❌ Direct parse failed:', e.message);
    }
    
    // Approach 2: Clean markdown
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```\s*/, '').replace(/```\s*$/, '');
    }
    
    console.log('Cleaned text:', cleanText);
    
    try {
      const parsed = JSON.parse(cleanText);
      console.log('✅ Cleaned parse successful:', parsed);
    } catch (e) {
      console.log('❌ Cleaned parse failed:', e.message);
    }
    
    // Approach 3: Regex extraction
    const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
    if (jsonMatch) {
      console.log('Regex match:', jsonMatch[0]);
      try {
        const parsed = JSON.parse(jsonMatch[0]);
        console.log('✅ Regex parse successful:', parsed);
      } catch (e) {
        console.log('❌ Regex parse failed:', e.message);
      }
    } else {
      console.log('❌ No regex match found');
    }
    
  } catch (error) {
    console.error('❌ Complete failure:', error.message);
    console.error('Full error:', error);
  }
}

testGeminiDebug();
