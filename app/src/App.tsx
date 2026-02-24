/**
 * AI Course Architect - Main App Component
 * 
 * Root component that sets up routing, theme, and course context.
 */

import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { ThemeProvider } from '@/contexts/ThemeContext';
import { CourseProvider } from '@/contexts/CourseContext';
import { AuthProvider } from '@/contexts/AuthContext';
import HomePage from '@/pages/HomePage';
import CoursesPage from '@/pages/CoursesPage';
import CourseViewer from '@/components/CourseViewer';
import LoginPage from '@/pages/LoginPage';
import SignupPage from '@/pages/SignupPage';
import { Toaster } from '@/components/ui/sonner';
import './App.css';

const App: React.FC = () => {
  return (
    <ThemeProvider>
      <AuthProvider>
        <CourseProvider>
          <Router>
            <Routes>
              <Route path="/" element={<HomePage />} />
              <Route path="/courses" element={<CoursesPage />} />
              <Route path="/courses/:courseId" element={<CourseViewer />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/signup" element={<SignupPage />} />
            </Routes>
          </Router>
          <Toaster position="top-right" richColors />
        </CourseProvider>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App;
