// Import required modules and models
import User from '../models/User.js';
import Transaction from '../models/Transaction.js';
import { validationResult } from 'express-validator';
import { checkAchievements } from '../services/gamificationService.js';
import plaid from 'plaid';

// Initialize Plaid client
const plaidClient = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments[process.env.PLAID_ENV],
  options: {
    version: '2019-05-29',
  },
});

/**
 * @desc    Link a bank account using Plaid
 * @route   POST /api/banks/link
 * @access  Private
 */
export const linkBankAccount = async (req, res) => {
  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ success: false, errors: errors.array() });
  }

  const { publicToken } = req.body;

  try {
    // Exchange public token for access token
    const response = await plaidClient.exchangePublicToken(publicToken);
    const { access_token: accessToken, item_id: itemId } = response;

    // Save access token and item ID to user document
    await User.findByIdAndUpdate(
      req.user.id,
      {
        plaidAccessToken: accessToken,
        plaidItemId: itemId,
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Bank account linked successfully' });

    // Check achievements asynchronously
    checkAchievements(req.user.id).catch((err) => {
      console.error('Error checking achievements:', err.message);
    });
  } catch (error) {
    console.error('Error linking bank account:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Error linking bank account' });
  }
};

/**
 * @desc    Get Bank Accounts
 * @route   GET /api/banks/accounts
 * @access  Private
 */
export const getAccounts = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const accessToken = user.plaidAccessToken;

    if (!accessToken) {
      return res.status(400).json({ success: false, message: 'No bank account linked' });
    }

    const response = await plaidClient.getAccounts(accessToken);

    res.status(200).json({ success: true, data: response.accounts });
  } catch (error) {
    console.error('Error fetching accounts:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Error fetching accounts' });
  }
};

/**
 * @desc    Sync Transactions from linked bank accounts
 * @route   GET /api/banks/transactions
 * @access  Private
 */
export const syncBankTransactions = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);
    const accessToken = user.plaidAccessToken;

    if (!accessToken) {
      return res.status(400).json({ success: false, message: 'No bank account linked' });
    }

    // Set the date range for transactions
    const startDate = req.query.startDate || '2021-01-01'; // Default start date
    const endDate = req.query.endDate || new Date().toISOString().split('T')[0]; // Today

    let transactions = [];
    let response;
    let cursor = null;

    // Fetch transactions using Plaid Sync API (beta) or use pagination
    do {
      response = await plaidClient.getTransactions(accessToken, startDate, endDate, {
        offset: transactions.length,
        count: 500,
      });

      transactions = transactions.concat(response.transactions);
    } while (transactions.length < response.total_transactions);

    // Map and save transactions to your database
    for (const txn of transactions) {
      const existingTransaction = await Transaction.findOne({ plaidTransactionId: txn.transaction_id });

      if (!existingTransaction) {
        const newTransaction = new Transaction({
          user: req.user.id,
          amount: Math.abs(txn.amount),
          date: txn.date,
          name: txn.name,
          category: txn.category ? txn.category[0] : 'Uncategorized',
          type: txn.amount < 0 ? 'expense' : 'income',
          plaidTransactionId: txn.transaction_id,
          accountName: txn.account_name,
          note: txn.pending ? 'Pending' : '',
        });

        await newTransaction.save();
      }
    }

    res.status(200).json({ success: true, message: 'Bank transactions synced successfully' });

    // Check achievements asynchronously
    checkAchievements(req.user.id).catch((err) => {
      console.error('Error checking achievements:', err.message);
    });
  } catch (error) {
    console.error('Error syncing bank transactions:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Error syncing bank transactions' });
  }
};

/**
 * @desc    Unlink bank account
 * @route   POST /api/banks/unlink
 * @access  Private
 */
export const unlinkBankAccount = async (req, res) => {
  try {
    // Remove Plaid access token and item ID from user document
    await User.findByIdAndUpdate(
      req.user.id,
      {
        $unset: {
          plaidAccessToken: '',
          plaidItemId: '',
        },
      },
      { new: true }
    );

    res.status(200).json({ success: true, message: 'Bank account unlinked successfully' });
  } catch (error) {
    console.error('Error unlinking bank account:', error.response?.data || error.message);
    res.status(500).json({ success: false, message: 'Error unlinking bank account' });
  }
};