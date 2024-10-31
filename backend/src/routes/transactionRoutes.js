import express from 'express';
import { check } from 'express-validator';
import {
  getTransactions,
  getTransactionById,
  createTransaction,
  updateTransaction,
  deleteTransaction,
  getTransactionAnalytics,
} from '../controllers/transactionController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

/**
 * @route   GET /api/transactions
 * @desc    Get all transactions
 * @access  Private
 */
router.get('/', getTransactions);

/**
 * @route   GET /api/transactions/analytics
 * @desc    Get transactions analytics
 * @access  Private
 */
router.get('/analytics', getTransactionAnalytics);

/**
 * @route   GET /api/transactions/:id
 * @desc    Get a single transaction
 * @access  Private
 */
router.get('/:id', getTransactionById);

/**
 * @route   POST /api/transactions
 * @desc    Create a new transaction
 * @access  Private
 */
router.post(
  '/',
  [
    check('account', 'Account is required').notEmpty(),
    check('type', 'Type is required').notEmpty(),
    check('amount', 'Amount must be a number').isNumeric(),
    check('category', 'Category is required').notEmpty(),
    check('date', 'Date is invalid').optional().isISO8601(),
    check('currency', 'Currency must be a valid 3-letter code')
      .optional()
      .isLength({ min: 3, max: 3 })
      .isUppercase(),
    check('isRecurring', 'isRecurring must be a boolean').optional().isBoolean(),
    check('recurrenceInterval', 'Invalid recurrence interval')
      .optional()
      .isIn(['daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly']),
    check('endDate', 'End date is invalid').optional().isISO8601(),
  ],
  createTransaction
);

/**
 * @route   PUT /api/transactions/:id
 * @desc    Update an existing transaction
 * @access  Private
 */
router.put(
  '/:id',
  [
    check('amount', 'Amount must be a number').optional().isNumeric(),
    check('date', 'Date is invalid').optional().isISO8601(),
    check('currency', 'Currency must be a valid 3-letter code')
      .optional()
      .isLength({ min: 3, max: 3 })
      .isUppercase(),
    check('isRecurring', 'isRecurring must be a boolean').optional().isBoolean(),
    check('recurrenceInterval', 'Invalid recurrence interval')
      .optional()
      .isIn(['daily', 'weekly', 'bi-weekly', 'monthly', 'quarterly', 'yearly']),
    check('endDate', 'End date is invalid').optional().isISO8601(),
  ],
  updateTransaction
);

/**
 * @route   DELETE /api/transactions/:id
 * @desc    Delete a transaction
 * @access  Private
 */
router.delete('/:id', deleteTransaction);

export default router;
