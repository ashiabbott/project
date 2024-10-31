import React from 'react';
import AllowanceManager from '../../components/Allowance/AllowanceManager';

const AllowancePage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        Allowance Management
      </h1>
      <AllowanceManager />
    </div>
  );
};

export default AllowancePage;
