import axios from 'axios';
import { Budget } from '../types';

export const fetchBudgetData = async (): Promise<Budget> => {
  try {
    const response = await axios.get<Budget>('/api/budget');
    return response.data;
  } catch (error) {
    throw error;
  }
};
