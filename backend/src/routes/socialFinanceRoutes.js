import express from 'express';
import { check } from 'express-validator';
import authMiddleware from '../middleware/auth.js';
import {
  getChallenges,
  getChallengeById,
  createChallenge,
  updateChallenge,
  deleteChallenge,
  joinChallenge,
  leaveChallenge,
  getChallengeParticipants,
  getChallengeLeaderboard,
} from '../controllers/socialFinanceController.js';

const router = express.Router();

// Public routes
router.get('/challenges', getChallenges);
router.get('/challenges/:id', getChallengeById);
router.get('/challenges/:id/participants', getChallengeParticipants);
router.get('/challenges/:id/leaderboard', getChallengeLeaderboard);

// Protected routes
router.post(
  '/challenges',
  authMiddleware,
  [
    check('title', 'Title is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    check('startDate', 'Start date must be a valid date').isISO8601(),
    check('endDate', 'End date must be a valid date').isISO8601(),
    check('goal', 'Goal is required and must be a number').isNumeric(),
    check('rules', 'Rules must be a string').optional().isString(),
  ],
  createChallenge,
);

router.put(
  '/challenges/:id',
  authMiddleware,
  [
    check('title', 'Title must be a non-empty string').optional().notEmpty(),
    check('description', 'Description must be a non-empty string')
      .optional()
      .notEmpty(),
    check('startDate', 'Start date must be a valid date')
      .optional()
      .isISO8601(),
    check('endDate', 'End date must be a valid date').optional().isISO8601(),
    check('goal', 'Goal must be a number').optional().isNumeric(),
    check('rules', 'Rules must be a string').optional().isString(),
  ],
  updateChallenge,
);

router.delete('/challenges/:id', authMiddleware, deleteChallenge);

router.post('/challenges/:id/join', authMiddleware, joinChallenge);
router.post('/challenges/:id/leave', authMiddleware, leaveChallenge);

export default router;
