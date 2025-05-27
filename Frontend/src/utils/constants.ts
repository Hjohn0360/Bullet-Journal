export const API_BASE_URL = 'http://localhost:5046/api';

export const ROUTES = {
  HOME: '/',
  LOGIN: '/login',
  REGISTER: '/register',
  DASHBOARD: '/dashboard',
} as const;

export const USER_ROLES = {
  ADMIN: 'Admin',
  USER: 'User',
} as const;