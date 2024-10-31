import cron from 'node-cron';
import Transaction from '../models/Transaction.js';

/**
 * Schedule recurring transactions
 */
export const scheduleRecurringTransactions = () => {
  // Run every day at midnight
  cron.schedule('0 0 * * *', async () => {
    try {
      const today = new Date();
      const recurringTransactions = await Transaction.find({
        isRecurring: true,
        nextRecurrence: { $lte: today },
      });

      for (const transaction of recurringTransactions) {
        // Create a new transaction based on the recurring one
        const newTransaction = new Transaction({
          user: transaction.user,
          account: transaction.account,
          type: transaction.type,
          amount: transaction.amount,
          currency: transaction.currency,
          category: transaction.category,
          date: today,
          description: transaction.description,
          tags: transaction.tags,
        });
        await newTransaction.save();

        // Update the nextRecurrence date
        transaction.nextRecurrence = calculateNextRecurrence(
          transaction.nextRecurrence,
          transaction.recurrenceInterval
        );

        // Stop recurrence if endDate is reached
        if (transaction.endDate && transaction.nextRecurrence > transaction.endDate) {
          transaction.isRecurring = false;
        }

        await transaction.save();
      }
    } catch (error) {
      console.error('Error scheduling recurring transactions:', error.message);
    }
  });
};

/**
 * Calculate the next recurrence date based on interval
 * @param {Date} currentDate - Current recurrence date
 * @param {String} interval - Recurrence interval
 * @returns {Date} - Next recurrence date
 */
const calculateNextRecurrence = (currentDate, interval) => {
  const nextDate = new Date(currentDate);

  switch (interval) {
    case 'daily':
      nextDate.setDate(nextDate.getDate() + 1);
      break;
    case 'weekly':
      nextDate.setDate(nextDate.getDate() + 7);
      break;
    case 'bi-weekly':
      nextDate.setDate(nextDate.getDate() + 14);
      break;
    case 'monthly':
      nextDate.setMonth(nextDate.getMonth() + 1);
      break;
    case 'quarterly':
      nextDate.setMonth(nextDate.getMonth() + 3);
      break;
    case 'yearly':
      nextDate.setFullYear(nextDate.getFullYear() + 1);
      break;
    default:
      break;
  }

  return nextDate;
};
