import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  getTransactions,
  addTransaction,
} from '../store/slices/transactionSlice';
import { AppDispatch, RootState } from '../store';
import TransactionList from '../components/Transactions/TransactionList';
import AddTransactionModal from '../components/Transactions/AddTransactionModal';
import TransactionFilters from '../components/Transactions/TransactionFilters';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';
import { PlusIcon, FilterIcon } from '@heroicons/react/outline';

const Transactions: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { transactions, loading, error } = useSelector(
    (state: RootState) => state.transactions
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isFiltersOpen, setIsFiltersOpen] = useState(false);

  useEffect(() => {
    dispatch(getTransactions());
  }, [dispatch]);

  const handleAddTransaction = (newTransaction: Omit<Transaction, 'id'>) => {
    dispatch(addTransaction(newTransaction));
    setIsAddModalOpen(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
        <div className="flex space-x-4">
          <button
            onClick={() => setIsFiltersOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <FilterIcon
              className="-ml-1 mr-2 h-5 w-5 text-gray-500"
              aria-hidden="true"
            />
            Filters
          </button>
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            <PlusIcon className="-ml-1 mr-2 h-5 w-5" aria-hidden="true" />
            Add Transaction
          </button>
        </div>
      </div>

      <TransactionList transactions={transactions} />

      <AddTransactionModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddTransaction}
      />
      <TransactionFilters
        isOpen={isFiltersOpen}
        onClose={() => setIsFiltersOpen(false)}
      />
    </div>
  );
};

export default Transactions;
