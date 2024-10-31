import React from 'react';
import TaxPlanner from '../../components/Tax/TaxPlanner';

const TaxPlannerPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Tax Planner</h1>
      <TaxPlanner />
    </div>
  );
};

export default TaxPlannerPage;
