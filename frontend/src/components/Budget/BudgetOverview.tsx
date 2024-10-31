import React from 'react';

interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
}

interface Budget {
  totalBudget: number;
  spentAmount: number;
  remainingAmount: number;
  categories: BudgetCategory[];
}

interface BudgetOverviewProps {
  budget: Budget;
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({ budget }) => {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 h-full">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-gray-100">
        Budget Overview
      </h2>
      <div className="mb-4">
        <p>
          <strong>Total Budget:</strong> ${budget.totalBudget.toLocaleString()}
        </p>
        <p>
          <strong>Spent:</strong> ${budget.spentAmount.toLocaleString()}
        </p>
        <p>
          <strong>Remaining:</strong> ${budget.remainingAmount.toLocaleString()}
        </p>
      </div>
      <h3 className="text-xl font-semibold mb-2 text-gray-900 dark:text-gray-100">
        Categories:
      </h3>
      <ul className="space-y-4">
        {budget.categories.map(category => {
          const progress = (category.spent / category.allocated) * 100;
          return (
            <li key={category.name}>
              <div className="flex justify-between">
                <span>{category.name}</span>
                <span>
                  ${category.spent.toLocaleString()} / $
                  {category.allocated.toLocaleString()}
                </span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-700 mt-1">
                <div
                  className={`h-3 rounded-full ${
                    progress > 100 ? 'bg-red-600' : 'bg-green-500'
                  }`}
                  style={{ width: `${Math.min(progress, 100)}%` }}
                ></div>
              </div>
            </li>
          );
        })}
      </ul>
    </div>
  );
};

export default BudgetOverview;
