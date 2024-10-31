// src/components/Transactions/EditTransactionModal.tsx

import React, { Fragment } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { useForm, SubmitHandler } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { motion } from 'framer-motion';
import { transactionSchema } from '../../schemas/transactionSchema';
import { Transaction } from '../../types';
import { useUpdateTransactionMutation } from '../../store/slices/apiSlice';
import { useAppDispatch } from '../../hooks/useAppDispatch';
import { addNotification } from '../../store/slices/notificationSlice';

interface EditTransactionModalProps {
  isOpen: boolean;
  onClose: () => void;
  transaction: Transaction;
}

const EditTransactionModal: React.FC<EditTransactionModalProps> = ({
  isOpen,
  onClose,
  transaction,
}) => {
  const dispatch = useAppDispatch();
  const [updateTransaction, { isLoading }] = useUpdateTransactionMutation();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<Transaction>({
    resolver: zodResolver(transactionSchema),
    defaultValues: transaction,
  });

  const onSubmit: SubmitHandler<Transaction> = async data => {
    try {
      await updateTransaction(data).unwrap();
      dispatch(
        addNotification({
          message: 'Transaction updated successfully.',
          type: 'success',
        })
      );
      onClose();
    } catch (error: any) {
      dispatch(
        addNotification({
          message: error.data?.message || 'Failed to update transaction.',
          type: 'error',
        })
      );
    }
  };

  return (
    <Transition.Root show={isOpen} as={Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={Fragment}
          enter="ease-out duration-300"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-200"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={Fragment}
              enter="ease-out duration-300"
              enterFrom="opacity-0 scale-95"
              enterTo="opacity-100 scale-100"
              leave="ease-in duration-200"
              leaveFrom="opacity-100 scale-100"
              leaveTo="opacity-0 scale-95"
            >
              <Dialog.Panel className="bg-white dark:bg-gray-800 rounded-lg max-w-lg w-full shadow-lg transform transition-all">
                <form onSubmit={handleSubmit(onSubmit)}>
                  <div className="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                    <Dialog.Title className="text-lg font-medium text-gray-900 dark:text-gray-100">
                      Edit Transaction
                    </Dialog.Title>
                    <div className="mt-4 grid grid-cols-1 gap-4">
                      {/* Description Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <input
                          type="text"
                          {...register('description')}
                          className={`mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border ${
                            errors.description
                              ? 'border-red-500'
                              : 'border-gray-300 dark:border-gray-600'
                          } rounded-md shadow-sm`}
                        />
                        {errors.description && (
                          <span className="text-red-500 text-sm">
                            {errors.description.message}
                          </span>
                        )}
                      </div>

                      {/* Amount Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Amount ($)
                        </label>
                        <input
                          type="number"
                          step="0.01"
                          {...register('amount')}
                          className={`mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border ${
                            errors.amount
                              ? 'border-red-500'
                              : 'border-gray-300 dark:border-gray-600'
                          } rounded-md shadow-sm`}
                        />
                        {errors.amount && (
                          <span className="text-red-500 text-sm">
                            {errors.amount.message}
                          </span>
                        )}
                      </div>

                      {/* Date Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Date
                        </label>
                        <input
                          type="date"
                          {...register('date')}
                          className={`mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border ${
                            errors.date
                              ? 'border-red-500'
                              : 'border-gray-300 dark:border-gray-600'
                          } rounded-md shadow-sm`}
                        />
                        {errors.date && (
                          <span className="text-red-500 text-sm">
                            {errors.date.message}
                          </span>
                        )}
                      </div>

                      {/* Category Field */}
                      <div>
                        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Category
                        </label>
                        <input
                          type="text"
                          {...register('category')}
                          className={`mt-1 block w-full px-3 py-2 bg-gray-50 dark:bg-gray-700 border ${
                            errors.category
                              ? 'border-red-500'
                              : 'border-gray-300 dark:border-gray-600'
                          } rounded-md shadow-sm`}
                        />
                        {errors.category && (
                          <span className="text-red-500 text-sm">
                            {errors.category.message}
                          </span>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                    <button
                      type="submit"
                      disabled={isLoading}
                      className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-teal-600 text-white text-base font-medium hover:bg-teal-700 focus:outline-none sm:w-auto sm:text-sm"
                    >
                      {isLoading ? 'Saving...' : 'Save Changes'}
                    </button>
                    <button
                      type="button"
                      onClick={onClose}
                      className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 dark:border-gray-600 shadow-sm px-4 py-2 bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </Dialog.Panel>
            </Transition.Child>
          </div>
        </div>
      </Dialog>
    </Transition.Root>
  );
};

export default EditTransactionModal;
