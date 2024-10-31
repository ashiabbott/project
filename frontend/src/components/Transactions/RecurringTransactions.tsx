import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  addRecurringTransaction,
  removeRecurringTransaction,
} from '../../store/slices/transactionsSlice';
import { AppDispatch, RootState } from '../../store';
import { PlusIcon, TrashIcon } from '@heroicons/react/outline';

interface RecurringTransaction {
  id: string;
  description: string;
  amount: number;
  frequency: 'daily' | 'weekly' | 'monthly' | 'yearly';
  nextDate: string;
}

const RecurringTransactions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const recurringTransactions = useSelector(
    (state: RootState) => state.transactions.recurringTransactions
  );
  const [newTransaction, setNewTransaction] = useState({
    description: '',
    amount: '',
    frequency: 'monthly',
    nextDate: '',
  });

  const handleAddTransaction = () => {
    if (
      newTransaction.description &&
      newTransaction.amount &&
      newTransaction.nextDate
    ) {
      dispatch(
        addRecurringTransaction({
          ...newTransaction,
          amount: parseFloat(newTransaction.amount),
          id: Date.now().toString(),
        })
      );
      setNewTransaction({
        description: '',
        amount: '',
        frequency: 'monthly',
        nextDate: '',
      });
    }
  };

  const handleRemoveTransaction = (id: string) => {
    dispatch(removeRecurringTransaction(id));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Recurring Transactions
      </h2>
      <div className="mb-4">
        <input
          type="text"
          placeholder="Description"
          value={newTransaction.description}
          onChange={e =>
            setNewTransaction({
              ...newTransaction,
              description: e.target.value,
            })
          }
          className="w-full p-2 mb-2 border rounded"
        />
        <input
          type="number"
          placeholder="Amount"
          value={newTransaction.amount}
          onChange={e =>
            setNewTransaction({ ...newTransaction, amount: e.target.value })
          }
          className="w-full p-2 mb-2 border rounded"
        />
        <select
          value={newTransaction.frequency}
          onChange={e =>
            setNewTransaction({
              ...newTransaction,
              frequency: e.target.value as RecurringTransaction['frequency'],
            })
          }
          className="w-full p-2 mb-2 border rounded"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <input
          type="date"
          placeholder="Next Date"
          value={newTransaction.nextDate}
          onChange={e =>
            setNewTransaction({ ...newTransaction, nextDate: e.target.value })
          }
          className="w-full p-2 mb-2 border rounded"
        />
        <button
          onClick={handleAddTransaction}
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          <PlusIcon className="h-5 w-5 inline-block mr-2" />
          Add Recurring Transaction
        </button>
      </div>
      <ul>
        {recurringTransactions.map(transaction => (
          <li
            key={transaction.id}
            className="flex justify-between items-center mb-2 p-2 bg-gray-100 dark:bg-gray-700 rounded"
          >
            <div>
              <span className="font-semibold">{transaction.description}</span>
              <span className="ml-2 text-gray-600 dark:text-gray-300">
                ${transaction.amount.toFixed(2)}
              </span>
              <span className="ml-2 text-gray-500 dark:text-gray-400">
                ({transaction.frequency})
              </span>
            </div>
            <button
              onClick={() => handleRemoveTransaction(transaction.id)}
              className="text-red-500 hover:text-red-700"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RecurringTransactions;
