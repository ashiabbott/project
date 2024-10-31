import React, { useState } from 'react';

interface AddAllowanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (allowance: {
    name: string;
    amount: number;
    frequency: string;
  }) => void;
}

const AddAllowanceModal: React.FC<AddAllowanceModalProps> = ({
  isOpen,
  onClose,
  onAdd,
}) => {
  const [name, setName] = useState('');
  const [amount, setAmount] = useState('');
  const [frequency, setFrequency] = useState('monthly');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onAdd({ name, amount: parseFloat(amount), frequency });
    setName('');
    setAmount('');
    setFrequency('monthly');
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg p-6 w-full max-w-md">
        <h2 className="text-2xl font-bold mb-4">Add Allowance</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4">
            <label htmlFor="name" className="block mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="amount" className="block mb-2">
              Amount
            </label>
            <input
              type="number"
              id="amount"
              value={amount}
              onChange={e => setAmount(e.target.value)}
              className="w-full p-2 border rounded"
              required
              min="0"
              step="0.01"
            />
          </div>
          <div className="mb-4">
            <label htmlFor="frequency" className="block mb-2">
              Frequency
            </label>
            <select
              id="frequency"
              value={frequency}
              onChange={e => setFrequency(e.target.value)}
              className="w-full p-2 border rounded"
            >
              <option value="daily">Daily</option>
              <option value="weekly">Weekly</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-200 rounded"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Add
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddAllowanceModal;
