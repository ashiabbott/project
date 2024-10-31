const tf = require('@tensorflow/tfjs-node');
const Transaction = require('../models/Transaction');

const prepareData = transactions => {
  const data = transactions.map(t => ({
    amount: t.amount,
    dayOfWeek: new Date(t.date).getDay(),
    dayOfMonth: new Date(t.date).getDate(),
    month: new Date(t.date).getMonth() + 1, // Months are 0-indexed
  }));

  const inputs = data.map(d => [d.dayOfWeek, d.dayOfMonth, d.month]);
  const labels = data.map(d => d.amount);

  const inputTensor = tf.tensor2d(inputs);
  const labelTensor = tf.tensor2d(labels, [labels.length, 1]);

  return { inputTensor, labelTensor };
};

const createModel = () => {
  const model = tf.sequential();
  model.add(
    tf.layers.dense({ units: 64, activation: 'relu', inputShape: [3] }),
  );
  model.add(tf.layers.dense({ units: 32, activation: 'relu' }));
  model.add(tf.layers.dense({ units: 1 }));
  model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
  return model;
};

exports.predictFutureExpenses = async userId => {
  const transactions = await Transaction.find({
    user: userId,
    type: 'expense',
  }).sort({ date: 1 });

  if (transactions.length < 20) {
    throw new Error('Insufficient data for predictions.');
  }

  const { inputTensor, labelTensor } = prepareData(transactions);

  const model = createModel();
  await model.fit(inputTensor, labelTensor, {
    epochs: 50,
    validationSplit: 0.2,
    verbose: 0,
  });

  const futureDates = Array.from({ length: 30 }, (_, i) => {
    const date = new Date();
    date.setDate(date.getDate() + i + 1);
    return {
      dayOfWeek: date.getDay(),
      dayOfMonth: date.getDate(),
      month: date.getMonth() + 1,
      date: date,
    };
  });

  const futureInputs = futureDates.map(d => [
    d.dayOfWeek,
    d.dayOfMonth,
    d.month,
  ]);
  const futureTensor = tf.tensor2d(futureInputs);

  const predictionsTensor = model.predict(futureTensor);
  const predictions = await predictionsTensor.data();

  // Clean up tensors
  tf.dispose([inputTensor, labelTensor, futureTensor, predictionsTensor]);

  const result = futureDates.map((d, i) => ({
    date: d.date.toISOString().split('T')[0],
    predictedExpense: predictions[i],
  }));

  return result;
};

exports.analyzeSpendingPatterns = async userId => {
  const transactions = await Transaction.find({
    user: userId,
    type: 'expense',
  });

  const categoryTotals = transactions.reduce((acc, t) => {
    acc[t.category] = (acc[t.category] || 0) + t.amount;
    return acc;
  }, {});

  const topCategories = Object.entries(categoryTotals)
    .sort((a, b) => b[1] - a[1])
    .slice(0, 5)
    .map(([category, total]) => ({ category, total }));

  const weekdaySpending = transactions.reduce((acc, t) => {
    const dayOfWeek = new Date(t.date).getDay();
    acc[dayOfWeek] = (acc[dayOfWeek] || 0) + t.amount;
    return acc;
  }, {});

  return { topCategories, weekdaySpending };
};
