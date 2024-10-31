import express from 'express';
import { check } from 'express-validator';
import {
  registerUser,
  verifyEmail,
  loginUser,
  forgotPassword,
  resetPassword,
  enableMfa,
  disableMfa,
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

/**
 * @route   POST /api/auth/register
 * @desc    Register a new user
 * @access  Public
 */
router.post(
  '/register',
  [
    check('name', 'Name is required').notEmpty(),
    check('email', 'Please include a valid email').isEmail(),
    check(
      'password',
      'Please enter a password with 6 or more characters'
    ).isLength({ min: 6 }),
  ],
  registerUser
);

/**
 * @route   GET /api/auth/verify-email/:token
 * @desc    Verify email address
 * @access  Public
 */
router.get('/verify-email/:token', verifyEmail);

/**
 * @route   POST /api/auth/login
 * @desc    Login user
 * @access  Public
 */
router.post(
  '/login',
  [
    check('email', 'Please include a valid email').isEmail(),
    check('password', 'Password is required').exists(),
  ],
  loginUser
);

/**
 * @route   POST /api/auth/forgot-password
 * @desc    Initiate password reset
 * @access  Public
 */
router.post('/forgot-password', [check('email', 'Please include a valid email').isEmail()], forgotPassword);

/**
 * @route   PUT /api/auth/reset-password/:token
 * @desc    Reset password using token
 * @access  Public
 */
router.put('/reset-password/:token', [check('password', 'Password is required').exists()], resetPassword);

/**
 * @route   POST /api/auth/enable-mfa
 * @desc    Enable Multi-Factor Authentication
 * @access  Private
 */
router.post('/enable-mfa', authMiddleware, enableMfa);

/**
 * @route   POST /api/auth/disable-mfa
 * @desc    Disable Multi-Factor Authentication
 * @access  Private
 */
router.post('/disable-mfa', authMiddleware, disableMfa);

export default router;
