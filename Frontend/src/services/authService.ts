import api from './api';
import { User, LoginRequest, RegisterRequest } from './types';

export const authService = {
  async login(credentials: LoginRequest): Promise<{ success: boolean; user?: User }> {
    try {
      const response = await api.post('/User/login', credentials);
      
      if (response.status === 200) {
        // Store user ID temporarily (until we implement JWT properly)
        localStorage.setItem('userId', response.data.id);
        localStorage.setItem('username', response.data.username);
        
        // Get full user details
        const userResponse = await api.get(`/User/${response.data.id}`);
        return { success: true, user: userResponse.data };
      }
      return { success: false };
    } catch (error) {
      console.error('Login error:', error);
      return { success: false };
    }
  },

  async register(userData: RegisterRequest): Promise<{ success: boolean; user?: User }> {
    try {
      const response = await api.post('/User/register', userData);
      
      if (response.status === 201) {
        return { success: true, user: response.data };
      }
      return { success: false };
    } catch (error) {
      console.error('Registration error:', error);
      return { success: false };
    }
  },

  async getCurrentUser(userId: string): Promise<User | null> {
    try {
      const response = await api.get(`/User/${userId}`);
      return response.data;
    } catch (error) {
      console.error('Get current user error:', error);
      return null;
    }
  },

  logout(): void {
    localStorage.removeItem('userId');
    localStorage.removeItem('username');
  },

  getCurrentUserId(): string | null {
    return localStorage.getItem('userId');
  }
};