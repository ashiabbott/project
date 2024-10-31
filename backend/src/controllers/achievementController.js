import Achievement from '../models/Achievement.js';
import UserAchievement from '../models/UserAchievement.js';
import { validationResult } from 'express-validator';

/**
 * @desc    Get all achievements
 * @route   GET /api/achievements
 * @access  Public
 */
export const getAchievements = async (req, res) => {
  try {
    const achievements = await Achievement.find().lean();
    res.status(200).json({ success: true, data: achievements });
  } catch (err) {
    console.error('Error fetching achievements:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get a single achievement by ID
 * @route   GET /api/achievements/:id
 * @access  Public
 */
export const getAchievementById = async (req, res) => {
  const { id } = req.params;

  try {
    const achievement = await Achievement.findById(id).lean();

    if (!achievement) {
      return res
        .status(404)
        .json({ success: false, message: 'Achievement not found' });
    }

    res.status(200).json({ success: true, data: achievement });
  } catch (err) {
    console.error('Error fetching achievement:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Create a new achievement (Admin only)
 * @route   POST /api/achievements
 * @access  Private/Admin
 */
export const createAchievement = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  // Ensure the requester has admin privileges
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  const { name, description, criteria, icon } = req.body;

  try {
    const achievement = new Achievement({
      name,
      description,
      criteria,
      icon,
    });

    await achievement.save();

    res.status(201).json({ success: true, data: achievement });
  } catch (err) {
    console.error('Error creating achievement:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Update an achievement (Admin only)
 * @route   PUT /api/achievements/:id
 * @access  Private/Admin
 */
export const updateAchievement = async (req, res) => {
  // Validate request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  // Ensure the requester has admin privileges
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  const { id } = req.params;
  const { name, description, criteria, icon } = req.body;

  try {
    const achievement = await Achievement.findById(id);

    if (!achievement) {
      return res
        .status(404)
        .json({ success: false, message: 'Achievement not found' });
    }

    // Update fields
    if (name) achievement.name = name;
    if (description) achievement.description = description;
    if (criteria) achievement.criteria = criteria;
    if (icon) achievement.icon = icon;

    await achievement.save();

    res.status(200).json({ success: true, data: achievement });
  } catch (err) {
    console.error('Error updating achievement:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Delete an achievement (Admin only)
 * @route   DELETE /api/achievements/:id
 * @access  Private/Admin
 */
export const deleteAchievement = async (req, res) => {
  // Ensure the requester has admin privileges
  if (req.user.role !== 'admin') {
    return res.status(403).json({ success: false, message: 'Access denied' });
  }

  const { id } = req.params;

  try {
    const achievement = await Achievement.findById(id);

    if (!achievement) {
      return res
        .status(404)
        .json({ success: false, message: 'Achievement not found' });
    }

    await achievement.remove();

    res
      .status(200)
      .json({ success: true, message: 'Achievement deleted successfully' });
  } catch (err) {
    console.error('Error deleting achievement:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get user's achievements
 * @route   GET /api/achievements/user
 * @access  Private
 */
export const getUserAchievements = async (req, res) => {
  try {
    const userAchievements = await UserAchievement.find({ user: req.user.id })
      .populate('achievement')
      .lean();

    res.status(200).json({ success: true, data: userAchievements });
  } catch (err) {
    console.error('Error fetching user achievements:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
