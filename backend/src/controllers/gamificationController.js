import {
  checkAchievements as checkUserAchievements,
  getUserPoints,
  getUserAchievements,
  redeemReward,
  getAvailableRewards,
  getUserRewards,
} from '../services/gamificationService.js';
import { validationResult } from 'express-validator';

/**
 * @desc    Check and award new achievements for the user
 * @route   POST /api/gamification/check-achievements
 * @access  Private
 */
export const checkAchievements = async (req, res) => {
  try {
    const newAchievements = await checkUserAchievements(req.user.id);
    res.status(200).json({ success: true, data: newAchievements });
  } catch (err) {
    console.error('Error checking achievements:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get user's achievements and total points
 * @route   GET /api/gamification/achievements
 * @access  Private
 */
export const getAchievements = async (req, res) => {
  try {
    const achievements = await getUserAchievements(req.user.id);
    const points = await getUserPoints(req.user.id);
    res.status(200).json({ success: true, data: { achievements, points } });
  } catch (err) {
    console.error('Error getting achievements:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Redeem a reward using points
 * @route   POST /api/gamification/redeem
 * @access  Private
 */
export const claimReward = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { rewardId } = req.body;

  try {
    const success = await redeemReward(req.user.id, rewardId);

    if (!success) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Insufficient points or invalid reward',
        });
    }

    res
      .status(200)
      .json({ success: true, message: 'Reward redeemed successfully' });
  } catch (err) {
    console.error('Error redeeming reward:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get all available rewards
 * @route   GET /api/gamification/rewards
 * @access  Private
 */
export const getRewards = async (req, res) => {
  try {
    const rewards = await getAvailableRewards();
    res.status(200).json({ success: true, data: rewards });
  } catch (err) {
    console.error('Error fetching rewards:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get user's redeemed rewards
 * @route   GET /api/gamification/my-rewards
 * @access  Private
 */
export const getUserRedeemedRewards = async (req, res) => {
  try {
    const userRewards = await getUserRewards(req.user.id);
    res.status(200).json({ success: true, data: userRewards });
  } catch (err) {
    console.error('Error fetching user rewards:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
