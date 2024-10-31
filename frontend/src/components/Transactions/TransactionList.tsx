// src/components/Transactions/TransactionsList.tsx

import React, { useState, useMemo } from 'react';
import { Transaction, TransactionType } from '../../types';
import {
  PencilAltIcon,
  TrashIcon,
  ChevronDownIcon,
  ChevronUpIcon,
} from '@heroicons/react/solid';
import EditTransactionModal from './EditTransactionModal';
import ConfirmationDialog from '../Common/ConfirmationDialog';
import {
  useGetTransactionsQuery,
  useDeleteTransactionMutation,
} from '../../store/slices/apiSlice';
import { format, parseISO } from 'date-fns';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addNotification } from '../../store/slices/notificationSlice';

interface SortConfig {
  key: keyof Transaction;
  direction: 'ascending' | 'descending';
}

const TransactionsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const {
    data: transactions = [],
    error,
    isLoading,
    refetch,
  } = useGetTransactionsQuery();

  const [deleteTransaction] = useDeleteTransactionMutation();

  const [editingTransaction, setEditingTransaction] =
    useState<Transaction | null>(null);
  const [transactionToDelete, setTransactionToDelete] =
    useState<Transaction | null>(null);
  const [sortConfig, setSortConfig] = useState<SortConfig | null>(null);
  const [filterType, setFilterType] = useState<TransactionType | 'all'>('all');

  // Sorting Functionality
  const sortedTransactions = useMemo(() => {
    let sortableTransactions = [...transactions];

    // Apply filtering
    if (filterType !== 'all') {
      sortableTransactions = sortableTransactions.filter(
        transaction => transaction.type === filterType
      );
    }

    if (sortConfig !== null) {
      sortableTransactions.sort((a, b) => {
        let aKey = a[sortConfig.key];
        let bKey = b[sortConfig.key];

        // Handle different data types
        if (sortConfig.key === 'date') {
          aKey = new Date(aKey as string).getTime();
          bKey = new Date(bKey as string).getTime();
        }

        if (aKey < bKey) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (aKey > bKey) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }

    return sortableTransactions;
  }, [transactions, sortConfig, filterType]);

  // Toggle Sort Direction or set new sort key
  const requestSort = (key: keyof Transaction) => {
    let direction: 'ascending' | 'descending' = 'ascending';
    if (
      sortConfig &&
      sortConfig.key === key &&
      sortConfig.direction === 'ascending'
    ) {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  // Delete Transaction with Confirmation
  const handleDelete = async (id: string) => {
    try {
      await deleteTransaction(id).unwrap();
      dispatch(
        addNotification({
          message: 'Transaction deleted successfully.',
          type: 'success',
        })
      );
    } catch (err: any) {
      dispatch(
        addNotification({
          message: err.data?.message || 'Failed to delete transaction.',
          type: 'error',
        })
      );
    } finally {
      setTransactionToDelete(null);
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center py-10">
        <svg
          className="animate-spin h-10 w-10 text-teal-500"
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          aria-label="Loading spinner"
        >
          <circle
            className="opacity-25"
            cx="12"
            cy="12"
            r="10"
            stroke="currentColor"
            strokeWidth="4"
          ></circle>
          <path
            className="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8v8H4z"
          ></path>
        </svg>
        <span className="ml-4 text-gray-700 dark:text-gray-300">
          Loading transactions...
        </span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="flex flex-col items-center py-10">
        <p className="text-red-600 dark:text-red-400 mb-4">
          Failed to load transactions.
        </p>
        <button
          onClick={() => refetch()}
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
      {/* Filters and Sorting */}
      <div className="px-6 py-4 flex justify-between items-center">
        {/* Filter by Transaction Type */}
        <div>
          <label
            htmlFor="filterType"
            className="mr-2 text-gray-700 dark:text-gray-300"
          >
            Filter:
          </label>
          <select
            id="filterType"
            value={filterType}
            onChange={e =>
              setFilterType(e.target.value as TransactionType | 'all')
            }
            className="mt-1 block pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-700 focus:outline-none focus:ring-teal-500 focus:border-teal-500 sm:text-sm rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="all">All</option>
            <option value="income">Income</option>
            <option value="expense">Expense</option>
          </select>
        </div>

        {/* Refresh Button */}
        <button
          onClick={() => refetch()}
          className="flex items-center px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 focus:outline-none focus:ring-2 focus:ring-teal-500"
          aria-label="Refresh Transactions"
        >
          <svg
            className="animate-spin h-5 w-5 mr-2"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <circle
              className="opacity-25"
              cx="12"
              cy="12"
              r="10"
              stroke="currentColor"
              strokeWidth="4"
            ></circle>
            <path
              className="opacity-75"
              fill="currentColor"
              d="M4 12a8 8 0 018-8v8H4z"
            ></path>
          </svg>
          Refresh
        </button>
      </div>

      {/* Transactions Table */}
      <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
        <thead className="bg-gray-50 dark:bg-gray-700">
          <tr>
            {/* Date Column */}
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('date')}
              aria-sort={
                sortConfig?.key === 'date'
                  ? sortConfig.direction === 'ascending'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              }
            >
              <div className="flex items-center">
                Date
                {sortConfig?.key === 'date' ? (
                  sortConfig.direction === 'ascending' ? (
                    <ChevronUpIcon
                      className="h-4 w-4 ml-1"
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronDownIcon
                      className="h-4 w-4 ml-1"
                      aria-hidden="true"
                    />
                  )
                ) : null}
              </div>
            </th>

            {/* Description Column */}
            <th
              scope="col"
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('description')}
              aria-sort={
                sortConfig?.key === 'description'
                  ? sortConfig.direction === 'ascending'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              }
            >
              <div className="flex items-center">
                Description
                {sortConfig?.key === 'description' ? (
                  sortConfig.direction === 'ascending' ? (
                    <ChevronUpIcon
                      className="h-4 w-4 ml-1"
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronDownIcon
                      className="h-4 w-4 ml-1"
                      aria-hidden="true"
                    />
                  )
                ) : null}
              </div>
            </th>

            {/* Amount Column */}
            <th
              scope="col"
              className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
              onClick={() => requestSort('amount')}
              aria-sort={
                sortConfig?.key === 'amount'
                  ? sortConfig.direction === 'ascending'
                    ? 'ascending'
                    : 'descending'
                  : 'none'
              }
            >
              <div className="flex items-center justify-end">
                Amount
                {sortConfig?.key === 'amount' ? (
                  sortConfig.direction === 'ascending' ? (
                    <ChevronUpIcon
                      className="h-4 w-4 ml-1"
                      aria-hidden="true"
                    />
                  ) : (
                    <ChevronDownIcon
                      className="h-4 w-4 ml-1"
                      aria-hidden="true"
                    />
                  )
                ) : null}
              </div>
            </th>

            {/* Actions Column */}
            <th scope="col" className="relative px-6 py-3">
              <span className="sr-only">Actions</span>
            </th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
          {sortedTransactions.length === 0 ? (
            <tr>
              <td
                colSpan={4}
                className="px-6 py-4 text-center text-gray-500 dark:text-gray-400"
              >
                No transactions found.
              </td>
            </tr>
          ) : (
            sortedTransactions.map(transaction => (
              <tr key={transaction.id}>
                {/* Date */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {format(parseISO(transaction.date), 'MMM dd, yyyy')}
                </td>

                {/* Description */}
                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 dark:text-gray-300">
                  {transaction.description}
                </td>

                {/* Amount */}
                <td
                  className={`px-6 py-4 whitespace-nowrap text-sm font-medium text-right ${
                    transaction.type === TransactionType.Income
                      ? 'text-green-500'
                      : 'text-red-500'
                  }`}
                >
                  {transaction.type === TransactionType.Income ? '+' : '-'}$
                  {Math.abs(transaction.amount).toFixed(2)}
                </td>

                {/* Actions */}
                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium space-x-2">
                  {/* Edit Button */}
                  <button
                    onClick={() => setEditingTransaction(transaction)}
                    className="text-indigo-600 dark:text-indigo-400 hover:text-indigo-900 dark:hover:text-indigo-200"
                    aria-label={`Edit transaction on ${format(
                      parseISO(transaction.date),
                      'MMM dd, yyyy'
                    )}`}
                  >
                    <PencilAltIcon className="h-5 w-5" />
                  </button>

                  {/* Delete Button */}
                  <button
                    onClick={() => setTransactionToDelete(transaction)}
                    className="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-200"
                    aria-label={`Delete transaction on ${format(
                      parseISO(transaction.date),
                      'MMM dd, yyyy'
                    )}`}
                  >
                    <TrashIcon className="h-5 w-5" />
                  </button>
                </td>
              </tr>
            ))
          )}
        </tbody>
      </table>

      {/* Edit Transaction Modal */}
      {editingTransaction && (
        <EditTransactionModal
          transaction={editingTransaction}
          closeModal={() => setEditingTransaction(null)}
        />
      )}

      {/* Delete Confirmation Dialog */}
      {transactionToDelete && (
        <ConfirmationDialog
          title="Delete Transaction"
          message={`Are you sure you want to delete the transaction "${transactionToDelete.description}" of amount $${Math.abs(
            transactionToDelete.amount
          ).toFixed(2)}? This action cannot be undone.`}
          onConfirm={() => handleDelete(transactionToDelete.id)}
          onCancel={() => setTransactionToDelete(null)}
        />
      )}
    </div>
  );
};

export default TransactionsList;
