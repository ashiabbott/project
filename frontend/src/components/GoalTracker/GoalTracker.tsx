import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState, AppDispatch } from '../../store';
import {
  fetchGoals,
  addGoal,
  updateGoal,
  deleteGoal,
} from '../../store/slices/goalSlice';
import { FlagIcon } from '@heroicons/react/24/solid';
import { ResponsivePie } from '@nivo/pie';
import { format } from 'date-fns';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: Date;
}

const GoalTracker: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { goals, loading, error } = useSelector(
    (state: RootState) => state.goals
  );
  const [editingGoal, setEditingGoal] = useState<Goal | null>(null);
  const [newGoal, setNewGoal] = useState<Omit<Goal, 'id'>>({
    name: '',
    targetAmount: 0,
    currentAmount: 0,
    deadline: new Date(),
  });

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const handleUpdateGoal = (goal: Goal) => {
    dispatch(updateGoal(goal));
    setEditingGoal(null);
  };

  const handleAddGoal = () => {
    if (newGoal.name && newGoal.targetAmount > 0) {
      dispatch(addGoal(newGoal));
      setNewGoal({
        name: '',
        targetAmount: 0,
        currentAmount: 0,
        deadline: new Date(),
      });
    }
  };

  const handleDeleteGoal = (id: string) => {
    dispatch(deleteGoal(id));
  };

  if (loading) return <div className="text-center">Loading goals...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  const pieChartData = goals.map(goal => ({
    id: goal.name,
    label: goal.name,
    value: goal.currentAmount,
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
        <FlagIcon className="w-6 h-6 mr-2" />
        Goal Tracker
      </h2>

      <div className="mb-8">
        <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
          Goals Overview
        </h3>
        <div className="h-80">
          <ResponsivePie
            data={pieChartData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
            defs={[
              {
                id: 'dots',
                type: 'patternDots',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                size: 4,
                padding: 1,
                stagger: true,
              },
              {
                id: 'lines',
                type: 'patternLines',
                background: 'inherit',
                color: 'rgba(255, 255, 255, 0.3)',
                rotation: -45,
                lineWidth: 6,
                spacing: 10,
              },
            ]}
            fill={[
              { match: { id: 'ruby' }, id: 'dots' },
              { match: { id: 'c' }, id: 'dots' },
              { match: { id: 'go' }, id: 'dots' },
              { match: { id: 'python' }, id: 'dots' },
              { match: { id: 'scala' }, id: 'lines' },
              { match: { id: 'lisp' }, id: 'lines' },
              { match: { id: 'elixir' }, id: 'lines' },
              { match: { id: 'javascript' }, id: 'lines' },
            ]}
            legends={[
              {
                anchor: 'bottom',
                direction: 'row',
                justify: false,
                translateX: 0,
                translateY: 56,
                itemsSpacing: 0,
                itemWidth: 100,
                itemHeight: 18,
                itemTextColor: '#999',
                itemDirection: 'left-to-right',
                itemOpacity: 1,
                symbolSize: 18,
                symbolShape: 'circle',
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemTextColor: '#000',
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
          Add New Goal
        </h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <input
            type="text"
            value={newGoal.name}
            onChange={e => setNewGoal({ ...newGoal, name: e.target.value })}
            placeholder="Goal Name"
            className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <input
            type="number"
            value={newGoal.targetAmount}
            onChange={e =>
              setNewGoal({
                ...newGoal,
                targetAmount: parseFloat(e.target.value),
              })
            }
            placeholder="Target Amount"
            className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white"
          />
          <DatePicker
            selected={newGoal.deadline}
            onChange={(date: Date) =>
              setNewGoal({ ...newGoal, deadline: date })
            }
            className="px-3 py-2 border rounded-md dark:bg-gray-700 dark:border-gray-600 dark:text-white w-full"
            placeholderText="Deadline"
          />
          <button
            onClick={handleAddGoal}
            className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 flex items-center justify-center"
          >
            <PlusIcon className="w-5 h-5 mr-2" />
            Add Goal
          </button>
        </div>
      </div>

      <div>
        <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
          Your Goals
        </h3>
        <div className="space-y-4">
          {goals.map(goal => (
            <div
              key={goal.id}
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-md"
            >
              {editingGoal?.id === goal.id ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  <input
                    type="text"
                    value={editingGoal.name}
                    onChange={e =>
                      setEditingGoal({ ...editingGoal, name: e.target.value })
                    }
                    className="px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                  <input
                    type="number"
                    value={editingGoal.targetAmount}
                    onChange={e =>
                      setEditingGoal({
                        ...editingGoal,
                        targetAmount: parseFloat(e.target.value),
                      })
                    }
                    className="px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                  <input
                    type="number"
                    value={editingGoal.currentAmount}
                    onChange={e =>
                      setEditingGoal({
                        ...editingGoal,
                        currentAmount: parseFloat(e.target.value),
                      })
                    }
                    className="px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white"
                  />
                  <DatePicker
                    selected={editingGoal.deadline}
                    onChange={(date: Date) =>
                      setEditingGoal({ ...editingGoal, deadline: date })
                    }
                    className="px-3 py-2 border rounded-md dark:bg-gray-600 dark:border-gray-500 dark:text-white w-full"
                  />
                  <button
                    onClick={() => handleUpdateGoal(editingGoal)}
                    className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600"
                  >
                    Save
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="font-medium text-gray-800 dark:text-gray-200">
                      {goal.name}
                    </h4>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      ${goal.currentAmount.toFixed(2)} / $
                      {goal.targetAmount.toFixed(2)}
                    </p>
                    <p className="text-sm text-gray-600 dark:text-gray-400">
                      Deadline: {format(new Date(goal.deadline), 'MMM d, yyyy')}
                    </p>
                  </div>
                  <div className="flex space-x-2">
                    <button
                      onClick={() => setEditingGoal(goal)}
                      className="p-2 text-blue-500 hover:text-blue-600"
                    >
                      <PencilIcon className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => handleDeleteGoal(goal.id)}
                      className="p-2 text-red-500 hover:text-red-600"
                    >
                      <TrashIcon className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              )}
              <div className="mt-2 bg-gray-200 dark:bg-gray-600 rounded-full h-2">
                <div
                  className="bg-blue-500 rounded-full h-2"
                  style={{
                    width: `${(goal.currentAmount / goal.targetAmount) * 100}%`,
                  }}
                ></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export default GoalTracker;
