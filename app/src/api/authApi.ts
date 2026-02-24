/**
 * Authentication API Service
 *
 * Handles login and signup HTTP requests to the backend.
 */

import axios, { type AxiosInstance } from 'axios';
import type { ApiResponse, AuthResponse } from '@/types';

// use the same base url as other api modules
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const apiClient: AxiosInstance = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 30000,
});

// attach token from localStorage for any request (not needed for login/signup but safe)
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (axios.isAxiosError(error) && error.response) {
      console.error('Auth API Error:', error.response.data);
      return Promise.reject(error.response.data);
    }
    return Promise.reject({ success: false, error: 'Network error' });
  }
);

export const login = async (email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post('/auth/login', { email, password });
  return response.data;
};

export const signup = async (name: string, email: string, password: string): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiClient.post('/auth/signup', { name, email, password });
  return response.data;
};

export default {
  login,
  signup,
};
