require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

// Test Gemini AI with correct API version
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

async function testGemini() {
  try {
    console.log('Testing Gemini AI...');
    console.log('API Key:', process.env.GEMINI_API_KEY ? 'Key exists' : 'No key found');
    
    // Try with v1 API version and gemini-1.5-flash
    const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    
    const prompt = "Generate 3 interview questions for a Frontend Developer. Return as JSON array.";
    
    console.log('Sending request to Gemini...');
    const result = await model.generateContent(prompt);
    const response = await result.response;
    const content = response.text();
    
    console.log('✅ Gemini Success!');
    console.log('Generated content:', content);
    
  } catch (error) {
    console.error('❌ Gemini Error:', error.message);
    
    // Try alternative model
    try {
      console.log('Trying alternative model...');
      const model2 = genAI.getGenerativeModel({ model: "gemini-1.5-pro" });
      const result2 = await model2.generateContent("Test message");
      const response2 = await result2.response;
      console.log('✅ Alternative model success:', response2.text());
    } catch (error2) {
      console.error('❌ Alternative model also failed:', error2.message);
    }
  }
}

testGemini();
