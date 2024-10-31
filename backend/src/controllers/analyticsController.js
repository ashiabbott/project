import Transaction from '../models/Transaction.js';

// @desc    Get analytics data
// @route   GET /api/analytics
// @access  Private
export const getAnalyticsData = async (req, res) => {
  try {
    const transactions = await Transaction.find({ user: req.user.id });

    // Perform analytics computations here
    const totalIncome = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpense = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    res.json({ totalIncome, totalExpense });
  } catch (err) {
    console.error(err.message);
    res.status(500).send('Server error');
  }
};
