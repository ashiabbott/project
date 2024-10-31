import express from 'express';
import { check } from 'express-validator';
import authMiddleware from '../middleware/auth.js';
import {
  linkBankAccount,
  getAccounts,
  syncBankTransactions,
  unlinkBankAccount,
} from '../controllers/bankController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * @route   POST /api/banks/link
 * @desc    Link a bank account using Plaid
 * @access  Private
 */
router.post(
  '/link',
  [
    check('publicToken', 'Public token is required').notEmpty(),
  ],
  linkBankAccount
);

/**
 * @route   GET /api/banks/accounts
 * @desc    Get bank accounts
 * @access  Private
 */
router.get('/accounts', getAccounts);

/**
 * @route   GET /api/banks/transactions
 * @desc    Sync transactions from linked bank accounts
 * @access  Private
 */
router.get('/transactions', syncBankTransactions);

/**
 * @route   POST /api/banks/unlink
 * @desc    Unlink bank account
 * @access  Private
 */
router.post('/unlink', unlinkBankAccount);

export default router;
