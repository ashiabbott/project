import axios from 'axios';
import { getFinancialAdvice, analyzeInvestment } from '../services/aiAdvisorService.js';

/**
 * @desc    Provide financial advice based on the user's query
 * @route   POST /api/ai-advisor/advice
 * @access  Private
 */
export const provideFinancialAdvice = async (req, res) => {
  const { query } = req.body;

  if (!query) {
    return res.status(400).json({ success: false, message: 'Query is required.' });
  }

  try {
    const advice = await getFinancialAdvice(query);
    res.status(200).json({ success: true, data: advice });
  } catch (error) {
    console.error('Error getting financial advice:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

/**
 * @desc    Analyze an investment opportunity
 * @route   POST /api/ai-advisor/investment
 * @access  Private
 */
export const provideInvestmentAnalysis = async (req, res) => {
  const { stockSymbol } = req.body;

  if (!stockSymbol) {
    return res.status(400).json({ success: false, message: 'Stock symbol is required.' });
  }

  try {
    const analysis = await analyzeInvestment(stockSymbol);
    res.status(200).json({ success: true, data: analysis });
  } catch (error) {
    console.error('Error analyzing investment:', error.message);
    res.status(500).json({ success: false, message: 'Server error.' });
  }
};

export default {
  provideFinancialAdvice,
  provideInvestmentAnalysis,
};
