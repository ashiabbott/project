import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState, AppDispatch } from '../../store';
import {
  fetchBudgets,
  updateBudget,
  addBudget,
  deleteBudget,
} from '../../store/slices/budgetSlice';
import {
  PlusIcon,
  PencilIcon,
  TrashIcon,
  CashIcon,
} from '@heroicons/react/outline';
import { ResponsiveBar } from '@nivo/bar';

interface Budget {
  id: string;
  category: string;
  amount: number;
  spent: number;
}

const BudgetPlanner: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { budgets, loading, error } = useSelector(
    (state: RootState) => state.budget
  );
  const [editingBudget, setEditingBudget] = useState<Budget | null>(null);
  const [newBudget, setNewBudget] = useState<Omit<Budget, 'id' | 'spent'>>({
    category: '',
    amount: 0,
  });

  useEffect(() => {
    dispatch(fetchBudgets());
  }, [dispatch]);

  const handleUpdateBudget = (budget: Budget) => {
    dispatch(updateBudget(budget));
    setEditingBudget(null);
  };

  const handleAddBudget = () => {
    if (newBudget.category && newBudget.amount > 0) {
      dispatch(addBudget(newBudget));
      setNewBudget({ category: '', amount: 0 });
    }
  };

  const handleDeleteBudget = (id: string) => {
    dispatch(deleteBudget(id));
  };

  if (loading) return <div className="text-center">Loading budgets...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  const chartData = budgets.map(budget => ({
    category: budget.category,
    'Budget Amount': budget.amount,
    'Spent Amount': budget.spent,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
        <CashIcon className="w-6 h-6 mr-2" />
        Budget Planner
      </h2>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
          Budget Overview
        </h3>
        <div className="h-80">
          <ResponsiveBar
            data={chartData}
            keys={['Budget Amount', 'Spent Amount']}
            indexBy="category"
            margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
            padding={0.3}
            valueScale={{ type: 'linear' }}
            indexScale={{ type: 'band', round: true }}
            colors={{ scheme: 'nivo' }}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Category',
              legendPosition: 'middle',
              legendOffset: 32,
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Amount',
              legendPosition: 'middle',
              legendOffset: -40,
            }}
            labelSkipWidth={12}
            labelSkipHeight={12}
            labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
            legends={[
              {
                dataFrom: 'keys',
                anchor: 'bottom-right',
                direction: 'column',
                justify: false,
                translateX: 120,
                translateY: 0,
                itemsSpacing: 2,
                itemWidth: 100,
                itemHeight: 20,
                itemDirection: 'left-to-right',
                itemOpacity: 0.85,
                symbolSize: 20,
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </div>
      </div>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
          Add New Budget
        </h3>
        <div className="flex space-x-4">
          <input
            type="text"
            value={newBudget.category}
            onChange={e =>
              setNewBudget({ ...newBudget, category: e.target.value })
            }
            placeholder="Category"
            className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="number"
            value={newBudget.amount}
            onChange={e =>
              setNewBudget({ ...newBudget, amount: parseFloat(e.target.value) })
            }
            placeholder="Amount"
            className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <button
            onClick={handleAddBudget}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Budget
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
          Your Budgets
        </h3>
        <div className="space-y-4">
          {budgets.map(budget => (
            <div
              key={budget.id}
              className="flex items-center justify-between bg-gray-100 dark:bg-gray-700 p-4 rounded-md"
            >
              {editingBudget?.id === budget.id ? (
                <>
                  <input
                    type="text"
                    value={editingBudget.category}
                    onChange={e =>
                      setEditingBudget({
                        ...editingBudget,
                        category: e.target.value,
                      })
                    }
                    className="flex-1 px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                  <input
                    type="number"
                    value={editingBudget.amount}
                    onChange={e =>
                      setEditingBudget({
                        ...editingBudget,
                        amount: parseFloat(e.target.value),
                      })
                    }
                    className="flex-1 px-3 py-2 border rounded-md ml-2 dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                  <button
                    onClick={() => handleUpdateBudget(editingBudget)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 ml-2"
                  >
                    Save
                  </button>
                </>
              ) : (
                <>
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">
                      {budget.category}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ${budget.spent.toFixed(2)} / ${budget.amount.toFixed(2)}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingBudget(budget)}
                      className="p-2 text-blue-500 hover:text-blue-600"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteBudget(budget.id)}
                      className="p-2 text-red-500 hover:text-red-600"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default BudgetPlanner;
