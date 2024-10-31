import Account from '../models/Account.js';
import Transaction from '../models/Transaction.js';
import { validationResult } from 'express-validator';
import { checkAchievements } from '../services/gamificationService.js';

/**
 * @desc    Get all accounts for the authenticated user
 * @route   GET /api/accounts
 * @access  Private
 */
export const getAccounts = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user.id }).lean();

    res.status(200).json({ success: true, data: accounts });
  } catch (error) {
    console.error('Error fetching accounts:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get a single account by ID
 * @route   GET /api/accounts/:id
 * @access  Private
 */
export const getAccountById = async (req, res) => {
  const { id } = req.params;

  try {
    const account = await Account.findOne({
      _id: id,
      user: req.user.id,
    }).lean();

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    res.status(200).json({ success: true, data: account });
  } catch (error) {
    console.error('Error fetching account:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Create a new account
 * @route   POST /api/accounts
 * @access  Private
 */
export const createAccount = async (req, res) => {
  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const {
    institutionName,
    accountType,
    accountNumber,
    nickname,
    balance,
    currency,
    accountMeta,
  } = req.body;

  try {
    // Check if the account number already exists for the user
    const existingAccount = await Account.findOne({
      accountNumber,
      user: req.user.id,
    });

    if (existingAccount) {
      return res
        .status(400)
        .json({ success: false, message: 'Account with this number already exists' });
    }

    const account = new Account({
      user: req.user.id,
      institutionName,
      accountType,
      accountNumber,
      nickname,
      balance,
      currency,
      accountMeta,
    });

    await account.save();

    // Check for account-related achievements
    await checkAchievements(req.user.id);

    res.status(201).json({ success: true, data: account });
  } catch (error) {
    console.error('Error creating account:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Update an existing account
 * @route   PUT /api/accounts/:id
 * @access  Private
 */
export const updateAccount = async (req, res) => {
  const { id } = req.params;

  // Input validation
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  try {
    let account = await Account.findOne({ _id: id, user: req.user.id });

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    // Update fields
    account = Object.assign(account, req.body);
    await account.save();

    res.status(200).json({ success: true, data: account });
  } catch (error) {
    console.error('Error updating account:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Delete an account
 * @route   DELETE /api/accounts/:id
 * @access  Private
 */
export const deleteAccount = async (req, res) => {
  const { id } = req.params;

  try {
    const account = await Account.findOne({ _id: id, user: req.user.id });

    if (!account) {
      return res.status(404).json({ success: false, message: 'Account not found' });
    }

    await account.remove();

    res.status(200).json({ success: true, message: 'Account deleted' });
  } catch (error) {
    console.error('Error deleting account:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get account balance summary
 * @route   GET /api/accounts/summary
 * @access  Private
 */
export const getAccountSummary = async (req, res) => {
  try {
    const accounts = await Account.find({ user: req.user.id }).lean();

    const totalBalances = accounts.reduce((acc, account) => {
      acc[account.currency] = (acc[account.currency] || 0) + account.balance;
      return acc;
    }, {});

    res.status(200).json({ success: true, data: totalBalances });
  } catch (error) {
    console.error('Error fetching account summary:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
