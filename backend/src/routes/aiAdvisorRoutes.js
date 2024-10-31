import express from 'express';
import { getFinancialAdvice } from '../controllers/aiAdvisorController.js';
import auth from '../middleware/auth.js';

const router = express.Router();

// Apply authentication middleware if required
router.use(auth);

// Define the route
/**
 * @route   POST /api/ai-advisor/advice
 * @desc    Get financial advice from AI
 * @access  Private
 */
router.post('/advice', getFinancialAdvice);

export default router;
