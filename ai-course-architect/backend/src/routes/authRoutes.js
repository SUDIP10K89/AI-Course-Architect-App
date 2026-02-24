/**
 * Authentication Routes
 *
 * Signup and login endpoints.
 */

import express from 'express';
import { body, validationResult } from 'express-validator';
import * as authController from '../controllers/authController.js';

const router = express.Router();

const validate = (checks) => async (req, res, next) => {
  await Promise.all(checks.map((c) => c.run(req)));
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, error: errors.array()[0].msg });
  }
  next();
};

router.post(
  '/signup',
  validate([
    body('name').trim().notEmpty().withMessage('Name is required'),
    body('email').isEmail().withMessage('Valid email required'),
    body('password').isLength({ min: 6 }).withMessage('Password must be at least 6 characters'),
  ]),
  authController.signup
);

router.post(
  '/login',
  validate([
    body('email').isEmail().withMessage('Valid email required'),
    body('password').notEmpty().withMessage('Password cannot be empty'),
  ]),
  authController.login
);

export default router;
