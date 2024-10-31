import React from 'react';

interface Allowance {
  id: string;
  name: string;
  amount: number;
  frequency: string;
}

interface AllowanceCardProps {
  allowance: Allowance;
}

const AllowanceCard: React.FC<AllowanceCardProps> = ({ allowance }) => {
  return (
    <div className="bg-white shadow-md rounded-lg p-4">
      <h3 className="text-lg font-semibold mb-2">{allowance.name}</h3>
      <p className="text-gray-600">Amount: ${allowance.amount}</p>
      <p className="text-gray-600">Frequency: {allowance.frequency}</p>
    </div>
  );
};

export default AllowanceCard;
