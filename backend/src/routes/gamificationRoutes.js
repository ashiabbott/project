import express from 'express';
import {
  checkAchievements,
  getAchievements,
  claimReward,
} from '../controllers/gamificationController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

// @route   POST /api/gamification/check-achievements
// @desc    Check and award new achievements
// @access  Private
router.post('/check-achievements', checkAchievements);

// @route   GET /api/gamification/achievements
// @desc    Get user's achievements and points
// @access  Private
router.get('/achievements', getAchievements);

// @route   POST /api/gamification/redeem
// @desc    Redeem a reward using points
// @access  Private
router.post('/redeem', claimReward);

export default router;
