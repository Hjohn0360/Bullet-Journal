import axios from 'axios';

const API_BASE_URL = 'http://localhost:5046/api';

export const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add request interceptor to include userId header (temporary until JWT)
api.interceptors.request.use((config) => {
  const userId = localStorage.getItem('userId');
  if (userId) {
    config.headers['userId'] = userId;
  }
  return config;
});

// Question API
export const questionApi = {
  getAll: async () => {
    const response = await api.get('/Question');
    return response.data;
  },
  
  create: async (questionData: any) => {
    const response = await api.post('/Question', questionData);
    return response.data;
  },
  
  update: async (id: string, questionData: any) => {
    const response = await api.put(`/Question/${id}`, questionData);
    return response.data;
  },
  
  delete: async (id: string) => {
    const response = await api.delete(`/Question/${id}`);
    return response.data;
  }
};

// Answer API
export const answerApi = {
  getAll: async () => {
    const response = await api.get(`/Answer`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/Answer/${id}`);
    return response.data;
  },

  getByQuestion: async (questionId: string) => {
    const response = await api.get(`/Answer/question/${questionId}`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/Answer/${id}`);
    return response.data;
  }
};

// User Api
export const userApi = {
  getAll: async ()  => {
    const response = await api.get(`/User`);
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/User/${id}`);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/User/${id}`);
    return response.data;
  }
};

export default api;