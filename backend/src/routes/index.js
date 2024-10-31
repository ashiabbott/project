import express from 'express';
import authRoutes from './authRoutes.js';
import transactionRoutes from './transactionRoutes.js';
import budgetRoutes from './budgetRoutes.js';
import exportRoutes from './exportRoutes.js';
import achievementRoutes from './achievementRoutes.js';

const router = express.Router();

router.use('/auth', authRoutes);
router.use('/transactions', transactionRoutes);
router.use('/budgets', budgetRoutes);
router.use('/export', exportRoutes);
router.use('/achievements', achievementRoutes);

export default router;
