import React from 'react';
import { motion } from 'framer-motion';

interface Goal {
  id: string;
  name: string;
  targetAmount: number;
  currentAmount: number;
  deadline: string;
}

interface GoalCardProps {
  goal: Goal;
  onUpdate: (updatedGoal: Goal) => void;
}

const GoalCard: React.FC<GoalCardProps> = ({ goal, onUpdate }) => {
  const progress = (goal.currentAmount / goal.targetAmount) * 100;

  const handleContribute = () => {
    const contribution = parseFloat(
      prompt('Enter contribution amount:') || '0'
    );
    if (contribution > 0) {
      onUpdate({
        ...goal,
        currentAmount: Math.min(
          goal.currentAmount + contribution,
          goal.targetAmount
        ),
      });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white dark:bg-gray-800 overflow-hidden shadow rounded-lg"
    >
      <div className="px-4 py-5 sm:p-6">
        <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
          {goal.name}
        </h3>
        <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-300">
          <p className="text-base sm:text-lg">
            Target: ${goal.targetAmount.toLocaleString()}
          </p>
          <p className="text-base sm:text-lg">
            Current: ${goal.currentAmount.toLocaleString()}
          </p>
          <p className="text-base sm:text-lg">
            Deadline: {new Date(goal.deadline).toLocaleDateString()}
          </p>
        </div>
        <div className="mt-4">
          <div className="relative pt-1">
            <div className="overflow-hidden h-2 mb-4 text-xs flex rounded bg-indigo-200 dark:bg-indigo-700">
              <motion.div
                style={{ width: `${progress}%` }}
                initial={{ width: 0 }}
                animate={{ width: `${progress}%` }}
                transition={{ duration: 0.5 }}
                className="shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center bg-indigo-500"
              ></motion.div>
            </div>
          </div>
          <p className="text-sm font-medium text-gray-500 dark:text-gray-300">
            {progress.toFixed(1)}% Complete
          </p>
        </div>
        <div className="mt-4">
          <button
            onClick={handleContribute}
            className="w-full sm:w-auto inline-flex items-center px-4 py-2 border border-transparent text-base font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
          >
            Contribute
          </button>
        </div>
      </div>
    </motion.div>
  );
};

export default GoalCard;
