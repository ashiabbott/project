import Transaction from '../models/Transaction.js';
import User from '../models/User.js';

/**
 * Update user's budget based on transactions
 * @param {String} userId - User ID
 */
export const updateUserBudget = async (userId) => {
  try {
    const expenses = await Transaction.aggregate([
      { $match: { user: userId, type: 'expense' } },
      {
        $group: {
          _id: null,
          totalExpenses: { $sum: '$amount' },
        },
      },
    ]);

    const income = await Transaction.aggregate([
      { $match: { user: userId, type: 'income' } },
      {
        $group: {
          _id: null,
          totalIncome: { $sum: '$amount' },
        },
      },
    ]);

    const totalExpenses = expenses[0]?.totalExpenses || 0;
    const totalIncome = income[0]?.totalIncome || 0;
    const netIncome = totalIncome - totalExpenses;

    // Update user's budget summary
    await User.findByIdAndUpdate(userId, { netIncome, totalExpenses, totalIncome });
  } catch (error) {
    console.error('Error updating budget:', error.message);
  }
};
