import React, { useState } from 'react';

interface Subscription {
  id: string;
  name: string;
  amount: number;
  billingCycle: string;
}

const SubscriptionManager: React.FC = () => {
  const [subscriptions, setSubscriptions] = useState<Subscription[]>([]);
  const [newSubscription, setNewSubscription] = useState({
    name: '',
    amount: '',
    billingCycle: 'monthly',
  });

  const handleAddSubscription = (e: React.FormEvent) => {
    e.preventDefault();
    const subscription: Subscription = {
      id: Date.now().toString(),
      name: newSubscription.name,
      amount: parseFloat(newSubscription.amount),
      billingCycle: newSubscription.billingCycle,
    };
    setSubscriptions([...subscriptions, subscription]);
    setNewSubscription({ name: '', amount: '', billingCycle: 'monthly' });
  };

  const totalMonthly = subscriptions.reduce((sum, sub) => {
    if (sub.billingCycle === 'monthly') return sum + sub.amount;
    if (sub.billingCycle === 'yearly') return sum + sub.amount / 12;
    return sum;
  }, 0);

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Subscription Manager</h2>
      <form onSubmit={handleAddSubscription} className="mb-4">
        <input
          type="text"
          placeholder="Subscription Name"
          value={newSubscription.name}
          onChange={e =>
            setNewSubscription({ ...newSubscription, name: e.target.value })
          }
          className="mr-2 p-2 border rounded"
          required
        />
        <input
          type="number"
          placeholder="Amount"
          value={newSubscription.amount}
          onChange={e =>
            setNewSubscription({ ...newSubscription, amount: e.target.value })
          }
          className="mr-2 p-2 border rounded"
          required
          min="0"
          step="0.01"
        />
        <select
          value={newSubscription.billingCycle}
          onChange={e =>
            setNewSubscription({
              ...newSubscription,
              billingCycle: e.target.value,
            })
          }
          className="mr-2 p-2 border rounded"
        >
          <option value="monthly">Monthly</option>
          <option value="yearly">Yearly</option>
        </select>
        <button
          type="submit"
          className="bg-blue-500 text-white px-4 py-2 rounded"
        >
          Add Subscription
        </button>
      </form>
      <div className="mb-4">
        <p>Total Monthly Subscriptions: ${totalMonthly.toFixed(2)}</p>
      </div>
      <ul>
        {subscriptions.map(sub => (
          <li key={sub.id} className="mb-2">
            {sub.name} - ${sub.amount.toFixed(2)} ({sub.billingCycle})
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SubscriptionManager;
