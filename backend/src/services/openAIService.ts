import { Configuration, OpenAIApi } from 'openai';

const configuration = new Configuration({
  apiKey: process.env.OPENAI_API_KEY,
});
const openai = new OpenAIApi(configuration);

export const getFinancialAdvice = async (query: string) => {
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Provide financial advice for the following query: ${query}`,
      max_tokens: 150,
      n: 1,
      stop: null,
      temperature: 0.7,
    });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error getting financial advice from OpenAI:', error);
    throw error;
  }
};

export const analyzeInvestment = async (stockSymbol: string) => {
  try {
    const response = await openai.createCompletion({
      model: 'text-davinci-003',
      prompt: `Analyze the investment potential of ${stockSymbol} stock. Provide a detailed analysis including current market trends, potential risks, and growth opportunities.`,
      max_tokens: 300,
      n: 1,
      stop: null,
      temperature: 0.7,
    });
    return response.data.choices[0].text.trim();
  } catch (error) {
    console.error('Error analyzing investment with OpenAI:', error);
    throw error;
  }
};
