import React from 'react';
import InvestmentPortfolio from '../../components/Investments/InvestmentPortfolio';

const InvestmentsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        Investment Portfolio
      </h1>
      <InvestmentPortfolio />
    </div>
  );
};

export default InvestmentsPage;
