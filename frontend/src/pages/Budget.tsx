import React from 'react';
import BudgetingWizard from '../components/Budget/BudgetingWizard';
import BudgetOverview from '../components/Budget/BudgetOverview';
import RecurringTransactions from '../components/Transactions/RecurringTransactions';

const Budget: React.FC = () => {
  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        Budget
      </h1>
      <BudgetOverview />
      <BudgetingWizard />
      <RecurringTransactions />
    </div>
  );
};

export default Budget;
