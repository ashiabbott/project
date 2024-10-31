import { YodleeAPI } from 'yodlee-node';

const yodleeApi = new YodleeAPI({
  clientId: process.env.YODLEE_CLIENT_ID,
  secret: process.env.YODLEE_SECRET,
  apiUrl: process.env.YODLEE_API_URL,
});

export const getAccounts = async (userSessionToken: string) => {
  try {
    const accounts = await yodleeApi.getAccounts(userSessionToken);
    return accounts;
  } catch (error) {
    console.error('Error fetching Yodlee accounts:', error);
    throw error;
  }
};

export const getTransactions = async (userSessionToken: string) => {
  try {
    const transactions = await yodleeApi.getTransactions(userSessionToken);
    return transactions;
  } catch (error) {
    console.error('Error fetching Yodlee transactions:', error);
    throw error;
  }
};
