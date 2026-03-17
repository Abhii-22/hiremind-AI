require('dotenv').config();

async function listModels() {
  const API_KEY = process.env.GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models?key=${API_KEY}`;
  
  try {
    console.log('Listing available models...');
    
    const response = await fetch(API_URL);
    
    if (response.ok) {
      const data = await response.json();
      console.log('✅ Available models:');
      data.models.forEach(model => {
        console.log(`- ${model.name} (supported methods: ${model.supportedGenerationMethods?.join(', ')})`);
      });
    } else {
      console.log('❌ Failed to list models:', response.status, response.statusText);
      const errorData = await response.text();
      console.log('Error details:', errorData);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

listModels();
