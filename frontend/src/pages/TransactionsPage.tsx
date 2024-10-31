import React, { useEffect, useState } from 'react';
import axios from 'axios';
import TransactionList from '../components/Transactions/TransactionList';
import AddTransactionModal from '../components/Transactions/AddTransactionModal';
import { Transaction } from '../types';
import { PlusIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';

const TransactionsPage: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');
  const [isModalOpen, setIsModalOpen] = useState<boolean>(false);

  // Fetch transactions from the backend API
  useEffect(() => {
    const fetchTransactions = async () => {
      try {
        const response = await axios.get<Transaction[]>('/api/transactions');
        setTransactions(response.data);
        setLoading(false);
      } catch (err: any) {
        setError('Failed to fetch transactions. Please try again later.');
        setLoading(false);
      }
    };

    fetchTransactions();
  }, []);

  // Handle adding a new transaction
  const addTransaction = async (newTransaction: Omit<Transaction, 'id'>) => {
    try {
      const response = await axios.post<Transaction>(
        '/api/transactions',
        newTransaction
      );
      setTransactions(prev => [response.data, ...prev]);
    } catch (err: any) {
      alert('Failed to add transaction. Please try again.');
    }
  };

  // Handle deleting a transaction
  const deleteTransaction = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this transaction?'))
      return;
    try {
      await axios.delete(`/api/transactions/${id}`);
      setTransactions(prev => prev.filter(tx => tx.id !== id));
    } catch (err: any) {
      alert('Failed to delete transaction. Please try again.');
    }
  };

  // Handle editing a transaction
  const editTransaction = async (
    id: string,
    updatedTransaction: Omit<Transaction, 'id'>
  ) => {
    try {
      const response = await axios.put<Transaction>(
        `/api/transactions/${id}`,
        updatedTransaction
      );
      setTransactions(prev =>
        prev.map(tx => (tx.id === id ? response.data : tx))
      );
    } catch (err: any) {
      alert('Failed to update transaction. Please try again.');
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.div
        className="flex justify-between items-center py-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5 }}
      >
        <h1 className="text-3xl font-bold text-gray-800 dark:text-gray-100">
          Transactions
        </h1>
        <button
          onClick={() => setIsModalOpen(true)}
          className="flex items-center px-4 py-2 bg-cyan-600 text-white rounded-md hover:bg-cyan-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-cyan-500"
          aria-label="Add New Transaction"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Transaction
        </button>
      </motion.div>

      {/* Loading State */}
      {loading && (
        <div className="flex justify-center items-center py-10">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-cyan-500"></div>
        </div>
      )}

      {/* Error State */}
      {error && (
        <div
          className="bg-red-100 text-red-700 p-4 rounded-md mb-6"
          role="alert"
        >
          {error}
        </div>
      )}

      {/* Transactions List */}
      {!loading && !error && (
        <TransactionList
          transactions={transactions}
          deleteTransaction={deleteTransaction}
          editTransaction={editTransaction}
        />
      )}

      {/* Add Transaction Modal */}
      {isModalOpen && (
        <AddTransactionModal
          closeModal={() => setIsModalOpen(false)}
          addTransaction={addTransaction}
        />
      )}
    </div>
  );
};

export default TransactionsPage;
