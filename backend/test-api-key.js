require('dotenv').config();
const { GoogleGenerativeAI } = require("@google/generative-ai");

async function testAPI() {
  try {
    console.log('API Key:', process.env.GEMINI_API_KEY ? 'Key exists' : 'No key found');
    console.log('API Key length:', process.env.GEMINI_API_KEY?.length);
    
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    
    // Try the format that works with newer versions
    try {
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
      const result = await model.generateContent("Hello");
      const response = await result.response;
      console.log('✅ Success with gemini-1.5-flash:', response.text());
    } catch (error) {
      console.log('❌ gemini-1.5-flash failed:', error.message);
    }
    
    // Try alternative approach with different API version
    try {
      // Some versions use different model names
      const model = genAI.getGenerativeModel({ model: "gemini-1.5-flash-latest" });
      const result = await model.generateContent("Hello");
      const response = await result.response;
      console.log('✅ Success with gemini-1.5-flash-latest:', response.text());
    } catch (error) {
      console.log('❌ gemini-1.5-flash-latest failed:', error.message);
    }
    
  } catch (error) {
    console.error('API Error:', error);
  }
}

testAPI();
