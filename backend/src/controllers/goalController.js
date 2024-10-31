import Goal from '../models/Goal.js';
import { validationResult } from 'express-validator';
import { checkAchievements } from '../services/gamificationService.js';

/**
 * @desc    Get all goals for the authenticated user
 * @route   GET /api/goals
 * @access  Private
 */
export const getGoals = async (req, res) => {
  try {
    const goals = await Goal.find({ user: req.user.id }).lean();
    res.status(200).json({ success: true, data: goals });
  } catch (err) {
    console.error('Error fetching goals:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get a single goal by ID
 * @route   GET /api/goals/:id
 * @access  Private
 */
export const getGoalById = async (req, res) => {
  const { id } = req.params;

  try {
    const goal = await Goal.findOne({ _id: id, user: req.user.id }).lean();

    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: 'Goal not found' });
    }

    res.status(200).json({ success: true, data: goal });
  } catch (err) {
    console.error('Error fetching goal:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Create a new goal
 * @route   POST /api/goals
 * @access  Private
 */
export const createGoal = async (req, res) => {
  // Validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const {
    title,
    description,
    targetAmount,
    currentAmount,
    targetDate,
    category,
  } = req.body;

  try {
    const goal = new Goal({
      user: req.user.id,
      title,
      description,
      targetAmount,
      currentAmount: currentAmount || 0,
      targetDate,
      category,
    });

    await goal.save();

    res.status(201).json({ success: true, data: goal });

    // Trigger achievement check asynchronously
    checkAchievements(req.user.id).catch(err => {
      console.error('Error checking achievements:', err.message);
    });
  } catch (err) {
    console.error('Error creating goal:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Update an existing goal
 * @route   PUT /api/goals/:id
 * @access  Private
 */
export const updateGoal = async (req, res) => {
  const { id } = req.params;

  // Validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    let goal = await Goal.findOne({ _id: id, user: req.user.id });

    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: 'Goal not found' });
    }

    const {
      title,
      description,
      targetAmount,
      currentAmount,
      targetDate,
      category,
    } = req.body;

    // Update fields
    if (title) goal.title = title;
    if (description) goal.description = description;
    if (targetAmount) goal.targetAmount = targetAmount;
    if (currentAmount !== undefined) goal.currentAmount = currentAmount;
    if (targetDate) goal.targetDate = targetDate;
    if (category) goal.category = category;

    await goal.save();

    res.status(200).json({ success: true, data: goal });

    // Trigger achievement check asynchronously
    checkAchievements(req.user.id).catch(err => {
      console.error('Error checking achievements:', err.message);
    });
  } catch (err) {
    console.error('Error updating goal:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Delete a goal
 * @route   DELETE /api/goals/:id
 * @access  Private
 */
export const deleteGoal = async (req, res) => {
  const { id } = req.params;

  try {
    const goal = await Goal.findOne({ _id: id, user: req.user.id });

    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: 'Goal not found' });
    }

    await goal.remove();

    res
      .status(200)
      .json({ success: true, message: 'Goal deleted successfully' });

    // Trigger achievement check asynchronously
    checkAchievements(req.user.id).catch(err => {
      console.error('Error checking achievements:', err.message);
    });
  } catch (err) {
    console.error('Error deleting goal:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Contribute to a goal
 * @route   POST /api/goals/:id/contribute
 * @access  Private
 */
export const contributeToGoal = async (req, res) => {
  const { id } = req.params;
  const { amount } = req.body;

  // Validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    let goal = await Goal.findOne({ _id: id, user: req.user.id });

    if (!goal) {
      return res
        .status(404)
        .json({ success: false, message: 'Goal not found' });
    }

    // Update current amount
    goal.currentAmount += amount;

    // Check if goal is completed
    if (goal.currentAmount >= goal.targetAmount) {
      goal.isCompleted = true;
      goal.completedAt = new Date();
    }

    await goal.save();

    res.status(200).json({ success: true, data: goal });

    // Trigger achievement check asynchronously
    checkAchievements(req.user.id).catch(err => {
      console.error('Error checking achievements:', err.message);
    });
  } catch (err) {
    console.error('Error contributing to goal:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
