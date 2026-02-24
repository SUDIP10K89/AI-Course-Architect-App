/**
 * Authentication Context
 *
 * Provides user/token state and helpers for login, signup, logout.
 */

import React, { createContext, useContext, useState, useEffect } from 'react';
import type { ReactNode } from 'react';
import axios from 'axios';
import type { User } from '@/types';
import * as authApi from '@/api/authApi';

interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  // load from localStorage on mount
  useEffect(() => {
    try {
      const stored = localStorage.getItem('auth');
      if (stored) {
        const parsed = JSON.parse(stored) as { user: User; token: string };
        setUser(parsed.user);
        setToken(parsed.token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${parsed.token}`;
      }
    } catch (err) {
      console.warn('failed to load auth from storage', err);
    }
  }, []);

  // persist any change
  useEffect(() => {
    if (token && user) {
      localStorage.setItem('auth', JSON.stringify({ user, token }));
      axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    } else {
      localStorage.removeItem('auth');
      delete axios.defaults.headers.common['Authorization'];
    }
  }, [token, user]);

  const login = async (email: string, password: string) => {
    const response = await authApi.login(email, password);
    if (response.success) {
      setUser(response.data.user);
      setToken(response.data.token);
    } else {
      throw new Error(response.error || 'Login failed');
    }
  };

  const signup = async (name: string, email: string, password: string) => {
    const response = await authApi.signup(name, email, password);
    if (response.success) {
      setUser(response.data.user);
      setToken(response.data.token);
    } else {
      throw new Error(response.error || 'Signup failed');
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
  };

  const value: AuthContextType = {
    user,
    token,
    isAuthenticated: !!token,
    login,
    signup,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};
