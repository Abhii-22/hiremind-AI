import api from './api';

class InterviewService {
  // Get all available interviews
  async getAvailableInterviews() {
    try {
      const response = await api.get('/interviews/available');
      return response;
    } catch (error) {
      throw new Error(error.data?.message || 'Failed to fetch available interviews');
    }
  }

  // Get interview by ID
  async getInterviewById(interviewId) {
    try {
      const response = await api.get(`/interviews/${interviewId}`);
      return response;
    } catch (error) {
      throw new Error(error.data?.message || 'Failed to fetch interview details');
    }
  }

  // Create new interview session
  async createInterviewSession(interviewData) {
    try {
      const response = await api.post('/interviews/session', interviewData);
      return response;
    } catch (error) {
      throw new Error(error.data?.message || 'Failed to create interview session');
    }
  }

  // Get interview session details
  async getInterviewSession(sessionId) {
    try {
      const response = await api.get(`/interviews/session/${sessionId}`);
      return response;
    } catch (error) {
      throw new Error(error.data?.message || 'Failed to fetch interview session');
    }
  }

  // Submit answer to a question
  async submitAnswer(sessionId, questionId, answer) {
    try {
      const response = await api.post(`/interviews/session/${sessionId}/answer`, {
        questionId,
        answer,
      });
      return response;
    } catch (error) {
      throw new Error(error.data?.message || 'Failed to submit answer');
    }
  }

  // Submit code for coding interview
  async submitCode(sessionId, questionId, code, language) {
    try {
      const response = await api.post(`/interviews/session/${sessionId}/code`, {
        questionId,
        code,
        language,
      });
      return response;
    } catch (error) {
      throw new Error(error.data?.message || 'Failed to submit code');
    }
  }

  // Run code test cases
  async runCodeTest(sessionId, questionId, code, language) {
    try {
      const response = await api.post(`/interviews/session/${sessionId}/run-test`, {
        questionId,
        code,
        language,
      });
      return response;
    } catch (error) {
      throw new Error(error.data?.message || 'Failed to run code tests');
    }
  }

  // Complete interview session
  async completeInterviewSession(sessionId) {
    try {
      const response = await api.post(`/interviews/session/${sessionId}/complete`);
      return response;
    } catch (error) {
      throw new Error(error.data?.message || 'Failed to complete interview');
    }
  }

  // Get interview results
  async getInterviewResults(sessionId) {
    try {
      const response = await api.get(`/interviews/session/${sessionId}/results`);
      return response;
    } catch (error) {
      throw new Error(error.data?.message || 'Failed to fetch interview results');
    }
  }

  // Get user's interview history
  async getInterviewHistory(page = 1, limit = 10) {
    try {
      const response = await api.get(`/interviews/history?page=${page}&limit=${limit}`);
      return response;
    } catch (error) {
      throw new Error(error.data?.message || 'Failed to fetch interview history');
    }
  }

  // Get interview statistics
  async getInterviewStats() {
    try {
      const response = await api.get('/interviews/stats');
      return response;
    } catch (error) {
      throw new Error(error.data?.message || 'Failed to fetch interview statistics');
    }
  }

  // Retry an interview
  async retryInterview(interviewId) {
    try {
      const response = await api.post(`/interviews/${interviewId}/retry`);
      return response;
    } catch (error) {
      throw new Error(error.data?.message || 'Failed to retry interview');
    }
  }

  // Resume incomplete interview
  async resumeInterview(sessionId) {
    try {
      const response = await api.get(`/interviews/session/${sessionId}/resume`);
      return response;
    } catch (error) {
      throw new Error(error.data?.message || 'Failed to resume interview');
    }
  }

  // Get interview questions by category
  async getQuestionsByCategory(category, difficulty = 'all') {
    try {
      const response = await api.get(`/interviews/questions?category=${category}&difficulty=${difficulty}`);
      return response;
    } catch (error) {
      throw new Error(error.data?.message || 'Failed to fetch questions');
    }
  }

  // Get coding problems
  async getCodingProblems(difficulty = 'all', topics = []) {
    try {
      const params = new URLSearchParams({ difficulty });
      if (topics.length > 0) {
        params.append('topics', topics.join(','));
      }
      const response = await api.get(`/interviews/coding-problems?${params}`);
      return response;
    } catch (error) {
      throw new Error(error.data?.message || 'Failed to fetch coding problems');
    }
  }

  // Save interview feedback
  async saveInterviewFeedback(sessionId, feedback) {
    try {
      const response = await api.post(`/interviews/session/${sessionId}/feedback`, {
        feedback,
      });
      return response;
    } catch (error) {
      throw new Error(error.data?.message || 'Failed to save feedback');
    }
  }

  // Get interview tips based on performance
  async getInterviewTips(sessionId) {
    try {
      const response = await api.get(`/interviews/session/${sessionId}/tips`);
      return response;
    } catch (error) {
      throw new Error(error.data?.message || 'Failed to fetch interview tips');
    }
  }
}

export default new InterviewService();
