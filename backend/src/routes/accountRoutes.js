import express from 'express';
import { check } from 'express-validator';
import {
  getAccounts,
  getAccountById,
  createAccount,
  updateAccount,
  deleteAccount,
  getAccountSummary,
} from '../controllers/accountController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

/**
 * @route   GET /api/accounts
 * @desc    Get all accounts
 * @access  Private
 */
router.get('/', getAccounts);

/**
 * @route   GET /api/accounts/summary
 * @desc    Get account balance summary
 * @access  Private
 */
router.get('/summary', getAccountSummary);

/**
 * @route   GET /api/accounts/:id
 * @desc    Get a single account
 * @access  Private
 */
router.get('/:id', getAccountById);

/**
 * @route   POST /api/accounts
 * @desc    Create a new account
 * @access  Private
 */
router.post(
  '/',
  [
    check('institutionName', 'Institution name is required').notEmpty(),
    check('accountType', 'Account type is required').notEmpty(),
    check('accountNumber', 'Account number is required').notEmpty(),
    check('balance', 'Balance must be a number').optional().isNumeric(),
    check('currency', 'Currency must be a valid 3-letter code')
      .optional()
      .isLength({ min: 3, max: 3 })
      .isUppercase(),
  ],
  createAccount
);

/**
 * @route   PUT /api/accounts/:id
 * @desc    Update an existing account
 * @access  Private
 */
router.put(
  '/:id',
  [
    check('balance', 'Balance must be a number').optional().isNumeric(),
    check('currency', 'Currency must be a valid 3-letter code')
      .optional()
      .isLength({ min: 3, max: 3 })
      .isUppercase(),
  ],
  updateAccount
);

/**
 * @route   DELETE /api/accounts/:id
 * @desc    Delete an account
 * @access  Private
 */
router.delete('/:id', deleteAccount);

export default router;
