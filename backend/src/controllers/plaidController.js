import plaid from 'plaid';
import Account from '../models/Account.js';

const client = new plaid.Client({
  clientID: process.env.PLAID_CLIENT_ID,
  secret: process.env.PLAID_SECRET,
  env: plaid.environments[process.env.PLAID_ENV],
});

/**
 * @desc    Link a bank account using Plaid
 * @route   POST /api/plaid/link
 * @access  Private
 */
export const linkBankAccount = async (req, res) => {
  const { publicToken } = req.body;

  try {
    const response = await client.exchangePublicToken(publicToken);
    const accessToken = response.access_token;
    const itemId = response.item_id;

    // Store accessToken securely
    // For demonstration purposes, we'll store it in the user's record
    req.user.plaidAccessToken = accessToken;
    req.user.plaidItemId = itemId;
    await req.user.save();

    // Fetch account details from Plaid
    const accountsResponse = await client.getAccounts(accessToken);
    const plaidAccounts = accountsResponse.accounts;

    // Map Plaid accounts to your Account model
    for (const plaidAccount of plaidAccounts) {
      const accountExists = await Account.findOne({
        user: req.user.id,
        plaidAccountId: plaidAccount.account_id,
      });

      if (!accountExists) {
        const newAccount = new Account({
          user: req.user.id,
          institutionName: plaidAccount.institution_name || 'Unknown Institution',
          accountType: plaidAccount.type,
          accountNumber: plaidAccount.mask || 'XXXX',
          nickname: plaidAccount.name,
          balance: plaidAccount.balances.current || 0,
          currency: plaidAccount.balances.iso_currency_code || 'USD',
          linkedPlaidAccountId: plaidAccount.account_id,
        });

        await newAccount.save();
      }
    }

    res.status(200).json({ success: true, message: 'Bank account linked successfully' });
  } catch (error) {
    console.error('Error linking bank account:', error.message);
    res.status(500).json({ success: false, message: 'Failed to link bank account' });
  }
};
