import React from 'react';
import BillScheduler from '../../components/Bills/BillScheduler';

const BillsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        Bill Management
      </h1>
      <BillScheduler />
    </div>
  );
};

export default BillsPage;
