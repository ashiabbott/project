// src/components/Transactions/RecentTransactions.tsx

import React, { useState } from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { format, parseISO } from 'date-fns';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

const RecentTransactions: React.FC = () => {
  const transactions = useSelector(
    (state: RootState) => state.transactions.items
  );
  const [search, setSearch] = useState('');

  // Filter and limit transactions to 5 recent items that match search input
  const filteredTransactions = transactions
    .filter(transaction =>
      transaction.description.toLowerCase().includes(search.toLowerCase())
    )
    .slice(0, 5);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
          Recent Transactions
        </h2>
        <input
          type="text"
          placeholder="Search..."
          className="border border-gray-300 dark:border-gray-600 rounded-md px-2 py-1 text-sm dark:bg-gray-700"
          value={search}
          onChange={e => setSearch(e.target.value)}
        />
      </div>

      {filteredTransactions.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">
          No recent transactions.
        </p>
      ) : (
        <table className="w-full text-left">
          <thead>
            <tr>
              <th className="py-2 text-gray-600 dark:text-gray-300">Date</th>
              <th className="py-2 text-gray-600 dark:text-gray-300">
                Description
              </th>
              <th className="py-2 text-right text-gray-600 dark:text-gray-300">
                Amount
              </th>
              <th className="py-2 text-gray-600 dark:text-gray-300">
                Category
              </th>
            </tr>
          </thead>
          <tbody>
            {filteredTransactions.map(transaction => (
              <tr
                key={transaction.id}
                className="border-t border-gray-200 dark:border-gray-600"
              >
                <td className="py-2">
                  {format(parseISO(transaction.date), 'MMM dd, yyyy')}
                </td>
                <td className="py-2">{transaction.description}</td>
                <td
                  className={`py-2 text-right ${
                    transaction.type === 'income'
                      ? 'text-green-600'
                      : 'text-red-600'
                  }`}
                >
                  {transaction.type === 'income' ? '+' : '-'}$
                  {transaction.amount.toFixed(2)}
                </td>
                <td className="py-2">{transaction.category}</td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default RecentTransactions;
