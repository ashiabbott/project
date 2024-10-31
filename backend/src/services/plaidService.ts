import { Configuration, PlaidApi, PlaidEnvironments } from 'plaid';

const configuration = new Configuration({
  basePath: PlaidEnvironments.sandbox,
  baseOptions: {
    headers: {
      'PLAID-CLIENT-ID': process.env.PLAID_CLIENT_ID,
      'PLAID-SECRET': process.env.PLAID_SECRET,
    },
  },
});

const plaidClient = new PlaidApi(configuration);

export const createLinkToken = async () => {
  try {
    const response = await plaidClient.linkTokenCreate({
      user: { client_user_id: 'user-id' },
      client_name: 'Financial Management App',
      products: ['transactions'],
      country_codes: ['US'],
      language: 'en',
    });
    return response.data.link_token;
  } catch (error) {
    console.error('Error creating link token:', error);
    throw error;
  }
};

export const getTransactions = async (accessToken: string) => {
  try {
    const response = await plaidClient.transactionsGet({
      access_token: accessToken,
      start_date: '2023-01-01',
      end_date: '2023-12-31',
    });
    return response.data.transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    throw error;
  }
};
