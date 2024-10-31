import React, { useState } from 'react';

interface TaxItem {
  id: string;
  name: string;
  amount: number;
  type: 'income' | 'deduction';
}

const TaxPlanner: React.FC = () => {
  const [taxItems, setTaxItems] = useState<TaxItem[]>([]);
  const [newItem, setNewItem] = useState({
    name: '',
    amount: '',
    type: 'income',
  });

  const handleAddItem = (e: React.FormEvent) => {
    e.preventDefault();
    const item: TaxItem = {
      id: Date.now().toString(),
      name: newItem.name,
      amount: parseFloat(newItem.amount),
      type: newItem.type as 'income' | 'deduction',
    };
    setTaxItems([...taxItems, item]);
    setNewItem({ name: '', amount: '', type: 'income' });
  };

  const totalIncome = taxItems
    .filter(item => item.type === 'income')
    .reduce((sum, item) => sum + item.amount, 0);
  const totalDeductions = taxItems
    .filter(item => item.type === 'deduction')
    .reduce((sum, item) => sum + item.amount, 0);
  const taxableIncome = totalIncome - totalDeductions;

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Tax Planner</h2>
      <form onSubmit={handleAddItem} className="mb-4">
        <input
          type="text"
          placeholder="Item Name"
          value={newItem.name}
          onChange={e => setNewItem({ ...newItem, name: e.target.value })}
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={newItem.amount}
          onChange={e => setNewItem({ ...newItem, amount: e.target.value })}
          className="mr-2 p-2 border rounded"
          required
          min="0"
          step="0.01"
        />
        <select
          value={newItem.type}
          onChange={e => setNewItem({ ...newItem, type: e.target.value })}
          className="mr-2 p-2 border rounded"
        >
          <option value="income">Income</option>
          <option value="deduction">Deduction</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Item
        </button>
      </form>
      <div className="mb-4">
        <p>Total Income: ${totalIncome.toFixed(2)}</p>
        <p>Total Deductions: ${totalDeductions.toFixed(2)}</p>
        <p>Taxable Income: ${taxableIncome.toFixed(2)}</p>
      </div>
      <ul>
        {taxItems.map(item => (
          <li key={item.id} className="mb-2">
            {item.name} - ${item.amount.toFixed(2)} ({item.type})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaxPlanner;
