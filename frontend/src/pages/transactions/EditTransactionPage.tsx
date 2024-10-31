// src/pages/transactions/EditTransactionPage.tsx

import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAppSelector } from '../../hooks/useAppSelector';
import EditTransactionModal from '../../components/Transactions/EditTransactionModal';
import Loading from '../../components/Loading/Loading';
import { Transaction } from '../../types';

const EditTransactionPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const transactions = useAppSelector(state => state.transactions.transactions);
  const [selectedTransaction, setSelectedTransaction] =
    useState<Transaction | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    if (id) {
      const transaction = transactions.find(tx => tx.id === id);
      if (transaction) {
        setSelectedTransaction(transaction);
        setIsModalOpen(true);
      } else {
        // If transaction not found, navigate to NotFound page
        navigate('/not-found', { replace: true });
      }
    }
  }, [id, transactions, navigate]);

  const handleClose = () => {
    setIsModalOpen(false);
    navigate('/transactions');
  };

  if (!selectedTransaction) {
    return <Loading />;
  }

  return (
    <EditTransactionModal
      isOpen={isModalOpen}
      onClose={handleClose}
      transaction={selectedTransaction}
    />
  );
};

export default EditTransactionPage;
