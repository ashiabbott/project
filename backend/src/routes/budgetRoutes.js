// src/routes/budgetRoutes.js

import express from 'express';
import { check } from 'express-validator';
import authMiddleware from '../middleware/auth.js';
import {
  getAllBudgets,
  getBudgetByMonth,
  createBudget,
  updateBudget,
  deleteBudgetById, // Updated import
} from '../controllers/budgetController.js';

const router = express.Router();

// Apply rate limiting and authentication middleware if necessary
// For example, using apiLimiter middleware from rateLimiter.js
// router.use(apiLimiter);

// GET /api/budgets - Get all budgets
router.get('/', authMiddleware, getAllBudgets);

// GET /api/budgets/:month - Get budget for a specific month
router.get('/:month', authMiddleware, getBudgetByMonth);

// POST /api/budgets - Create a new budget
router.post(
  '/',
  authMiddleware,
  [
    check('month', 'Month is required').notEmpty(),
    check('year', 'Year is required').notEmpty(),
    check('totalBudget', 'Total budget must be a number').isNumeric(),
    check('categories', 'Categories must be an array').isArray(),
    check('categories.*.name', 'Category name is required').notEmpty(),
    check('categories.*.allocatedAmount', 'Allocated amount must be a number').isNumeric(),
  ],
  createBudget,
);

// PUT /api/budgets/:id - Update a budget
router.put(
  '/:id',
  authMiddleware,
  [
    check('totalBudget', 'Total budget must be a number').optional().isNumeric(),
    check('categories', 'Categories must be an array').optional().isArray(),
    check('categories.*.name', 'Category name is required').optional().notEmpty(),
    check('categories.*.allocatedAmount', 'Allocated amount must be a number').optional().isNumeric(),
  ],
  updateBudget,
);

// DELETE /api/budgets/:id - Delete a budget
router.delete('/:id', authMiddleware, deleteBudgetById); // Updated route handler

export default router;
