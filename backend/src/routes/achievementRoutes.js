import express from 'express';
import { check } from 'express-validator';
import authMiddleware from '../middleware/auth.js';
import adminMiddleware from '../middleware/admin.js';
import {
  getAchievements,
  getAchievementById,
  createAchievement,
  updateAchievement,
  deleteAchievement,
  getUserAchievements,
} from '../controllers/achievementController.js';

const router = express.Router();

// Public routes
router.get('/', getAchievements);
router.get('/:id', getAchievementById);

// User achievements
router.get('/user', authMiddleware, getUserAchievements);

// Admin routes
router.post(
  '/',
  [
    authMiddleware,
    adminMiddleware,
    check('name', 'Name is required').notEmpty(),
    check('description', 'Description is required').notEmpty(),
    check('criteria', 'Criteria is required').notEmpty(),
    // Additional validation for criteria structure can be added here
  ],
  createAchievement,
);

router.put(
  '/:id',
  [
    authMiddleware,
    adminMiddleware,
    check('name', 'Name is required').optional().notEmpty(),
    check('description', 'Description is required').optional().notEmpty(),
    check('criteria', 'Criteria is required').optional().notEmpty(),
  ],
  updateAchievement,
);

router.delete('/:id', authMiddleware, adminMiddleware, deleteAchievement);

export default router;
