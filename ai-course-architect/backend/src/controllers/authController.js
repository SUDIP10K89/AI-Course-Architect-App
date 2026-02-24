/**
 * Authentication Controller
 *
 * Handles signup and login logic, returns JWT tokens.
 */

import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { JWT_CONFIG } from '../config/env.js';

// create signed token
const signToken = (user) => {
  return jwt.sign(
    { id: user._id, name: user.name, email: user.email },
    JWT_CONFIG.SECRET,
    { expiresIn: JWT_CONFIG.EXPIRES_IN }
  );
};

export const signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;

    // basic validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Missing fields' });
    }

    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ success: false, error: 'Email already in use' });
    }

    const user = await User.create({ name, email, password });
    const token = signToken(user);

    res.status(201).json({
      success: true,
      data: { user: user.toJSON(), token },
    });
  } catch (err) {
    next(err);
  }
};

export const login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Missing email or password' });
    }

    const user = await User.findOne({ email }).select('+password');
    if (!user || !user.password) {
      // either no such user or password field missing
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' });
    }

    const token = signToken(user);
    res.json({ success: true, data: { user: user.toJSON(), token } });
  } catch (err) {
    next(err);
  }
};
