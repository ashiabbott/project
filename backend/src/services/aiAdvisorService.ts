import axios from 'axios';

const API_URL = process.env.REACT_APP_API_URL;

export const getAIAdvice = async () => {
  const response = await axios.get(`${API_URL}/ai-advice`);
  return response.data;
};

export const getFinancialProfile = async () => {
  const response = await axios.get(`${API_URL}/financial-profile`);
  return response.data;
};
