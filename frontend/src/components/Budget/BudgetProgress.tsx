import React from 'react';

const BudgetProgress: React.FC = () => {
  // TODO: Fetch real data from API
  const totalBudget = 5000;
  const spentAmount = 3500;
  const progressPercentage = (spentAmount / totalBudget) * 100;

  return (
    <div className="bg-white shadow overflow-hidden sm:rounded-lg">
      <div className="px-4 py-5 sm:px-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900">
          Budget Progress
        </h3>
      </div>
      <div className="border-t border-gray-200 px-4 py-5 sm:p-6">
        <div className="flex justify-between mb-1">
          <span className="text-base font-medium text-indigo-700">
            Overall Budget
          </span>
          <span className="text-sm font-medium text-indigo-700">
            {progressPercentage.toFixed(1)}%
          </span>
        </div>
        <div className="w-full bg-gray-200 rounded-full h-2.5">
          <div
            className="bg-indigo-600 h-2.5 rounded-full"
            style={{ width: `${progressPercentage}%` }}
          ></div>
        </div>
        <div className="mt-4 text-sm text-gray-600">
          ${spentAmount.toLocaleString()} spent out of $
          {totalBudget.toLocaleString()} total budget
        </div>
      </div>
    </div>
  );
};

export default BudgetProgress;
