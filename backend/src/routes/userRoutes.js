import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import { getUserProfile, updateUserProfile, uploadAvatar, deleteUserAccount } from '../controllers/userController.js';
import { check } from 'express-validator';
import multer from 'multer';
import path from 'path';

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

// File upload configuration
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, 'uploads/avatars/');
  },
  filename: function (req, file, cb) {
    cb(null, `avatar_${req.user.id}_${Date.now()}${path.extname(file.originalname)}`);
  }
});
const upload = multer({ storage: storage });

/**
 * @route   GET /api/users/profile
 * @desc    Get user profile
 * @access  Private
 */
router.get('/profile', getUserProfile);

/**
 * @route   PUT /api/users/profile
 * @desc    Update user profile
 * @access  Private
 */
router.put(
  '/profile',
  [
    check('name', 'Name is required').optional().notEmpty(),
    check('email', 'Please include a valid email').optional().isEmail(),
    check('password', 'Password must be at least 6 characters').optional().isLength({ min: 6 }),
  ],
  updateUserProfile
);

/**
 * @route   POST /api/users/avatar
 * @desc    Upload user avatar
 * @access  Private
 */
router.post('/avatar', upload.single('avatar'), uploadAvatar);

/**
 * @route   DELETE /api/users
 * @desc    Delete user account
 * @access  Private
 */
router.delete('/', deleteUserAccount);

export default router;
