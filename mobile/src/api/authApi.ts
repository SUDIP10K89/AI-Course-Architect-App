/**
 * Auth API Service
 *
 * Handles authentication HTTP requests to the backend API.
 */

import type { ApiResponse, AuthResponse, LoginForm, SignupForm } from '@/types';
import { apiPost } from './client';

// ============================================
// Auth API Methods
// ============================================

/**
 * Login with email and password
 */
export const login = async (form: LoginForm): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiPost<ApiResponse<AuthResponse>>('/auth/login', form);
  return response.data;
};

/**
 * Register a new user
 */
export const signup = async (form: SignupForm): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiPost<ApiResponse<AuthResponse>>('/auth/signup', form);
  return response.data;
};

export const register = signup;

/**
 * Verify email with token
 */
export const verifyEmail = async (token: string): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiPost<ApiResponse<AuthResponse>>('/auth/verify-email', { token });
  return response.data;
};

/**
 * Resend verification email
 */
export const resendVerification = async (email: string): Promise<ApiResponse<{ message: string }>> => {
  const response = await apiPost<ApiResponse<{ message: string }>>('/auth/resend-verification', { email });
  return response.data;
};

/**
 * Login with Google
 */
export const googleLogin = async (idToken: string): Promise<ApiResponse<AuthResponse>> => {
  const response = await apiPost<ApiResponse<AuthResponse>>('/auth/google', { idToken });
  return response.data;
};
