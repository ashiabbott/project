import React, { useState } from 'react';
import { Investment } from '../../types';
import { XIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';

interface AddInvestmentModalProps {
  closeModal: () => void;
  addInvestment: (investment: Omit<Investment, 'id'>) => void;
}

const AddInvestmentModal: React.FC<AddInvestmentModalProps> = ({
  closeModal,
  addInvestment,
}) => {
  const [name, setName] = useState<string>('');
  const [amount, setAmount] = useState<number>(0);
  const [type, setType] = useState<'stock' | 'bond' | 'real-estate' | 'crypto'>(
    'stock'
  );
  const [date, setDate] = useState<string>(
    new Date().toISOString().split('T')[0]
  );
  const [error, setError] = useState<string>('');
  const [symbol, setSymbol] = useState<string>(''); // New state for symbol

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name || !amount || !date) {
      setError('Please fill in all fields.');
      return;
    }
    if (amount <= 0) {
      setError('Amount must be greater than zero.');
      return;
    }

    addInvestment({ name, amount, type, date });
    closeModal();
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      role="dialog"
      aria-modal="true"
    >
      <motion.div
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg w-full max-w-md mx-4"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3 }}
      >
        <div className="flex justify-between items-center px-6 py-4 border-b dark:border-gray-700">
          <h3 className="text-lg font-medium text-gray-800 dark:text-gray-100">
            Add New Investment
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none"
          >
            <XIcon className="h-6 w-6" aria-hidden="true" />
          </button>
        </div>
        <form onSubmit={handleSubmit} className="px-6 py-4">
          {error && (
            <div className="mb-4 text-red-600 dark:text-red-400" role="alert">
              {error}
            </div>
          )}
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Investment Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., Apple Stock, Treasury Bond"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="amount"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Amount Invested
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={e => setAmount(Number(e.target.value))}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-green-500 focus:border-green-500"
              placeholder="e.g., 5000"
              min="0.01"
              step="0.01"
              required
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="type"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Investment Type
            </label>
            <select
              id="type"
              value={type}
              onChange={e =>
                setType(
                  e.target.value as 'stock' | 'bond' | 'real-estate' | 'crypto'
                )
              }
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            >
              <option value="stock">Stock</option>
              <option value="bond">Bond</option>
              <option value="real-estate">Real Estate</option>
              <option value="crypto">Cryptocurrency</option>
            </select>
          </div>
          <div className="mb-6">
            <label
              htmlFor="date"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Date of Investment
            </label>
            <input
              type="date"
              id="date"
              value={date}
              onChange={e => setDate(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm focus:outline-none focus:ring-green-500 focus:border-green-500"
              required
            />
          </div>
          {(type === 'stock' || type === 'crypto') && (
            <div className="mb-6">
              <label
                htmlFor="symbol"
                className="block text-sm font-medium text-gray-700 dark:text-gray-300"
              >
                Symbol
              </label>
              <input
                type="text"
                id="symbol"
                value={symbol}
                onChange={e => setSymbol(e.target.value)}
                className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border rounded-md"
                placeholder="e.g., AAPL, BTC"
                required
              />
            </div>
          )}
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="mr-3 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
            >
              Add Investment
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};

export default AddInvestmentModal;
