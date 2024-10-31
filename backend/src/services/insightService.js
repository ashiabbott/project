const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const User = require('../models/User');
import { Configuration, OpenAIApi } from 'openai';
import Investment from '../models/Investment.js';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});

const openaiClient = new OpenAIApi(configuration);

/**
 * Generate financial insights for the user
 * @param {String} userId - User ID
 */
export const generateFinancialInsights = async (userId) => {
  try {
    const transactions = await Transaction.find({ user: userId })
      .sort({ date: -1 })
      .limit(100)
      .lean();

    const totalExpenses = transactions
      .filter((txn) => txn.type === 'expense')
      .reduce((sum, txn) => sum + txn.amount, 0);

    const topCategories = transactions
      .filter((txn) => txn.type === 'expense')
      .reduce((acc, txn) => {
        acc[txn.category] = (acc[txn.category] || 0) + txn.amount;
        return acc;
      }, {});

    const topCategory = Object.entries(topCategories).sort((a, b) => b[1] - a[1])[0][0];

    const investments = await Investment.find({ user: userId }).lean();

    const totalInvestmentValue = investments.reduce(
      (sum, investment) => sum + investment.totalValue,
      0
    );

    // Prepare prompt for AI
    const prompt = `As a financial advisor, analyze the following data and provide insights:

    - Total expenses in the last period: $${totalExpenses.toFixed(2)}
    - Top spending category: ${topCategory}
    - Total investment value: $${totalInvestmentValue.toFixed(2)}

    Provide suggestions for budgeting, saving, and investing.`;

    // Generate AI response
    const response = await openaiClient.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.7,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating financial insights:', error.message);
    throw new Error('Failed to generate financial insights');
  }
};

exports.generateInsights = async userId => {
  const user = await User.findById(userId);
  const transactions = await Transaction.find({ user: userId });
  const budget = await Budget.findOne({ user: userId }).sort({ month: -1 });
  const goals = await Goal.find({ user: userId });

  const insights = [];

  // Check for unusual spending
  const recentTransactions = transactions.filter(
    t => new Date(t.date) >= new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
  );
  const averageSpending =
    transactions.reduce(
      (sum, t) => sum + (t.type === 'expense' ? t.amount : 0),
      0,
    ) / transactions.length;
  const recentSpending = recentTransactions.reduce(
    (sum, t) => sum + (t.type === 'expense' ? t.amount : 0),
    0,
  );
  if (recentSpending > averageSpending * 1.5) {
    insights.push(
      'Your spending has been higher than usual this week. Consider reviewing your recent expenses.',
    );
  }

  // Check budget categories
  if (budget) {
    budget.categories.forEach(category => {
      const spent = transactions
        .filter(
          t =>
            t.category === category.category &&
            new Date(t.date) >= new Date(budget.month),
        )
        .reduce((sum, t) => sum + t.amount, 0);
      if (spent > category.limit * 0.9) {
        insights.push(
          `You're close to exceeding your budget for ${category.category}. Try to limit spending in this category.`,
        );
      }
    });
  }

  // Check goal progress
  goals.forEach(goal => {
    const progress = goal.currentAmount / goal.targetAmount;
    if (progress > 0.9) {
      insights.push(
        `You're very close to achieving your goal: ${goal.name}. Keep it up!`,
      );
    } else if (progress < 0.1) {
      insights.push(
        `Your goal "${goal.name}" needs attention. Consider allocating more funds to reach it.`,
      );
    }
  });

  // Add insights to user
  for (let insight of insights) {
    await user.addInsight(insight);
  }

  return insights;
};
