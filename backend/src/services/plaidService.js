import plaid from 'plaid';
import Transaction from '../models/Transaction.js';
import Account from '../models/Account.js';

const client = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments[process.env.PLAID_ENV],
});

/**
 * Fetch transactions from Plaid
 * @param {String} userId - User ID
 * @param {String} accessToken - Plaid access token
 */
export const fetchPlaidTransactions = async (userId, accessToken) => {
  try {
    const startDate = '2020-01-01';
    const endDate = new Date().toISOString().split('T')[0];

    const response = await client.getTransactions(accessToken, startDate, endDate, {
      count: 500,
      offset: 0,
    });

    const transactions = response.transactions;

    for (const txn of transactions) {
      // Map Plaid transaction data to your Transaction model
      const newTransaction = new Transaction({
        user: userId,
        account: await mapPlaidAccountToAccount(userId, txn.account_id),
        type: txn.amount < 0 ? 'expense' : 'income',
        amount: Math.abs(txn.amount),
        currency: txn.iso_currency_code || 'USD',
        category: txn.category ? txn.category[0] : 'Uncategorized',
        date: new Date(txn.date),
        description: txn.name,
        tags: txn.category,
        location: {
          type: 'Point',
          coordinates: [txn.location.lon, txn.location.lat],
        },
      });

      await newTransaction.save();
    }
  } catch (error) {
    console.error('Error fetching Plaid transactions:', error.message);
  }
};

/**
 * Map Plaid account ID to your Account model
 * @param {String} userId - User ID
 * @param {String} plaidAccountId - Plaid account ID
 * @returns {ObjectId} - Account ID in your system
 */
const mapPlaidAccountToAccount = async (userId, plaidAccountId) => {
  const account = await Account.findOne({
    user: userId,
    plaidAccountId: plaidAccountId,
  }).lean();

  if (account) {
    return account._id;
  } else {
    // Handle account not found
    throw new Error('Account not found for Plaid account ID');
  }
};
