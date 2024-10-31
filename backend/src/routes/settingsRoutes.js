import express from 'express';
import {
  updateSettings,
  getSettings,
} from '../controllers/settingsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

// @route   GET /api/settings
// @desc    Get user's settings
// @access  Private
router.get('/', getSettings);

// @route   PUT /api/settings
// @desc    Update user's settings
// @access  Private
router.put('/', updateSettings);

export default router;
