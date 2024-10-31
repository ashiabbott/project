import User from '../models/User.js';
import { validationResult } from 'express-validator';
import jwt from 'jsonwebtoken';
import crypto from 'crypto';
import sendEmail from '../utils/sendEmail.js';
import { generateTotpSecret, verifyTotpToken } from '../utils/mfa.js';

/**
 * @desc    Register a new user
 * @route   POST /api/auth/register
 * @access  Public
 */
export const registerUser = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, password } = req.body;

  try {
    // Check if user already exists
    let user = await User.findOne({ email });

    if (user) {
      return res.status(400).json({ success: false, message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name,
      email,
      password,
    });

    // Save user to database
    await user.save();

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();

    await user.save();

    // Construct verification URL
    const verificationUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/auth/verify-email/${verificationToken}`;

    // Send verification email
    const message = `Welcome to our platform! Please verify your email by clicking the following link: \n\n ${verificationUrl}`;

    await sendEmail({
      email: user.email,
      subject: 'Email Verification',
      message,
    });

    res.status(201).json({
      success: true,
      message: 'User registered. Please verify your email to activate your account.',
    });
  } catch (error) {
    console.error('Error registering user:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Verify email address
 * @route   GET /api/auth/verify-email/:token
 * @access  Public
 */
export const verifyEmail = async (req, res) => {
  const { token } = req.params;

  try {
    // Hash the token
    const emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user by token
    const user = await User.findOne({
      emailVerificationToken,
      emailVerificationTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // Update user verification status
    user.isEmailVerified = true;
    user.emailVerificationToken = undefined;
    user.emailVerificationTokenExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (error) {
    console.error('Error verifying email:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Login user
 * @route   POST /api/auth/login
 * @access  Public
 */
export const loginUser = async (req, res) => {
  const { email, password, totpToken } = req.body;

  try {
    // Validate email and password
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide email and password' });
    }

    // Find user by email
    const user = await User.findOne({ email }).select('+password +isEmailVerified');

    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.isEmailVerified) {
      return res.status(401).json({ success: false, message: 'Email not verified' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Check if MFA is enabled
    if (user.isMfaEnabled) {
      if (!totpToken) {
        return res.status(401).json({ success: false, message: 'MFA token required' });
      }

      const isTotpValid = verifyTotpToken(user.mfaSecret, totpToken);

      if (!isTotpValid) {
        return res.status(401).json({ success: false, message: 'Invalid MFA token' });
      }
    }

    // Generate JWT token
    const token = user.getSignedJwtToken();

    res.status(200).json({ success: true, token });
  } catch (error) {
    console.error('Error logging in user:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Forgot password
 * @route   POST /api/auth/forgot-password
 * @access  Public
 */
export const forgotPassword = async (req, res) => {
  const { email } = req.body;

  try {
    // Find user by email
    const user = await User.findOne({ email });

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'There is no user with that email' });
    }

    // Generate password reset token
    const resetToken = user.generatePasswordResetToken();

    await user.save();

    // Construct reset URL
    const resetUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/auth/reset-password/${resetToken}`;

    // Send reset email
    const message = `You are receiving this email because you (or someone else) has requested a password reset. Please click the following link to reset your password: \n\n ${resetUrl}`;

    await sendEmail({
      email: user.email,
      subject: 'Password Reset',
      message,
    });

    res.status(200).json({ success: true, message: 'Password reset email sent' });
  } catch (error) {
    console.error('Error in forgot password:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Reset password
 * @route   PUT /api/auth/reset-password/:token
 * @access  Public
 */
export const resetPassword = async (req, res) => {
  const { token } = req.params;
  const { password } = req.body;

  try {
    // Hash the token
    const passwordResetToken = crypto.createHash('sha256').update(token).digest('hex');

    // Find user by token
    const user = await User.findOne({
      passwordResetToken,
      passwordResetTokenExpire: { $gt: Date.now() },
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid or expired token' });
    }

    // Update password
    user.password = password;
    user.passwordResetToken = undefined;
    user.passwordResetTokenExpire = undefined;

    await user.save();

    res.status(200).json({ success: true, message: 'Password reset successful' });
  } catch (error) {
    console.error('Error resetting password:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Enable MFA
 * @route   POST /api/auth/enable-mfa
 * @access  Private
 */
export const enableMfa = async (req, res) => {
  try {
    // Generate TOTP secret
    const { secret, otpauthUrl } = generateTotpSecret(req.user.email);

    // Save secret to user
    req.user.mfaSecret = secret;
    req.user.isMfaEnabled = true;
    await req.user.save();

    res.status(200).json({
      success: true,
      message: 'MFA enabled',
      data: { otpauthUrl },
    });
  } catch (error) {
    console.error('Error enabling MFA:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Disable MFA
 * @route   POST /api/auth/disable-mfa
 * @access  Private
 */
export const disableMfa = async (req, res) => {
  try {
    req.user.mfaSecret = undefined;
    req.user.isMfaEnabled = false;
    await req.user.save();

    res.status(200).json({ success: true, message: 'MFA disabled' });
  } catch (error) {
    console.error('Error disabling MFA:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
