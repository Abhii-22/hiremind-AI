require('dotenv').config();
const OpenAI = require('openai');

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY
});

async function testOpenAI() {
  try {
    console.log('Testing OpenAI API...');
    console.log('API Key:', process.env.OPENAI_API_KEY ? 'Key exists' : 'No key found');
    
    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "user",
          content: "Say 'Hello from OpenAI!'"
        }
      ],
      max_tokens: 10
    });

    console.log('✅ Success:', response.choices[0].message.content);
  } catch (error) {
    console.error('❌ Error:', error.message);
    if (error.status === 429) {
      console.log('❌ Quota exceeded - you need to add credits to your OpenAI account');
      console.log('🔗 Go to: https://platform.openai.com/account/billing');
    }
  }
}

testOpenAI();
