const { Configuration, OpenAIApi } = require('openai');
const Transaction = require('../models/Transaction');
const Budget = require('../models/Budget');
const Goal = require('../models/Goal');
const Investment = require('../models/Investment');

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

exports.generateResponse = async (userId, message) => {
  try {
    // Fetch user's financial data
    const transactions = await Transaction.find({ user: userId })
      .sort({ date: -1 })
      .limit(10);
    const budget = await Budget.findOne({ user: userId }).sort({ month: -1 });
    const goals = await Goal.find({ user: userId });
    const investments = await Investment.find({ user: userId });

    // Prepare context
    const context = `
      User's recent transactions: ${JSON.stringify(transactions)}
      User's current budget: ${JSON.stringify(budget)}
      User's financial goals: ${JSON.stringify(goals)}
      User's investments: ${JSON.stringify(investments)}
    `;

    const prompt = `
      You are a financial advisor AI assistant. Use the following context about the user's financial situation to provide personalized advice:
      
      ${context}
      
      User's question: ${message}
      
      Your response:
    `;

    const response = await openai.createCompletion({
      model: 'text-davinci-002',
      prompt: prompt,
      max_tokens: 200,
      n: 1,
      stop: null,
      temperature: 0.7,
    });

    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error generating chatbot response:', error);
    throw error;
  }
};
