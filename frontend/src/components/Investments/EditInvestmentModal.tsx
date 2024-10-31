import React, { useEffect } from 'react';
import { Dialog, Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useForm, SubmitHandler, Controller } from 'react-hook-form';
import { useDispatch } from 'react-redux';
import DatePicker from 'react-datepicker';
import { updateInvestmentThunk } from '../../store/slices/investmentsSlice';
import { Investment } from '../../types';

interface EditInvestmentModalProps {
  isOpen: boolean;
  onClose: () => void;
  investment: Investment;
}

interface FormValues {
  name: string;
  amount: number;
  type: 'stock' | 'bond' | 'real-estate' | 'crypto';
  date: Date;
  symbol?: string;
}

const EditInvestmentModal: React.FC<EditInvestmentModalProps> = ({
  isOpen,
  onClose,
  investment,
}) => {
  const dispatch = useDispatch();

  const {
    register,
    handleSubmit,
    control,
    reset,
    watch,
    formState: { errors },
  } = useForm<FormValues>({
    defaultValues: {
      name: investment.name,
      amount: investment.amount,
      type: investment.type,
      date: new Date(investment.date),
      symbol: investment.symbol || '',
    },
  });

  const selectedType = watch('type');

  useEffect(() => {
    if (investment) {
      reset({
        name: investment.name,
        amount: investment.amount,
        type: investment.type,
        date: new Date(investment.date),
        symbol: investment.symbol || '',
      });
    }
  }, [investment, reset]);

  const onSubmit: SubmitHandler<FormValues> = data => {
    const updatedInvestment: Investment = {
      ...investment,
      name: data.name,
      amount: data.amount,
      type: data.type,
      date: data.date.toISOString(),
      symbol: data.symbol || '',
    };

    dispatch(updateInvestmentThunk(updatedInvestment));
    onClose();
  };

  return (
    <Transition.Root show={isOpen} as={React.Fragment}>
      <Dialog as="div" className="relative z-50" onClose={onClose}>
        <Transition.Child
          as={React.Fragment}
          enter="ease-out duration-200"
          enterFrom="opacity-0"
          enterTo="opacity-100"
          leave="ease-in duration-150"
          leaveFrom="opacity-100"
          leaveTo="opacity-0"
        >
          <div className="fixed inset-0 bg-gray-900 bg-opacity-50 transition-opacity" />
        </Transition.Child>

        <div className="fixed inset-0 z-50 overflow-y-auto">
          <div className="flex min-h-full items-center justify-center p-4 text-center">
            <Transition.Child
              as={React.Fragment}
              enter="ease-out duration-200"
              enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              enterTo="opacity-100 translate-y-0 sm:scale-100"
              leave="ease-in duration-150"
              leaveFrom="opacity-100 translate-y-0 sm:scale-100"
              leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
            >
              <Dialog.Panel className="relative bg-white dark:bg-gray-800 rounded-lg px-6 py-8 text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:max-w-lg w-full">
                <div className="absolute top-0 right-0 pt-4 pr-4">
                  <button
                    type="button"
                    className="text-gray-400 hover:text-gray-500 focus:outline-none"
                    onClick={onClose}
                  >
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                </div>
                <div className="mt-4 mb-6 text-center">
                  <Dialog.Title
                    as="h3"
                    className="text-2xl leading-6 font-medium text-gray-900 dark:text-white"
                  >
                    Edit Investment
                  </Dialog.Title>
                </div>
                <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                  <div>
                    <label
                      htmlFor="name"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Investment Name
                    </label>
                    <input
                      id="name"
                      type="text"
                      {...register('name', { required: true })}
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., Apple Stock, Treasury Bond"
                    />
                    {errors.name && (
                      <span className="text-red-500 text-sm">
                        This field is required
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="amount"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Amount Invested
                    </label>
                    <input
                      id="amount"
                      type="number"
                      step="0.01"
                      {...register('amount', { required: true, min: 0 })}
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                      placeholder="e.g., 5000"
                    />
                    {errors.amount && (
                      <span className="text-red-500 text-sm">
                        Please enter a valid amount
                      </span>
                    )}
                  </div>

                  <div>
                    <label
                      htmlFor="type"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Investment Type
                    </label>
                    <select
                      id="type"
                      {...register('type', { required: true })}
                      className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                    >
                      <option value="stock">Stock</option>
                      <option value="bond">Bond</option>
                      <option value="real-estate">Real Estate</option>
                      <option value="crypto">Cryptocurrency</option>
                    </select>
                  </div>

                  {(selectedType === 'stock' || selectedType === 'crypto') && (
                    <div>
                      <label
                        htmlFor="symbol"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                      >
                        Symbol
                      </label>
                      <input
                        id="symbol"
                        type="text"
                        {...register('symbol')}
                        className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        placeholder="e.g., AAPL, BTC"
                      />
                    </div>
                  )}

                  <div>
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300"
                    >
                      Date of Investment
                    </label>
                    <Controller
                      control={control}
                      name="date"
                      rules={{ required: true }}
                      render={({ field }) => (
                        <DatePicker
                          selected={field.value}
                          onChange={field.onChange}
                          dateFormat="yyyy-MM-dd"
                          className="mt-1 block w-full shadow-sm sm:text-sm border-gray-300 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white"
                        />
                      )}
                    />
                    {errors.date && (
                      <span className="text-red-500 text-sm">
                        Please select a date
                      </span>
                    )}
                  </div>

                  <div className="mt-8">
                    <button
                      type="submit"
                      className="w-full inline-flex justify-center items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                    >
                      Save Changes
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

export default EditInvestmentModal;
