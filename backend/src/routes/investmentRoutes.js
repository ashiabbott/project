import express from 'express';
import { check } from 'express-validator';
import {
  getInvestments,
  getInvestmentById,
  createInvestment,
  updateInvestment,
  deleteInvestment,
  refreshInvestments,
} from '../controllers/investmentController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * @route   GET /api/investments
 * @desc    Get all investments
 * @access  Private
 */
router.get('/', getInvestments);

/**
 * @route   GET /api/investments/:id
 * @desc    Get a single investment
 * @access  Private
 */
router.get('/:id', getInvestmentById);

/**
 * @route   POST /api/investments
 * @desc    Create a new investment
 * @access  Private
 */
router.post(
  '/',
  [
    check('assetType', 'Asset type is required').notEmpty(),
    check('name', 'Name is required').notEmpty(),
    check('quantity', 'Quantity is required').isNumeric(),
    check('averagePurchasePrice', 'Average purchase price is required').isNumeric(),
  ],
  createInvestment
);

/**
 * @route   PUT /api/investments/:id
 * @desc    Update an investment
 * @access  Private
 */
router.put(
  '/:id',
  [
    check('quantity', 'Quantity must be a number').optional().isNumeric(),
    check('averagePurchasePrice', 'Average purchase price must be a number').optional().isNumeric(),
  ],
  updateInvestment
);

/**
 * @route   DELETE /api/investments/:id
 * @desc    Delete an investment
 * @access  Private
 */
router.delete('/:id', deleteInvestment);

/**
 * @route   PUT /api/investments/refresh
 * @desc    Refresh current prices of all investments
 * @access  Private
 */
router.put('/refresh', refreshInvestments);

export default router;
