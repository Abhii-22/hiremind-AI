const mongoose = require('mongoose');

async function generateAnswer(question, role, experience, type) {
  console.log('🤖 generateAnswer called with:', { question, role, experience, type });
  
  try {
    // Use real Gemini AI for dynamic answer generation
    console.log('✅ Using Gemini AI Answer Generator');
    const result = await generateWithGeminiAnswer(question, role, experience, type);
    console.log('🤖 Gemini AI returned answer');
    return result;
  } catch (error) {
    console.log('❌ Gemini AI failed for answer, using fallback...', error.message);
    const fallback = generateFallbackAnswer(question, role, experience, type);
    console.log('🔄 Using fallback answer');
    return fallback;
  }
}

async function generateWithGeminiAnswer(question, role, experience, type) {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `Generate a professional and comprehensive answer for the following interview question.

Question: "${question}"
Role: ${role}
Experience Level: ${experience}
Interview Type: ${type}

Requirements:
- Provide a detailed, professional answer
- Include specific examples and best practices
- Make it appropriate for a ${experience} ${role} position
- Answer should be 2-4 paragraphs long
- Include technical details relevant to the role
- Demonstrate expertise and confidence
- Format as plain text (no JSON, no markdown)

Generate the answer now:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('🔍 Gemini AI Answer Response:', text.substring(0, 100) + '...');

    // Clean the response - remove any markdown formatting
    let cleanAnswer = text.trim();
    if (cleanAnswer.startsWith('```')) {
      cleanAnswer = cleanAnswer.replace(/```\w*\s*/, '').replace(/```\s*$/, '');
    }

    return {
      answer: cleanAnswer,
      aiGenerated: true,
      role: role,
      experience: experience,
      type: type
    };

  } catch (error) {
    console.log('❌ Gemini AI answer failed completely, using fallback:', error.message);
    return generateFallbackAnswer(question, role, experience, type);
  }
}

function generateFallbackAnswer(question, role, experience, type) {
  return {
    answer: `As a ${experience.toLowerCase()} ${role}, I would approach this question by first understanding the core requirements and then applying best practices and industry standards. For this specific question about ${role}, I would leverage my experience with relevant technologies and methodologies to provide a comprehensive solution that meets the needs of the project while maintaining code quality and performance standards.`,
    aiGenerated: false,
    role: role,
    experience: experience,
    type: type
  };
}

async function evaluateAnswer(question, userAnswer, role, experience, type) {
  console.log('🔍 evaluateAnswer called with:', { question, userAnswer, role, experience, type });
  
  try {
    // Use real Gemini AI for answer evaluation
    console.log('✅ Using Gemini AI Answer Evaluator');
    const result = await evaluateWithGemini(question, userAnswer, role, experience, type);
    console.log('🤖 Gemini AI returned evaluation');
    return result;
  } catch (error) {
    console.log('❌ Gemini AI failed for evaluation, using fallback...', error.message);
    const fallback = evaluateFallbackAnswer(question, userAnswer, role, experience, type);
    console.log('🔄 Using fallback evaluation');
    return fallback;
  }
}

async function evaluateWithGemini(question, userAnswer, role, experience, type) {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `Evaluate the following interview answer for a ${experience} ${role} position.

Question: "${question}"
User's Answer: "${userAnswer}"
Interview Type: ${type}

Requirements:
- Evaluate if the answer is relevant to the question
- Check for technical accuracy and correctness
- Assess the quality and completeness of the answer
- Look for random content, gibberish, or irrelevant answers
- Consider the experience level (${experience}) in your evaluation
- Rate the answer from 1-10 (where 10 is excellent)
- Provide specific feedback

Return the evaluation as JSON with this exact format:
{
  "score": number between 1-10,
  "isRelevant": boolean,
  "isCorrect": boolean,
  "quality": "Excellent|Good|Average|Poor|Very Poor",
  "feedback": "detailed feedback about the answer",
  "suggestions": "specific suggestions for improvement",
  "isRandomContent": boolean
}

Evaluate the answer now:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('🔍 Gemini AI Evaluation Response:', text.substring(0, 100) + '...');

    // Clean the response - remove any markdown formatting
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```\s*/, '').replace(/```\s*$/, '');
    }

    // Parse the JSON response
    let evaluation;
    try {
      evaluation = JSON.parse(cleanText);
      console.log('✅ Successfully parsed evaluation');
    } catch (parseError) {
      console.log('❌ JSON parse failed, using fallback evaluation:', parseError.message);
      return evaluateFallbackAnswer(question, userAnswer, role, experience, type);
    }

    // Ensure all required fields are present
    return {
      score: evaluation.score || 5,
      isRelevant: evaluation.isRelevant !== undefined ? evaluation.isRelevant : true,
      isCorrect: evaluation.isCorrect !== undefined ? evaluation.isCorrect : true,
      quality: evaluation.quality || 'Average',
      feedback: evaluation.feedback || 'Answer submitted successfully.',
      suggestions: evaluation.suggestions || 'Consider providing more specific examples.',
      isRandomContent: evaluation.isRandomContent !== undefined ? evaluation.isRandomContent : false
    };

  } catch (error) {
    console.log('❌ Gemini AI evaluation failed completely, using fallback:', error.message);
    return evaluateFallbackAnswer(question, userAnswer, role, experience, type);
  }
}

function evaluateFallbackAnswer(question, userAnswer, role, experience, type) {
  // Simple fallback evaluation logic
  const answerLength = userAnswer.trim().length;
  const hasRelevantKeywords = userAnswer.toLowerCase().includes(role.toLowerCase()) || 
                             userAnswer.toLowerCase().includes('experience') ||
                             userAnswer.toLowerCase().includes('skill');
  
  const isRandomContent = answerLength < 10 || 
                         (!hasRelevantKeywords && answerLength < 50);
  
  const score = isRandomContent ? 2 : (hasRelevantKeywords ? 6 : 4);
  
  return {
    score: score,
    isRelevant: !isRandomContent,
    isCorrect: !isRandomContent && hasRelevantKeywords,
    quality: isRandomContent ? 'Very Poor' : (hasRelevantKeywords ? 'Average' : 'Poor'),
    feedback: isRandomContent ? 'The answer appears to be random or insufficient content.' : 
              'Answer submitted. Consider adding more specific details.',
    suggestions: isRandomContent ? 'Please provide a relevant answer to the question.' : 
                  'Try to include specific examples and technical details.',
    isRandomContent: isRandomContent
  };
}

async function generateQuestions(role, experience, type) {
  console.log('🔥 generateQuestions called with:', { role, experience, type });
  
  try {
    // Use real Gemini AI for dynamic question generation
    console.log('✅ Using Gemini AI Question Generator');
    const result = await generateSmartQuestions(role, experience, type);
    console.log('🤖 Gemini AI returned', result.length, 'questions');
    console.log('🤖 First question preview:', result[0]?.questionText?.substring(0, 50) + '...');
    return result;
  } catch (error) {
    console.log('❌ Gemini AI failed, using fallback questions...', error.message);
    const fallback = getRoleSpecificMockQuestions(role, experience, type);
    console.log('🔄 Using fallback questions, count:', fallback.length);
    return fallback;
  }
}

async function generateSmartQuestions(role, experience, type) {
  // Use real Gemini AI for dynamic question generation
  return await generateWithGemini(role, experience, type);
}

async function generateWithGemini(role, experience, type) {
  try {
    const { GoogleGenerativeAI } = require('@google/generative-ai');
    const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: 'gemini-flash-latest' });

    const prompt = `Generate 10 unique interview questions for a ${experience} ${role} position for a ${type} interview.

Requirements:
- Generate exactly 10 different questions
- Questions should be professional and relevant to the role
- For Technical interview: focus on technical skills, problem-solving, and industry knowledge
- For Behavioral interview: focus on behavioral scenarios, team collaboration, and soft skills
- Make questions specific to ${experience} level
- Each question should be complete and ready to ask
- Return ONLY a JSON array of strings, no additional text

Example format:
["What is your experience with React hooks?", "How do you optimize React app performance?", "Describe a time you solved a complex frontend bug"]

Generate questions now:`;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    const text = response.text();

    console.log('🔍 Raw Gemini Response:', text);
    console.log('🔍 Response length:', text.length);

    // Clean the response - remove any markdown formatting
    let cleanText = text.trim();
    if (cleanText.startsWith('```json')) {
      cleanText = cleanText.replace(/```json\s*/, '').replace(/```\s*$/, '');
    } else if (cleanText.startsWith('```')) {
      cleanText = cleanText.replace(/```\s*/, '').replace(/```\s*$/, '');
    }

    console.log('🔍 Cleaned response:', cleanText);

    // Parse the JSON response
    let questions = [];
    try {
      questions = JSON.parse(cleanText);
      console.log('✅ Successfully parsed', questions.length, 'questions');
    } catch (parseError) {
      console.log('❌ JSON parse failed, trying regex extraction:', parseError.message);
      
      // Fallback: try to extract JSON array using regex
      const jsonMatch = cleanText.match(/\[[\s\S]*\]/);
      if (jsonMatch) {
        try {
          questions = JSON.parse(jsonMatch[0]);
          console.log('✅ Regex extraction successful, got', questions.length, 'questions');
        } catch (regexError) {
          console.log('❌ Regex extraction also failed:', regexError.message);
        }
      }
    }

    // If still no valid questions, use dynamic fallback
    if (questions.length < 10) {
      console.log('🔄 Using dynamic fallback questions');
      questions = generateDynamicQuestions(role, experience, type);
    }

    // Format questions with proper structure
    return questions.slice(0, 10).map((question, index) => ({
      questionId: new mongoose.Types.ObjectId(),
      questionText: question,
      type: "text",
      difficulty: getDifficultyFromExperience(experience),
      category: role,
      timeLimit: getTimeLimitFromType(type),
      options: [],
      correctAnswer: "",
      aiGenerated: true
    }));

  } catch (error) {
    console.log('❌ Gemini AI failed completely, using fallback:', error.message);
    return generateDynamicQuestions(role, experience, type);
  }
}

function generateDynamicQuestions(role, experience, type) {
  // Generate dynamic questions based on role, experience, and type
  const baseQuestions = {
    'Technical': [
      `What technical skills are essential for a ${experience.toLowerCase()} ${role} position?`,
      `How do you approach problem-solving as a ${experience.toLowerCase()} ${role}?`,
      `What tools and technologies do you use for ${role} development at the ${experience.toLowerCase()} level?`,
      `Describe your experience with relevant technologies for ${experience.toLowerCase()} ${role} positions.`,
      `How do you ensure code quality in your ${role} projects as a ${experience.toLowerCase()} developer?`,
      `What design patterns do you commonly use in ${role} development?`,
      `How do you handle testing in your ${role} projects?`,
      `What are your strategies for debugging ${role} applications?`,
      `How do you approach documentation in ${role} development?`,
      `What performance optimization techniques do you use for ${role} projects?`
    ],
    'Behavioral': [
      `Tell me about your experience as a ${experience.toLowerCase()} ${role}.`,
      `Describe a challenging project you worked on as a ${experience.toLowerCase()} ${role}.`,
      `How do you handle tight deadlines and pressure as a ${experience.toLowerCase()} ${role}?`,
      `Why are you interested in this ${role} position as a ${experience.toLowerCase()} professional?`,
      `Where do you see yourself as a ${experience.toLowerCase()} ${role} in 5 years?`,
      `How do you handle conflicts with team members as a ${experience.toLowerCase()} ${role}?`,
      `Describe a time you had to learn a new technology quickly as a ${experience.toLowerCase()} ${role}.`,
      `How do you approach mentoring others as a ${experience.toLowerCase()} ${role}?`,
      `What are your career goals as a ${experience.toLowerCase()} ${role}?`,
      `How do you handle feedback on your work as a ${experience.toLowerCase()} ${role}?`
    ]
  };

  return baseQuestions[type] || baseQuestions['Technical'];
}

function getDifficultyFromExperience(experience) {
  const difficultyMap = {
    'Entry-level': 'Easy',
    'Mid-level': 'Medium',
    'Senior': 'Hard',
    'Lead/Principal': 'Hard'
  };
  return difficultyMap[experience] || 'Medium';
}

function getTimeLimitFromType(type) {
  const timeMap = {
    'Technical': 90,
    'Behavioral': 120,
    'System Design': 180,
    'Coding Challenge': 300,
    'HR Interview': 60,
    'Mixed': 90
  };
  return timeMap[type] || 90;
}

async function generateWithOpenAI(role, experience, type) {
  const OpenAI = require("openai");
  const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
  });

  const prompt = `Generate 10 interview questions for a ${role} position with ${experience} experience level for a ${type} interview. 

Return the questions as a JSON array of objects with the following structure:
[
  {
    "questionText": "The actual question",
    "type": "text",
    "difficulty": "Medium",
    "category": "General",
    "timeLimit": 60,
    "options": [],
    "correctAnswer": ""
  }
]

Make sure questions are specific to the ${role} role and ${experience} level. For technical interviews, focus on relevant technologies and concepts. For behavioral interviews, focus on situational and experiential questions.`;

  const response = await openai.chat.completions.create({
    model: "gpt-4o-mini",
    messages: [
      {
        role: "system",
        content: "You are an expert interview question generator. Always return valid JSON format with the specified structure."
      },
      {
        role: "user",
        content: prompt
      }
    ],
    temperature: 0.7,
    max_tokens: 800
  });

  const content = response.choices[0].message.content;
  
  try {
    const parsedQuestions = JSON.parse(content);
    
    return parsedQuestions.map((q, index) => ({
      questionId: new mongoose.Types.ObjectId(),
      questionText: q.questionText || `Question ${index + 1}`,
      type: q.type || "text",
      difficulty: q.difficulty || "Medium",
      category: q.category || role,
      timeLimit: q.timeLimit || 60,
      options: q.options || [],
      correctAnswer: q.correctAnswer || "",
      aiGenerated: true
    }));
  } catch {
    return getRoleSpecificMockQuestions(role, experience, type);
  }
}

function getRoleSpecificMockQuestions(role, experience, type) {
  const questionBank = {
    'Frontend Developer': {
      'Technical': [
        "Explain the concept of the virtual DOM in React and how it improves performance.",
        "What are the key differences between controlled and uncontrolled components in React?",
        "How do you optimize the performance of a React application?",
        "Describe the CSS Box Model and how it affects layout.",
        "What is the purpose of useCallback and useMemo hooks in React?"
      ],
      'Behavioral': [
        "Describe a challenging frontend bug you encountered and how you debugged it.",
        "How do you stay updated with the latest frontend technologies and trends?",
        "Tell me about a time you had to optimize a slow-loading web application.",
        "How do you approach cross-browser compatibility issues?",
        "Describe a situation where you had to collaborate with designers and backend developers."
      ]
    },
    'Backend Developer': {
      'Technical': [
        "Explain the concept of RESTful API design and best practices.",
        "What are the key differences between SQL and NoSQL databases?",
        "How do you handle authentication and authorization in a Node.js application?",
        "Describe the event loop in Node.js and how it works.",
        "What is database indexing and how does it improve query performance?"
      ],
      'Behavioral': [
        "Describe a challenging scaling problem you solved in a backend system.",
        "How do you approach database schema design for a new application?",
        "Tell me about a time you had to optimize database queries.",
        "How do you ensure the security of your backend APIs?",
        "Describe a situation where you had to handle a production outage."
      ]
    },
    'Full Stack Developer': {
      'Technical': [
        "How do you approach designing a full-stack application architecture?",
        "Explain the concept of microservices and when you would use them.",
        "What are the key considerations when integrating frontend and backend systems?",
        "How do you handle state management in a full-stack application?",
        "Describe the process of deploying a full-stack application to production."
      ],
      'Behavioral': [
        "Describe a full-stack project you're most proud of and your role in it.",
        "How do you balance frontend and backend development priorities?",
        "Tell me about a time you had to make architectural decisions.",
        "How do you approach learning new technologies across the stack?",
        "Describe a situation where you had to work on both frontend and backend components."
      ]
    },
    'React Developer': {
      'Technical': [
        "Explain React's component lifecycle and how hooks have changed it.",
        "What are the different ways to manage state in a React application?",
        "How do you implement code splitting and lazy loading in React?",
        "Describe the Context API and when you should use it.",
        "What are React Server Components and how do they differ from client components?"
      ],
      'Behavioral': [
        "Describe a complex React component you built and the challenges you faced.",
        "How do you approach testing React applications?",
        "Tell me about a time you had to optimize a React application's performance.",
        "How do you structure large React applications?",
        "Describe a situation where you had to migrate from class components to hooks."
      ]
    },
    'Node.js Developer': {
      'Technical': [
        "Explain the event-driven architecture in Node.js with examples.",
        "What are streams in Node.js and when would you use them?",
        "How do you handle memory leaks in Node.js applications?",
        "Describe the middleware pattern in Express.js.",
        "What is the purpose of the cluster module in Node.js?"
      ],
      'Behavioral': [
        "Describe a scalable Node.js application you built.",
        "How do you approach error handling in Node.js applications?",
        "Tell me about a time you had to optimize a Node.js application.",
        "How do you ensure the security of your Node.js applications?",
        "Describe a situation where you had to debug a complex Node.js issue."
      ]
    }
  };

  // Get questions for the role, or use generic questions if role not found
  const roleQuestions = questionBank[role] || {
    'Technical': [
      `What are the key technical skills required for a ${role} position?`,
      `How do you approach problem-solving in ${role} development?`,
      `What tools and technologies do you use for ${role} work?`,
      `Describe your experience with relevant technologies for ${role}.`,
      `How do you ensure code quality in your ${role} projects?`
    ],
    'Behavioral': [
      "Tell me about yourself and your experience.",
      "Describe a challenging project you worked on.",
      "How do you handle tight deadlines and pressure?",
      "Why are you interested in this role and company?",
      "Where do you see yourself in 5 years?"
    ]
  };

  // Get questions for the interview type, or default to behavioral
  const typeQuestions = roleQuestions[type] || roleQuestions['Behavioral'] || roleQuestions['Technical'];

  return typeQuestions.slice(0, 10).map((question, index) => ({
    questionId: new mongoose.Types.ObjectId(),
    questionText: question,
    type: "text",
    difficulty: experience === 'Entry-level' ? 'Easy' : experience === 'Senior' || experience === 'Lead/Principal' ? 'Hard' : 'Medium',
    category: role,
    timeLimit: 60,
    options: [],
    correctAnswer: "",
    aiGenerated: true
  }));
}

async function analyzeAnswer(question, answer, role) {
  try {
    const prompt = `Analyze this interview answer for a ${role} position:

Question: "${question}"
Answer: "${answer}"

Provide feedback in JSON format with:
{
  "score": number between 1-10,
  "communication": number between 1-10,
  "technical": number between 1-10,
  "confidence": number between 1-10,
  "feedback": "detailed feedback",
  "followup": "suggested follow-up question"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert interview evaluator. Always return valid JSON format with scores from 1-10."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 300
    });

    const content = response.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch {
      // Fallback analysis
      return {
        score: 7,
        communication: 7,
        technical: 7,
        confidence: 7,
        feedback: "Good answer. Consider providing more specific examples.",
        followup: "Can you elaborate on your experience with this?"
      };
    }
  } catch (error) {
    console.error('Error analyzing answer:', error);
    return {
      score: 5,
      communication: 5,
      technical: 5,
      confidence: 5,
      feedback: "Unable to analyze answer at the moment.",
      followup: "Could you provide more details?"
    };
  }
}

async function generateFollowUp(originalQuestion, userAnswer, previousQuestions) {
  try {
    const prompt = `Based on this exchange, generate a relevant follow-up question:

Original Question: "${originalQuestion}"
User's Answer: "${userAnswer}"
Previous Questions: ${previousQuestions.join(', ')}

Generate a follow-up question that digs deeper into their answer. Return just the question as a string.`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert interviewer. Generate relevant follow-up questions."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 100
    });

    return response.choices[0].message.content.trim();
  } catch (error) {
    console.error('Error generating follow-up:', error);
    return "Can you provide more specific examples?";
  }
}

async function analyzeCode(code, problem, language) {
  try {
    const prompt = `Analyze this code solution for the following problem:

Problem: ${problem}
Language: ${language}
Code: 
\`\`\`${language}
${code}
\`\`\`

Provide analysis in JSON format:
{
  "correctness": number between 1-10,
  "efficiency": number between 1-10,
  "readability": number between 1-10,
  "feedback": "detailed feedback",
  "suggestions": "improvement suggestions",
  "timeComplexity": "time complexity analysis",
  "spaceComplexity": "space complexity analysis"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert code reviewer. Always return valid JSON format with scores from 1-10."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.2,
      max_tokens: 400
    });

    const content = response.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch {
      return {
        correctness: 6,
        efficiency: 6,
        readability: 6,
        feedback: "Code looks functional but could be optimized.",
        suggestions: "Consider edge cases and improve variable naming.",
        timeComplexity: "O(n)",
        spaceComplexity: "O(1)"
      };
    }
  } catch (error) {
    console.error('Error analyzing code:', error);
    return {
      correctness: 5,
      efficiency: 5,
      readability: 5,
      feedback: "Unable to analyze code at the moment.",
      suggestions: "Review your solution for potential issues.",
      timeComplexity: "Unknown",
      spaceComplexity: "Unknown"
    };
  }
}

async function extractSkillsFromResume(resumeText) {
  try {
    const prompt = `Extract technical skills from this resume text. Return as JSON array of skill names:

Resume: "${resumeText}"

Focus on programming languages, frameworks, tools, and technical skills. Return JSON array like ["React", "Node.js", "Python"]`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert resume analyzer. Extract technical skills and return as JSON array."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.3,
      max_tokens: 200
    });

    const content = response.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch {
      // Fallback: extract common skills
      const commonSkills = ['JavaScript', 'React', 'Node.js', 'Python', 'Java', 'HTML', 'CSS'];
      return commonSkills.filter(skill => resumeText.toLowerCase().includes(skill.toLowerCase()));
    }
  } catch (error) {
    console.error('Error extracting skills:', error);
    return [];
  }
}

async function generatePracticeRecommendations(userHistory, targetRole) {
  try {
    const prompt = `Based on this interview history, provide practice recommendations for a ${targetRole} role:

History: ${JSON.stringify(userHistory)}

Provide recommendations in JSON format:
{
  "weakAreas": ["area1", "area2"],
  "strongAreas": ["area1", "area2"],
  "recommendedTopics": ["topic1", "topic2"],
  "studyPlan": "detailed study plan",
  "estimatedImprovement": "time to see improvement"
}`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        {
          role: "system",
          content: "You are an expert career coach. Provide actionable recommendations in JSON format."
        },
        {
          role: "user",
          content: prompt
        }
      ],
      temperature: 0.7,
      max_tokens: 400
    });

    const content = response.choices[0].message.content;
    
    try {
      return JSON.parse(content);
    } catch {
      return {
        weakAreas: ["Technical skills", "Communication"],
        strongAreas: ["Problem solving"],
        recommendedTopics: ["Data structures", "System design"],
        studyPlan: "Practice 2-3 interviews per week focusing on weak areas.",
        estimatedImprovement: "4-6 weeks"
      };
    }
  } catch (error) {
    console.error('Error generating recommendations:', error);
    return {
      weakAreas: ["Technical skills"],
      strongAreas: ["Problem solving"],
      recommendedTopics: ["Practice more"],
      studyPlan: "Continue practicing regularly.",
      estimatedImprovement: "6-8 weeks"
    };
  }
}

module.exports = {
  generateQuestions,
  generateAnswer,
  evaluateAnswer,
  analyzeAnswer,
  generateFollowUp,
  analyzeCode,
  extractSkillsFromResume,
  generatePracticeRecommendations
};
