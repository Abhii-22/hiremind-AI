require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testCorrectModel() {
  try {
    console.log('🔑 Testing with correct model: gemini-2.5-flash');
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-2.5-flash' });
    
    const prompt = `Generate exactly 3 interview questions for a Mid-level Frontend Developer. 
Return ONLY a JSON array of strings, no other text.
Example: ["question1", "question2", "question3"]`;

    console.log('📤 Sending request...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();
    
    console.log('📥 Raw Response:');
    console.log('---');
    console.log(text);
    console.log('---');
    
    // Try to parse
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```\s*/, '').replace(/```\s*$/, '');
    }
    
    try {
      const parsed = JSON.parse(cleanText);
      console.log('✅ Success! Parsed questions:', parsed);
    } catch (e) {
      console.log('❌ Parse failed:', e.message);
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testCorrectModel();
