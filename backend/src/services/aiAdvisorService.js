require('dotenv').config();
const { Configuration, OpenAIApi } = require('openai');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const User = require('../models/User');
const Investment = require('../models/Investment');
const { formatFinancialData } = require('../utils/formatter');

// Initialize OpenAI
const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

/**
 * Generate personalized financial advice based on user's data and query
 * @param {String} userId - User ID
 * @param {String} query - User's query
 * @returns {Promise<String>} - Financial advice
 */
exports.getFinancialAdvice = async (userId, query) => {
  try {
    // Fetch user financial data
    const transactions = await Transaction.find({ user: userId }).lean();
    const budgets = await Budget.find({ user: userId }).lean();
    const goals = await Goal.find({ user: userId }).lean();
    const investments = await Investment.find({ user: userId }).lean();
    const user = await User.findById(userId).lean();

    // Format data for prompt
    const dataSummary = formatFinancialData({
      user,
      transactions,
      budgets,
      goals,
      investments,
    });

    // Create a comprehensive prompt
    const prompt = `
You are a highly intelligent and analytical financial advisor AI assistant.
Use the following user's financial data to provide personalized advice.

Data Summary:
${dataSummary}

User's Question:
"${query}"

Provide a detailed, empathetic, and actionable response to help the user improve their financial situation.
If appropriate, suggest specific strategies for budgeting, saving, investing, or debt reduction.
Use clear language and explain any financial concepts that the user might not understand.

Response:
`;

    // Call OpenAI API with the prompt
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 500,
      temperature: 0.7,
      n: 1,
      stop: null,
    });

    const advice = response.data.choices[0].text.trim();

    // Optionally, save the advice to the database or user's history

    return advice;
  } catch (error) {
    console.error('Error in getFinancialAdvice:', error.message);
    throw new Error('Unable to generate financial advice at this time.');
  }
};

/**
 * Analyze an investment opportunity
 * @param {String} stockSymbol - Stock symbol to analyze
 * @returns {Promise<String>} - Investment analysis
 */
exports.analyzeInvestment = async (userId, stockSymbol) => {
  try {
    // Fetch user's investment preferences or risk profile if available
    const user = await User.findById(userId).lean();

    // Create a prompt with the stock symbol and user's risk profile
    const prompt = `
You are a financial analyst AI assistant.

User's Risk Profile: ${user.riskProfile || 'Moderate'}

Analyze the investment potential of the stock symbol "${stockSymbol}" considering the current market conditions, company performance, financial statements, and potential risks.

Provide a detailed analysis that includes:
- Company overview
- Financial health
- Market trends
- Potential risks and rewards
- Suitability for an investor with a ${user.riskProfile || 'Moderate'} risk tolerance

Your analysis should help the user make an informed decision.

Response:
`;

    // Use the OpenAI API to get the analysis
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: prompt,
      max_tokens: 750,
      temperature: 0.7,
      n: 1,
      stop: null,
    });

    const analysis = response.data.choices[0].text.trim();

    // Optionally, save the analysis to the database or user's history

    return analysis;
  } catch (error) {
    console.error('Error in analyzeInvestment:', error.message);
    throw new Error('Unable to analyze the investment at this time.');
  }
};
