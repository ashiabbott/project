import Investment from '../models/Investment.js';
import User from '../models/User.js';

/**
 * Update user's portfolio summary
 * @param {String} userId - User ID
 */
export const updateUserPortfolio = async (userId) => {
  try {
    const investments = await Investment.find({ user: userId });

    let totalInvestmentValue = 0;
    investments.forEach((investment) => {
      totalInvestmentValue += investment.totalValue;
    });

    // Update user's total investment value
    await User.findByIdAndUpdate(userId, { totalInvestmentValue });
  } catch (error) {
    console.error('Error updating portfolio:', error.message);
  }
};
