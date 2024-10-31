// Import necessary modules and models
import Challenge from '../models/Challenge.js';
import ChallengeParticipation from '../models/ChallengeParticipation.js';
import User from '../models/User.js';
import { validationResult } from 'express-validator';
import { checkAchievements } from '../services/gamificationService.js';

/**
 * @desc    Get all challenges
 * @route   GET /api/social-finance/challenges
 * @access  Public
 */
export const getChallenges = async (req, res) => {
  try {
    const challenges = await Challenge.find()
      .populate('creator', 'name email')
      .lean();

    res.status(200).json({ success: true, data: challenges });
  } catch (error) {
    console.error('Error fetching challenges:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get a single challenge by ID
 * @route   GET /api/social-finance/challenges/:id
 * @access  Public
 */
export const getChallengeById = async (req, res) => {
  const { id } = req.params;

  try {
    const challenge = await Challenge.findById(id)
      .populate('creator', 'name email')
      .lean();

    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, message: 'Challenge not found' });
    }

    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    console.error('Error fetching challenge:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Create a new challenge
 * @route   POST /api/social-finance/challenges
 * @access  Private
 */
export const createChallenge = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { title, description, startDate, endDate, goal, rules } = req.body;

  try {
    const challenge = new Challenge({
      creator: req.user.id,
      title,
      description,
      startDate,
      endDate,
      goal,
      rules,
    });

    await challenge.save();

    res.status(201).json({ success: true, data: challenge });
  } catch (error) {
    console.error('Error creating challenge:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Update a challenge
 * @route   PUT /api/social-finance/challenges/:id
 * @access  Private
 */
export const updateChallenge = async (req, res) => {
  const { id } = req.params;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    // Check if challenge exists and if the user is the creator
    let challenge = await Challenge.findById(id);

    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, message: 'Challenge not found' });
    }

    if (challenge.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Update challenge fields
    const { title, description, startDate, endDate, goal, rules } = req.body;

    if (title) challenge.title = title;
    if (description) challenge.description = description;
    if (startDate) challenge.startDate = startDate;
    if (endDate) challenge.endDate = endDate;
    if (goal) challenge.goal = goal;
    if (rules) challenge.rules = rules;

    await challenge.save();

    res.status(200).json({ success: true, data: challenge });
  } catch (error) {
    console.error('Error updating challenge:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Delete a challenge
 * @route   DELETE /api/social-finance/challenges/:id
 * @access  Private
 */
export const deleteChallenge = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if challenge exists and if the user is the creator
    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, message: 'Challenge not found' });
    }

    if (challenge.creator.toString() !== req.user.id) {
      return res.status(403).json({ success: false, message: 'Unauthorized' });
    }

    // Delete the challenge
    await challenge.remove();

    res
      .status(200)
      .json({ success: true, message: 'Challenge deleted successfully' });
  } catch (error) {
    console.error('Error deleting challenge:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Join a challenge
 * @route   POST /api/social-finance/challenges/:id/join
 * @access  Private
 */
export const joinChallenge = async (req, res) => {
  const { id } = req.params;

  try {
    const challenge = await Challenge.findById(id);

    if (!challenge) {
      return res
        .status(404)
        .json({ success: false, message: 'Challenge not found' });
    }

    // Check if the user has already joined
    const existingParticipation = await ChallengeParticipation.findOne({
      user: req.user.id,
      challenge: id,
    });

    if (existingParticipation) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'You have already joined this challenge',
        });
    }

    const participation = new ChallengeParticipation({
      user: req.user.id,
      challenge: id,
    });

    await participation.save();

    res
      .status(200)
      .json({ success: true, message: 'Successfully joined the challenge' });

    // Trigger achievement check asynchronously
    checkAchievements(req.user.id).catch(err => {
      console.error('Error checking achievements:', err.message);
    });
  } catch (error) {
    console.error('Error joining challenge:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Leave a challenge
 * @route   POST /api/social-finance/challenges/:id/leave
 * @access  Private
 */
export const leaveChallenge = async (req, res) => {
  const { id } = req.params;

  try {
    const participation = await ChallengeParticipation.findOne({
      user: req.user.id,
      challenge: id,
    });

    if (!participation) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'You have not joined this challenge',
        });
    }

    await participation.remove();

    res
      .status(200)
      .json({ success: true, message: 'Successfully left the challenge' });
  } catch (error) {
    console.error('Error leaving challenge:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get challenge participants
 * @route   GET /api/social-finance/challenges/:id/participants
 * @access  Public
 */
export const getChallengeParticipants = async (req, res) => {
  const { id } = req.params;

  try {
    const participants = await ChallengeParticipation.find({ challenge: id })
      .populate('user', 'name email')
      .lean();

    res.status(200).json({ success: true, data: participants });
  } catch (error) {
    console.error('Error fetching challenge participants:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get challenge leaderboard
 * @route   GET /api/social-finance/challenges/:id/leaderboard
 * @access  Public
 */
export const getChallengeLeaderboard = async (req, res) => {
  const { id } = req.params;

  try {
    // Assuming that we have a mechanism to track user progress in a challenge
    // E.g., a 'progress' field in ChallengeParticipation model

    const leaderboard = await ChallengeParticipation.find({ challenge: id })
      .populate('user', 'name email')
      .sort({ progress: -1 }) // Assuming higher progress is better
      .lean();

    res.status(200).json({ success: true, data: leaderboard });
  } catch (error) {
    console.error('Error fetching challenge leaderboard:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
