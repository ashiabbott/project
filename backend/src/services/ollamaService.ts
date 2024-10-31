import ollama from 'ollama';

export const getMarketInsights = async (query: string) => {
  try {
    const response = await ollama.run({
      model: 'financial',
      prompt: `Provide market insights for the following query: ${query}`,
    });
    return response.response;
  } catch (error) {
    console.error('Error getting market insights from Ollama:', error);
    throw error;
  }
};

export const predictMarketTrends = async (data: any) => {
  try {
    const response = await ollama.run({
      model: 'financial',
      prompt: `Analyze the following market data and predict future trends: ${JSON.stringify(data)}`,
    });
    return response.response;
  } catch (error) {
    console.error('Error predicting market trends with Ollama:', error);
    throw error;
  }
};
