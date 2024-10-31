import express from 'express';
import { getAnalyticsData } from '../controllers/analyticsController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

router.use(auth);

// @route   GET /api/analytics
// @desc    Get analytics data
// @access  Private
router.get('/', getAnalyticsData);

export default router;
