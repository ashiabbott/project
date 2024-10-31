import React from 'react';
import BudgetOverview from '../../components/Budget/BudgetOverview';
import CategoryBreakdown from '../../components/Budget/CategoryBreakdown';
import BudgetProgress from '../../components/Budget/BudgetProgress';

const BudgetPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-900">Budget</h1>
      <div className="mt-8 grid grid-cols-1 gap-8 md:grid-cols-2">
        <BudgetOverview />
        <CategoryBreakdown />
      </div>
      <div className="mt-8">
        <BudgetProgress />
      </div>
    </div>
  );
};

export default BudgetPage;
