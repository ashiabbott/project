import axios from 'axios';

const API_BASE_URL = 'https://api.yourfinanceapp.com';

export interface BankAccount {
  id: string;
  name: string;
  type: string;
  balance: number;
}

export interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
}

export const connectBank = async (
  bankId: string,
  credentials: any,
): Promise<boolean> => {
  try {
    const response = await axios.post(`${API_BASE_URL}/connect-bank`, {
      bankId,
      credentials,
    });
    return response.data.success;
  } catch (error) {
    console.error('Error connecting to bank:', error);
    return false;
  }
};

export const fetchAccounts = async (userId: string): Promise<BankAccount[]> => {
  try {
    const response = await axios.get(`${API_BASE_URL}/accounts/${userId}`);
    return response.data.accounts;
  } catch (error) {
    console.error('Error fetching accounts:', error);
    return [];
  }
};

export const fetchTransactions = async (
  userId: string,
  accountId: string,
): Promise<Transaction[]> => {
  try {
    const response = await axios.get(
      `${API_BASE_URL}/transactions/${userId}/${accountId}`,
    );
    return response.data.transactions;
  } catch (error) {
    console.error('Error fetching transactions:', error);
    return [];
  }
};
