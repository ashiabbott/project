import { generateFinancialInsights } from '../services/insightService.js';

/**
 * @desc    Get financial insights for the user
 * @route   GET /api/insights
 * @access  Private
 */
export const getFinancialInsights = async (req, res) => {
  try {
    const insights = await generateFinancialInsights(req.user.id);

    res.status(200).json({ success: true, data: insights });
  } catch (error) {
    console.error('Error fetching financial insights:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};
