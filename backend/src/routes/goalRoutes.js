import express from 'express';
import { check } from 'express-validator';
import authMiddleware from '../middleware/auth.js';
import {
  getGoals,
  getGoalById,
  createGoal,
  updateGoal,
  deleteGoal,
  contributeToGoal,
} from '../controllers/goalController.js';

const router = express.Router();

// Get all goals
router.get('/', authMiddleware, getGoals);

// Get a single goal
router.get('/:id', authMiddleware, getGoalById);

// Create a new goal
router.post(
  '/',
  [
    authMiddleware,
    check('title', 'Title is required').notEmpty(),
    check('targetAmount', 'Target amount must be a positive number').isFloat({
      gt: 0,
    }),
    check('targetDate', 'Target date must be a valid date')
      .optional()
      .isISO8601(),
  ],
  createGoal,
);

// Update a goal
router.put(
  '/:id',
  [
    authMiddleware,
    check('title', 'Title must not be empty').optional().notEmpty(),
    check('targetAmount', 'Target amount must be a positive number')
      .optional()
      .isFloat({ gt: 0 }),
    check('targetDate', 'Target date must be a valid date')
      .optional()
      .isISO8601(),
  ],
  updateGoal,
);

// Delete a goal
router.delete('/:id', authMiddleware, deleteGoal);

// Contribute to a goal
router.post(
  '/:id/contribute',
  [
    authMiddleware,
    check('amount', 'Amount must be a positive number').isFloat({ gt: 0 }),
  ],
  contributeToGoal,
);

export default router;
