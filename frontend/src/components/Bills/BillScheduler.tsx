import React, { useState } from 'react';

interface Bill {
  id: string;
  name: string;
  amount: number;
  dueDate: string;
}

const BillScheduler: React.FC = () => {
  const [bills, setBills] = useState<Bill[]>([]);
  const [newBill, setNewBill] = useState({ name: '', amount: '', dueDate: '' });

  const handleAddBill = (e: React.FormEvent) => {
    e.preventDefault();
    const bill: Bill = {
      id: Date.now().toString(),
      name: newBill.name,
      amount: parseFloat(newBill.amount),
      dueDate: newBill.dueDate,
    };
    setBills([...bills, bill]);
    setNewBill({ name: '', amount: '', dueDate: '' });
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Bill Scheduler</h2>
      <form onSubmit={handleAddBill} className="mb-4">
        <input
          type="text"
          placeholder="Bill Name"
          value={newBill.name}
          onChange={e => setNewBill({ ...newBill, name: e.target.value })}
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={newBill.amount}
          onChange={e => setNewBill({ ...newBill, amount: e.target.value })}
          className="mr-2 p-2 border rounded"
          required
          min="0"
          step="0.01"
        />
        <input
          type="date"
          value={newBill.dueDate}
          onChange={e => setNewBill({ ...newBill, dueDate: e.target.value })}
          className="mr-2 p-2 border rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Bill
        </button>
      </form>
      <ul>
        {bills.map(bill => (
          <li key={bill.id} className="mb-2">
            {bill.name} - ${bill.amount} due on {bill.dueDate}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default BillScheduler;
