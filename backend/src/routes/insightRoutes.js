import express from 'express';
import { getFinancialInsights } from '../controllers/insightController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

/**
 * @route   GET /api/insights
 * @desc    Get financial insights for the user
 * @access  Private
 */
router.get('/', getFinancialInsights);

export default router;
