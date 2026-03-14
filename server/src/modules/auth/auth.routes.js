/**
 * Authentication Routes
 *
 * Signup, login, email verification, and Google OAuth endpoints.
 */

import express from 'express';
import * as authController from './auth.controller.js';
import { loginValidation, signupValidation } from './auth.validators.js';
import { validateRequest } from '../../shared/middleware/validateRequest.js';

const router = express.Router();

// ============================================
// Email/Password Authentication
// ============================================

router.post(
  '/signup',
  validateRequest(signupValidation),
  authController.signup
);

router.post(
  '/login',
  validateRequest(loginValidation),
  authController.login
);

// ============================================
// Email Verification
// ============================================

router.post(
  '/verify-email',
  authController.verifyEmail
);

router.post(
  '/resend-verification',
  authController.resendVerification
);

// ============================================
// Google OAuth
// ============================================

router.post(
  '/google',
  authController.googleAuth
);

export default router;
