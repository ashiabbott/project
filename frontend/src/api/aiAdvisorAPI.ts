import axios from 'axios';

export interface Insight {
  id: string;
  title: string;
  description: string;
  type: 'info' | 'warning' | 'success' | 'error';
}

export const fetchFinancialInsights = async (): Promise<Insight[]> => {
  const response = await axios.get<Insight[]>('/api/ai/insights');
  return response.data;
};

export const getFinancialAdvice = async (query: string): Promise<string> => {
  const response = await axios.post('/api/ai/advice', { query });
  return response.data.advice;
};
