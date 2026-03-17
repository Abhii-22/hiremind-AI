require('dotenv').config();

async function testRestAPI() {
  const API_KEY = process.env.GEMINI_API_KEY;
  const API_URL = `https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent?key=${API_KEY}`;
  
  try {
    console.log('Testing REST API with gemini-pro...');
    
    const requestBody = {
      contents: [{
        parts: [{
          text: "Generate 3 interview questions for a frontend developer. Return as JSON array."
        }]
      }]
    };

    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody)
    });

    if (response.ok) {
      const data = await response.json();
      console.log('✅ REST API Success!');
      console.log('Response:', JSON.stringify(data, null, 2));
    } else {
      console.log('❌ REST API failed:', response.status, response.statusText);
      const errorData = await response.text();
      console.log('Error details:', errorData);
    }
    
  } catch (error) {
    console.error('Error:', error);
  }
}

testRestAPI();
