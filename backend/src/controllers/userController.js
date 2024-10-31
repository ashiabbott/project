import User from '../models/User.js';
import { validationResult } from 'express-validator';
import bcrypt from 'bcryptjs';
import { checkAchievements } from '../services/gamificationService.js';
import sendEmail from '../utils/sendEmail.js';
import crypto from 'crypto';
import jwt from 'jsonwebtoken';
import path from 'path';
import fs from 'fs';

/**
 * @desc    Get all users (Admin only)
 * @route   GET /api/users
 * @access  Private/Admin
 */
export const getUsers = async (req, res) => {
  try {
    // Ensure the requester has admin privileges
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const users = await User.find().select('-password').lean();
    res.status(200).json({ success: true, data: users });
  } catch (err) {
    console.error('Error fetching users:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get user by ID (Admin only)
 * @route   GET /api/users/:id
 * @access  Private/Admin
 */
export const getUserById = async (req, res) => {
  try {
    // Ensure the requester has admin privileges
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const user = await User.findById(req.params.id).select('-password').lean();

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('Error fetching user:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/profile
 * @access  Private
 */
export const updateUserProfile = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    // Update basic fields
    if (name) user.name = name;
    if (email) user.email = email;

    // Handle password change
    if (newPassword) {
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res
      .status(200)
      .json({ success: true, data: { name: user.name, email: user.email } });

    // Trigger achievement check asynchronously
    checkAchievements(req.user.id).catch(err => {
      console.error('Error checking achievements:', err.message);
    });
  } catch (err) {
    console.error('Error updating user profile:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Delete user (Admin only)
 * @route   DELETE /api/users/:id
 * @access  Private/Admin
 */
export const deleteUser = async (req, res) => {
  try {
    // Ensure the requester has admin privileges
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    await user.remove();

    res
      .status(200)
      .json({ success: true, message: 'User deleted successfully' });
  } catch (err) {
    console.error('Error deleting user:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Update user (Admin only)
 * @route   PUT /api/users/:id
 * @access  Private/Admin
 */
export const updateUser = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Ensure the requester has admin privileges
    if (req.user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    const { name, email, role } = req.body;

    const user = await User.findById(req.params.id);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: 'User not found' });
    }

    // Update fields
    if (name) user.name = name;
    if (email) user.email = email;
    if (role) user.role = role;

    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (err) {
    console.error('Error updating user:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Delete user account along with associated data
 * @route   DELETE /api/users/me
 * @access  Private
 */
export const deleteAccount = async (req, res) => {
  try {
    const userId = req.user.id;

    // Delete associated data
    await Promise.all([
      User.findByIdAndDelete(userId),
      Transaction.deleteMany({ user: userId }),
      Account.deleteMany({ user: userId }),
      Investment.deleteMany({ user: userId }),
      Goal.deleteMany({ user: userId }),
      Notification.deleteMany({ user: userId }),
      ChatMessage.deleteMany({ user: userId }),
    ]);

    res.status(200).json({
      success: true,
      message: 'Your account and all associated data have been deleted successfully.',
    });
  } catch (error) {
    console.error('Error deleting account:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get current logged-in user's profile
 * @route   GET /api/users/me
 * @access  Private
 */
export const getMe = async (req, res) => {
  try {
    // Fetch user data excluding the password field
    const user = await User.findById(req.user.id).select('-password').lean();

    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Update user profile
 * @route   PUT /api/users/me
 * @access  Private
 */
export const updateProfile = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { name, email, currentPassword, newPassword } = req.body;

  try {
    const user = await User.findById(req.user.id);

    // Update basic fields
    if (name) user.name = name;
    if (email) user.email = email;

    // Handle password change
    if (newPassword) {
      // Verify current password
      const isMatch = await bcrypt.compare(currentPassword, user.password);
      if (!isMatch) {
        return res
          .status(400)
          .json({ success: false, message: 'Current password is incorrect' });
      }

      // Hash new password
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(newPassword, salt);
    }

    await user.save();

    res
      .status(200)
      .json({ success: true, data: { name: user.name, email: user.email } });

    // Trigger achievement check asynchronously
    checkAchievements(req.user.id).catch(err => {
      console.error('Error checking achievements:', err.message);
    });
  } catch (err) {
    console.error('Error updating user profile:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Register a new user
// @route   POST /api/users/register
// @access  Public
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
      return res
        .status(400)
        .json({ success: false, message: 'User already exists' });
    }

    // Create user
    user = new User({
      name,
      email,
      password,
    });

    // Save user
    await user.save();

    // Generate email verification token
    const verificationToken = user.generateEmailVerificationToken();

    // Save the user with the token
    await user.save({ validateBeforeSave: false });

    // Send verification email
    const verifyUrl = `${req.protocol}://${req.get(
      'host'
    )}/api/users/verifyemail/${verificationToken}`;

    const message = `Welcome to our application! Please verify your email by clicking the following link: ${verifyUrl}`;

    await sendEmail({
      to: user.email,
      subject: 'Email Verification',
      text: message,
    });

    res.status(201).json({
      success: true,
      message: 'User registered successfully. Verification email sent.',
    });
  } catch (err) {
    console.error('Error during registration:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Verify user's email
// @route   GET /api/users/verifyemail/:token
// @access  Public
export const verifyEmail = async (req, res) => {
  const token = req.params.token;

  // Hash token
  const emailVerificationToken = crypto.createHash('sha256').update(token).digest('hex');

  try {
    const user = await User.findOne({
      emailVerificationToken,
    });

    if (!user) {
      return res.status(400).json({ success: false, message: 'Invalid token' });
    }

    // Verify email
    user.emailVerificationToken = undefined;
    user.emailVerified = true;
    await user.save({ validateBeforeSave: false });

    res.status(200).json({ success: true, message: 'Email verified successfully' });
  } catch (err) {
    console.error('Error verifying email:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// @desc    Authenticate user and get token
// @route   POST /api/users/login
// @access  Public
export const loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    // Validate email and password
    if (!email || !password) {
      return res
        .status(400)
        .json({ success: false, message: 'Please provide email and password' });
    }

    // Check for user
    const user = await User.findOne({ email }).select('+password');

    if (!user) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // Check if email is verified
    if (!user.emailVerified) {
      return res
        .status(400)
        .json({ success: false, message: 'Please verify your email first' });
    }

    // Check password
    const isMatch = await user.matchPassword(password);

    if (!isMatch) {
      return res
        .status(401)
        .json({ success: false, message: 'Invalid credentials' });
    }

    // Check if two-factor authentication is enabled
    if (user.twoFactorEnabled) {
      // Handle 2FA (e.g., send code via email or SMS)
      // For simplicity, we'll skip implementation here
    }

    // Generate token and send response
    sendTokenResponse(user, 200, res);
  } catch (err) {
    console.error('Error during login:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

// Helper function to generate token and send response
const sendTokenResponse = (user, statusCode, res) => {
  const token = user.getSignedJwtToken();

  const options = {
    expires: new Date(
      Date.now() + process.env.JWT_COOKIE_EXPIRE * 24 * 60 * 60 * 1000
    ),
    httpOnly: true,
  };

  // Secure cookie in production
  if (process.env.NODE_ENV === 'production') {
    options.secure = true;
  }

  res
    .status(statusCode)
    .cookie('token', token, options)
    .json({ success: true, token });
};

// Additional controller methods (e.g., logout, forgot password, reset password)
// ...

/**
 * @desc    Get user profile
 * @route   GET /api/users/profile
 * @access  Private
 */
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -mfaSecret');

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error fetching user profile:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Upload user avatar
 * @route   POST /api/users/avatar
 * @access  Private
 */
export const uploadAvatar = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, message: 'No file uploaded' });
    }

    const user = await User.findById(req.user.id);

    // Delete old avatar if exists
    if (user.avatar) {
      fs.unlink(path.join(__dirname, '../../', user.avatar), err => {
        if (err) console.error('Error deleting old avatar:', err.message);
      });
    }

    // Update user avatar path
    user.avatar = req.file.path;
    await user.save();

    res.status(200).json({ success: true, data: user });
  } catch (error) {
    console.error('Error uploading avatar:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Delete user account
 * @route   DELETE /api/users
 * @access  Private
 */
export const deleteUserAccount = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    // Remove user and their associated data
    await user.remove();

    res.status(200).json({ success: true, message: 'User account deleted' });
  } catch (error) {
    console.error('Error deleting user account:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
