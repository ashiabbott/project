import { validationResult } from 'express-validator';
import Transaction from '../models/Transaction.js';
import Account from '../models/Account.js';
import { checkAchievements } from '../services/gamificationService.js';
import { updateUserBudget } from '../services/budgetService.js';

/**
 * @desc    Get all transactions for the authenticated user
 * @route   GET /api/transactions
 * @access  Private
 */
export const getTransactions = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id })
      .sort({ date: -1 })
      .lean();

    res.status(200).json({ success: true, data: transactions });
  } catch (error) {
    console.error('Error fetching transactions:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get a single transaction by ID
 * @route   GET /api/transactions/:id
 * @access  Private
 */
export const getTransactionById = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findOne({
      _id: id,
      user: req.user.id,
    }).lean();

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    console.error('Error fetching transaction:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Create a new transaction
 * @route   POST /api/transactions
 * @access  Private
 */
export const createTransaction = async (req, res) => {
  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const {
    account,
    type,
    amount,
    currency,
    category,
    date,
    description,
    tags,
    isRecurring,
    recurrenceInterval,
    endDate,
    attachments,
    location,
    toAccount,
  } = req.body;

  try {
    // Ensure the account belongs to the user
    const userAccount = await Account.findOne({ _id: account, user: req.user.id });
    if (!userAccount) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    // For transfers, ensure the destination account is valid
    if (type === 'transfer') {
      if (!toAccount) {
        return res.status(400).json({ success: false, message: 'Destination account is required for transfers' });
      }
      const destinationAccount = await Account.findOne({ _id: toAccount, user: req.user.id });
      if (!destinationAccount) {
        return res.status(404).json({ success: false, message: 'Destination account not found' });
      }
    }

    const transaction = new Transaction({
      user: req.user.id,
      account,
      type,
      amount,
      currency,
      category,
      date,
      description,
      tags,
      isRecurring,
      recurrenceInterval,
      endDate,
      attachments,
      location,
      toAccount,
    });

    await transaction.save();

    // Update user's budget if necessary
    await updateUserBudget(req.user.id);

    // Check for achievements
    await checkAchievements(req.user.id);

    res.status(201).json({ success: true, data: transaction });
  } catch (error) {
    console.error('Error creating transaction:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Update an existing transaction
 * @route   PUT /api/transactions/:id
 * @access  Private
 */
export const updateTransaction = async (req, res) => {
  const { id } = req.params;
  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    let transaction = await Transaction.findOne({ _id: id, user: req.user.id });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    // Update fields
    transaction = Object.assign(transaction, req.body);
    await transaction.save();

    // Update user's budget if necessary
    await updateUserBudget(req.user.id);

    res.status(200).json({ success: true, data: transaction });
  } catch (error) {
    console.error('Error updating transaction:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Delete a transaction
 * @route   DELETE /api/transactions/:id
 * @access  Private
 */
export const deleteTransaction = async (req, res) => {
  const { id } = req.params;

  try {
    const transaction = await Transaction.findOne({ _id: id, user: req.user.id });

    if (!transaction) {
      return res.status(404).json({ success: false, message: 'Transaction not found' });
    }

    await transaction.remove();

    // Update user's budget if necessary
    await updateUserBudget(req.user.id);

    res.status(200).json({ success: true, message: 'Transaction deleted' });
  } catch (error) {
    console.error('Error deleting transaction:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get aggregated transactions data for analytics
 * @route   GET /api/transactions/analytics
 * @access  Private
 */
export const getTransactionAnalytics = async (req, res) => {
  try {
    const analytics = await Transaction.aggregate([
      { $match: { user: req.user._id } },
      {
        $group: {
          _id: '$category',
          totalAmount: { $sum: '$amount' },
          count: { $sum: 1 },
        },
      },
      { $sort: { totalAmount: -1 } },
    ]);

    res.status(200).json({ success: true, data: analytics });
  } catch (error) {
    console.error('Error fetching transaction analytics:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
