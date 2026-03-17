// Simple test to check if server can start
require('dotenv').config();

const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Test database connection
const connectDB = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/hiremind');
    console.log('✅ MongoDB Connected successfully');
    return true;
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error.message);
    return false;
  }
};

// Test basic route
app.get('/test', (req, res) => {
  res.json({ 
    success: true, 
    message: 'Server is working!',
    timestamp: new Date().toISOString()
  });
});

const startServer = async () => {
  console.log('🚀 Starting HireMind AI Backend Server...');
  
  // Test database connection
  const dbConnected = await connectDB();
  
  const PORT = process.env.PORT || 5000;
  
  app.listen(PORT, () => {
    console.log(`✅ Server running on port ${PORT}`);
    console.log(`✅ Environment: ${process.env.NODE_ENV || 'development'}`);
    console.log(`✅ Database: ${dbConnected ? 'Connected' : 'Not Connected'}`);
    console.log(`🌐 Test endpoint: http://localhost:${PORT}/test`);
    console.log('\n📋 Available endpoints:');
    console.log('   POST /api/auth/login');
    console.log('   POST /api/auth/register');
    console.log('   POST /api/interviews/generate-questions');
    console.log('   POST /api/interviews/analyze-answer');
    console.log('   POST /api/interviews/analyze-code');
    console.log('   POST /api/interviews/extract-skills');
    console.log('   POST /api/interviews/generate-recommendations');
    console.log('\n🤖 AI Features Ready!');
  });
};

// Handle graceful shutdown
process.on('SIGINT', () => {
  console.log('\n🛑 Shutting down server...');
  mongoose.connection.close(() => {
    console.log('✅ MongoDB connection closed');
    process.exit(0);
  });
});

startServer().catch(console.error);
