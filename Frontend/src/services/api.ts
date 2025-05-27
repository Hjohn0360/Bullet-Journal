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

export default api;