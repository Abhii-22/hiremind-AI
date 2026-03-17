require('dotenv').config();
const axios = require('axios');

// Test Hugging Face Free API
const HUGGINGFACE_API_URL = "https://api-inference.huggingface.co/models/microsoft/DialoGPT-medium";

async function testHuggingFace() {
  try {
    console.log('Testing Hugging Face AI (Free)...');
    
    const prompt = "Generate 3 interview questions for a Frontend Developer.";
    
    console.log('Sending request to Hugging Face...');
    const response = await axios.post(HUGGINGFACE_API_URL, {
      inputs: prompt
    }, {
      headers: {
        'Content-Type': 'application/json',
      }
    });

    if (response.data && response.data.length > 0) {
      const generatedText = response.data[0].generated_text;
      console.log('✅ Hugging Face Success!');
      console.log('Generated content:', generatedText);
    } else {
      console.log('❌ No response from Hugging Face');
    }
    
  } catch (error) {
    console.error('❌ Hugging Face Error:', error.message);
  }
}

testHuggingFace();
