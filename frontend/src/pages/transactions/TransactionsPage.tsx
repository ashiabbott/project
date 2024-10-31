// src/pages/transactions/TransactionsPage.tsx

import React, { useState } from 'react';
import { useAppSelector } from '../../hooks/useAppSelector';
import { Transaction } from '../../types';
import EditTransactionModal from '../../components/Transactions/EditTransactionModal';
import { Link } from 'react-router-dom';
import { FaEdit, FaTrash } from 'react-icons/fa';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { deleteTransaction } from '../../store/slices/transactionsSlice';
import { addNotification } from '../../store/slices/notificationSlice';

const TransactionsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const transactions = useAppSelector(state => state.transactions.transactions);

  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleEditClick = (transaction: Transaction) => {
    setSelectedTransaction(transaction);
    setIsModalOpen(true);
  };

  const handleDeleteClick = (transaction: Transaction) => {
    if (window.confirm('Are you sure you want to delete this transaction?')) {
      dispatch(deleteTransaction(transaction.id))
        .unwrap()
        .then(() => {
          dispatch(
            addNotification({
              message: 'Transaction deleted successfully!',
              type: 'success',
            })
          );
        })
        .catch((error: any) => {
          dispatch(
            addNotification({
              message: error.message || 'Failed to delete transaction',
              type: 'error',
            })
          );
        });
    }
  };

  return (
    <div className="container mx-auto p-4">
      <div className="flex justify-between items-center mb-4">
        <h1 className="text-2xl font-semibold">Transactions</h1>
        <Link
          to="/transactions/add"
          className="px-4 py-2 bg-teal-600 text-white rounded hover:bg-teal-700 transition"
        >
          Add Transaction
        </Link>
      </div>

      {/* Transactions Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg shadow">
          <thead>
            <tr>
              <th className="py-2 px-4 border-b">Date</th>
              <th className="py-2 px-4 border-b">Description</th>
              <th className="py-2 px-4 border-b">Category</th>
              <th className="py-2 px-4 border-b">Type</th>
              <th className="py-2 px-4 border-b">Amount ($)</th>
              <th className="py-2 px-4 border-b">Actions</th>
            </tr>
          </thead>
          <tbody>
            {transactions.map(transaction => (
              <tr key={transaction.id} className="text-center">
                <td className="py-2 px-4 border-b">
                  {new Date(transaction.date).toLocaleDateString()}
                </td>
                <td className="py-2 px-4 border-b">
                  {transaction.description}
                </td>
                <td className="py-2 px-4 border-b">{transaction.category}</td>
                <td className="py-2 px-4 border-b capitalize">
                  {transaction.type}
                </td>
                <td
                  className={`py-2 px-4 border-b ${
                    transaction.amount < 0 ? 'text-red-500' : 'text-green-500'
                  }`}
                >
                  ${Math.abs(transaction.amount).toFixed(2)}
                </td>
                <td className="py-2 px-4 border-b">
                  <button
                    onClick={() => handleEditClick(transaction)}
                    className="text-blue-500 hover:text-blue-700 mr-2"
                    aria-label={`Edit Transaction ${transaction.id}`}
                  >
                    <FaEdit />
                  </button>
                  <button
                    onClick={() => handleDeleteClick(transaction)}
                    className="text-red-500 hover:text-red-700"
                    aria-label={`Delete Transaction ${transaction.id}`}
                  >
                    <FaTrash />
                  </button>
                </td>
              </tr>
            ))}
            {transactions.length === 0 && (
              <tr>
                <td colSpan={6} className="py-4 text-center text-gray-500">
                  No transactions found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Edit Transaction Modal */}
      {selectedTransaction && (
        <EditTransactionModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          transaction={selectedTransaction}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
