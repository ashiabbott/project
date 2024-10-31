// src/controllers/budgetController.js

import { validationResult } from 'express-validator';
import Budget from '../models/Budget.js';
import Transaction from '../models/Transaction.js';
import { checkAchievements } from '../services/gamificationService.js';

/**
 * @desc    Get all budgets for the authenticated user
 * @route   GET /api/budgets
 * @access  Private
 */
export const getAllBudgets = async (req, res) => {
  try {
    const budgets = await Budget.find({ user: req.user.id })
      .sort({ month: -1 })
      .lean();

    res.status(200).json({ success: true, data: budgets });
  } catch (err) {
    console.error('Error fetching budgets:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get budget for a specific month
 * @route   GET /api/budgets/:month
 * @access  Private
 */
export const getBudgetByMonth = async (req, res) => {
  const { month } = req.params;

  try {
    const budget = await Budget.findOne({ user: req.user.id, month });

    if (!budget) {
      return res
        .status(404)
        .json({
          success: false,
          message: 'Budget not found for the specified month',
        });
    }

    res.status(200).json({ success: true, data: budget });
  } catch (err) {
    console.error('Error fetching budget:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Create a new budget
 * @route   POST /api/budgets
 * @access  Private
 */
export const createBudget = async (req, res) => {
  // Validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { month, year, totalBudget, categories } = req.body;

  try {
    // Check if a budget already exists for the month and year
    const existingBudget = await Budget.findOne({ user: req.user.id, month, year });
    if (existingBudget) {
      return res
        .status(400)
        .json({
          success: false,
          message: 'Budget already exists for this month and year',
        });
    }

    const budget = new Budget({
      user: req.user.id,
      month,
      year,
      totalBudget,
      categories,
    });

    await budget.save();

    res.status(201).json({ success: true, data: budget });

    // Trigger achievement check asynchronously
    checkAchievements(req.user.id).catch(err => {
      console.error('Error checking achievements:', err.message);
    });
  } catch (err) {
    console.error('Error creating budget:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Update an existing budget
 * @route   PUT /api/budgets/:id
 * @access  Private
 */
export const updateBudget = async (req, res) => {
  const { id } = req.params;

  // Validate the request
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { totalBudget, categories } = req.body;

  try {
    // Check if the budget exists and belongs to the user
    const budget = await Budget.findOne({ _id: id, user: req.user.id });
    if (!budget) {
      return res
        .status(404)
        .json({ success: false, message: 'Budget not found' });
    }

    // Update budget fields
    if (totalBudget !== undefined) budget.totalBudget = totalBudget;
    if (categories) budget.categories = categories;

    await budget.save();

    res.status(200).json({ success: true, data: budget });

    // Trigger achievement check asynchronously
    checkAchievements(req.user.id).catch(err => {
      console.error('Error checking achievements:', err.message);
    });
  } catch (err) {
    console.error('Error updating budget:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Delete a budget by ID
 * @route   DELETE /api/budgets/:id
 * @access  Private
 */
export const deleteBudgetById = async (req, res) => {
  const { id } = req.params;

  try {
    // Check if the budget exists and belongs to the user
    const budget = await Budget.findOne({ _id: id, user: req.user.id });
    if (!budget) {
      return res
        .status(404)
        .json({ success: false, message: 'Budget not found' });
    }

    await budget.remove();

    res
      .status(200)
      .json({ success: true, message: 'Budget deleted successfully' });

    // Trigger achievement check asynchronously
    checkAchievements(req.user.id).catch(err => {
      console.error('Error checking achievements:', err.message);
    });
  } catch (err) {
    console.error('Error deleting budget:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get budget summary for a specific month
 * @route   GET /api/budgets/:month/summary
 * @access  Private
 */
export const getBudgetSummaryByMonth = async (req, res) => {
  const { month } = req.params;

  try {
    const budget = await Budget.findOne({ user: req.user.id, month });

    if (!budget) {
      return res
        .status(404)
        .json({
          success: false,
          message: 'Budget not found for the specified month',
        });
    }

    // Get transactions for the month
    const transactions = await Transaction.find({
      user: req.user.id,
      date: {
        $gte: new Date(`${month}-01`),
        $lte: new Date(`${month}-31`),
      },
    });

    // Calculate expenses per category
    const expensesByCategory = {};
    for (const transaction of transactions) {
      if (transaction.type === 'expense') {
        const category = transaction.category || 'Uncategorized';
        expensesByCategory[category] =
          (expensesByCategory[category] || 0) + transaction.amount;
      }
    }

    // Prepare summary data
    const summary = {
      totalBudget: budget.totalBudget,
      totalSpent: 0,
      categories: [],
    };

    for (const category of budget.categories) {
      const spent = expensesByCategory[category.name] || 0;
      summary.totalSpent += spent;

      summary.categories.push({
        name: category.name,
        allocated: category.allocatedAmount,
        spent,
        remaining: category.allocatedAmount - spent,
      });
    }

    // Add uncategorized expenses
    const uncategorizedSpent = expensesByCategory['Uncategorized'] || 0;
    if (uncategorizedSpent > 0) {
      summary.totalSpent += uncategorizedSpent;
      summary.categories.push({
        name: 'Uncategorized',
        allocated: 0,
        spent: uncategorizedSpent,
        remaining: -uncategorizedSpent,
      });
    }

    summary.remainingBudget = summary.totalBudget - summary.totalSpent;

    res.status(200).json({ success: true, data: summary });
  } catch (err) {
    console.error('Error fetching budget summary:', err.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get budget for a specific year and month
 * @route   GET /api/budgets/:year/:month
 * @access  Private
 */
export const getBudgetByYearAndMonth = async (req, res) => {
  const { year, month } = req.params;

  try {
    const budget = await Budget.findOne({ user: req.user.id, year, month });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    console.error('Error fetching budget:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Create or update budget for a specific year and month
 * @route   POST /api/budgets/:year/:month
 * @access  Private
 */
export const setBudgetByYearAndMonth = async (req, res) => {
  const { year, month } = req.params;
  const { categories, totalBudget } = req.body;

  try {
    let budget = await Budget.findOne({ user: req.user.id, year, month });

    if (budget) {
      // Update existing budget
      budget.categories = categories;
      budget.totalBudget = totalBudget;
    } else {
      // Create new budget
      budget = new Budget({
        user: req.user.id,
        year,
        month,
        totalBudget,
        categories,
      });
    }

    // Recalculate totals
    budget.totalAllocated = categories.reduce((sum, cat) => sum + cat.allocatedAmount, 0);

    await budget.save();

    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    console.error('Error setting budget:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get detailed budget summary including actual spending
 * @route   GET /api/budgets/:year/:month/summary
 * @access  Private
 */
export const getDetailedBudgetSummary = async (req, res) => {
  const { year, month } = req.params;

  try {
    const budget = await Budget.findOne({ user: req.user.id, year, month });

    if (!budget) {
      return res.status(404).json({ success: false, message: 'Budget not found' });
    }

    // Get transactions for the month
    const transactions = await Transaction.find({
      user: req.user.id,
      type: 'expense',
      date: {
        $gte: new Date(year, month - 1, 1),
        $lt: new Date(year, month, 1),
      },
    });

    // Calculate spent amounts
    const spentByCategory = {};
    transactions.forEach(txn => {
      spentByCategory[txn.category] = (spentByCategory[txn.category] || 0) + txn.amount;
    });

    // Update budget spent amounts
    budget.categories.forEach(cat => {
      cat.spentAmount = spentByCategory[cat.name] || 0;
    });

    budget.totalSpent = transactions.reduce((sum, txn) => sum + txn.amount, 0);
    budget.remainingBudget = budget.totalBudget - budget.totalSpent;

    res.status(200).json({ success: true, data: budget });
  } catch (error) {
    console.error('Error fetching detailed budget summary:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
