import React, { useState } from 'react';
import { Investment } from '../../types';
import { PencilSquareIcon, TrashIcon } from '@heroicons/react/24/outline'; // Updated import path
import EditInvestmentModal from './EditInvestmentModal';
import { format, parseISO } from 'date-fns';

interface InvestmentListProps {
  investments: Investment[];
  deleteInvestment: (id: string) => void;
  editInvestment: (updatedInvestment: Investment) => void;
}

const InvestmentList: React.FC<InvestmentListProps> = ({
  investments,
  deleteInvestment,
  editInvestment,
}) => {
  const [editingInvestment, setEditingInvestment] = useState<Investment | null>(
    null
  );

  return (
    <div className="overflow-x-auto">
      <table className="min-w-full bg-white dark:bg-gray-800">
        <thead>
          <tr>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Name
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Type
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Amount
            </th>
            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Current Value
            </th>
            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
              Date
            </th>
            <th className="px-6 py-3"></th>
          </tr>
        </thead>
        <tbody className="bg-white dark:bg-gray-700 divide-y divide-gray-200 dark:divide-gray-600">
          {investments.map(investment => (
            <tr key={investment.id}>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-100">
                {investment.name}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {investment.type}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                {investment.amount}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-right text-gray-900 dark:text-gray-100">
                ${investment.currentValue.toFixed(2)}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                {format(parseISO(investment.date), 'MM/dd/yyyy')}
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <button
                  onClick={() => setEditingInvestment(investment)}
                  className="text-indigo-600 hover:text-indigo-900 dark:text-indigo-400 dark:hover:text-indigo-200"
                  aria-label="Edit Investment"
                >
                  <PencilSquareIcon className="h-5 w-5" />
                </button>
                <button
                  onClick={() => deleteInvestment(investment.id)}
                  className="ml-4 text-red-600 hover:text-red-900 dark:text-red-400 dark:hover:text-red-200"
                  aria-label="Delete Investment"
                >
                  <TrashIcon className="h-5 w-5" />
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {editingInvestment && (
        <EditInvestmentModal
          investment={editingInvestment}
          closeModal={() => setEditingInvestment(null)}
          editInvestment={editInvestment}
        />
      )}
    </div>
  );
};

export default InvestmentList;
