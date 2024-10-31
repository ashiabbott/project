import React, { useState } from 'react';

interface Investment {
  id: string;
  name: string;
  amount: number;
  currentValue: number;
}

const InvestmentPortfolio: React.FC = () => {
  const [investments, setInvestments] = useState<Investment[]>([]);
  const [newInvestment, setNewInvestment] = useState({ name: '', amount: '' });

  const handleAddInvestment = (e: React.FormEvent) => {
    e.preventDefault();
    const investment: Investment = {
      id: Date.now().toString(),
      name: newInvestment.name,
      amount: parseFloat(newInvestment.amount),
      currentValue: parseFloat(newInvestment.amount), // Assuming initial value is the same as the invested amount
    };
    setInvestments([...investments, investment]);
    setNewInvestment({ name: '', amount: '' });
  };

  const totalInvested = investments.reduce((sum, inv) => sum + inv.amount, 0);
  const totalCurrentValue = investments.reduce(
    (sum, inv) => sum + inv.currentValue,
    0
  );

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Investment Portfolio</h2>
      <form onSubmit={handleAddInvestment} className="mb-4">
        <input
          type="text"
          placeholder="Investment Name"
          value={newInvestment.name}
          onChange={e =>
            setNewInvestment({ ...newInvestment, name: e.target.value })
          }
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={newInvestment.amount}
          onChange={e =>
            setNewInvestment({ ...newInvestment, amount: e.target.value })
          }
          className="mr-2 p-2 border rounded"
          required
          min="0"
          step="0.01"
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Investment
        </button>
      </form>
      <div className="mb-4">
        <p>Total Invested: ${totalInvested.toFixed(2)}</p>
        <p>Total Current Value: ${totalCurrentValue.toFixed(2)}</p>
      </div>
      <ul>
        {investments.map(inv => (
          <li key={inv.id} className="mb-2">
            {inv.name} - Invested: ${inv.amount.toFixed(2)}, Current Value: $
            {inv.currentValue.toFixed(2)}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default InvestmentPortfolio;
