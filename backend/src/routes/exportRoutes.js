import express from 'express';
import { exportTransactions } from '../controllers/exportController.js';
import authMiddleware from '../middleware/auth.js';

const router = express.Router();

/**
 * @desc    Export transactions in various formats
 * @route   GET /api/export/transactions
 * @access  Private
 */
router.get('/transactions', authMiddleware, exportTransactions);

export default router;
