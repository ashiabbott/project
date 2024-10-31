import React, { useState } from 'react';
import AllowanceCard from './AllowanceCard';
import AddAllowanceModal from './AddAllowanceModal';

interface Allowance {
  id: string;
  name: string;
  amount: number;
  frequency: string;
}

const AllowanceManager: React.FC = () => {
  const [allowances, setAllowances] = useState<Allowance[]>([]);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleAddAllowance = (newAllowance: Omit<Allowance, 'id'>) => {
    setAllowances([
      ...allowances,
      { ...newAllowance, id: Date.now().toString() },
    ]);
    setIsModalOpen(false);
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-bold">Allowance Manager</h2>
        <button
          onClick={() => setIsModalOpen(true)}
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Allowance
        </button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {allowances.map(allowance => (
          <AllowanceCard key={allowance.id} allowance={allowance} />
        ))}
      </div>
      <AddAllowanceModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        onAdd={handleAddAllowance}
      />
    </div>
  );
};

export default AllowanceManager;
