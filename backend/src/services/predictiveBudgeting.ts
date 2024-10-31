import * as tf from '@tensorflow/tfjs';
import { Transaction } from './bankIntegration';

interface PredictedBudget {
  predictedIncome: number;
  predictedExpenses: number;
  categoryPredictions: { [category: string]: number };
}

const model = await tf.loadLayersModel(
  'https://yourfinanceapp.com/budget-model/model.json',
);

export const predictBudget = async (
  transactions: Transaction[],
): Promise<PredictedBudget> => {
  // Prepare data for the model
  const recentTransactions = transactions.slice(-30); // Use last 30 transactions
  const inputData = recentTransactions.map(t => [
    new Date(t.date).getTime(),
    t.amount,
    // Add more features as needed
  ]);

  const inputTensor = tf.tensor2d(inputData);
  const prediction = model.predict(inputTensor) as tf.Tensor;
  const predictionData = await prediction.data();

  // Process prediction data
  const predictedIncome = predictionData[0];
  const predictedExpenses = predictionData[1];
  const categoryPredictions = {
    groceries: predictionData[2],
    utilities: predictionData[3],
    entertainment: predictionData[4],
    // Add more categories as needed
  };

  return {
    predictedIncome,
    predictedExpenses,
    categoryPredictions,
  };
};
