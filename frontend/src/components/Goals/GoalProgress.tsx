// src/components/Goals/GoalProgress.tsx

import React from 'react';
import { motion } from 'framer-motion';

interface Goal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
}

interface GoalProgressProps {
  goal: Goal;
}

const GoalProgress: React.FC<GoalProgressProps> = ({ goal }) => {
  const progressPercentage = Math.min(
    (goal.currentAmount / goal.targetAmount) * 100,
    100
  ).toFixed(2);

  return (
    <div className="bg-white dark:bg-gray-700 p-4 rounded-lg shadow">
      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
        {goal.name}
      </h3>
      <div className="w-full bg-gray-200 rounded-full h-3 dark:bg-gray-600">
        <motion.div
          className="bg-indigo-600 h-3 rounded-full"
          style={{ width: `${progressPercentage}%` }}
          initial={{ width: 0 }}
          animate={{ width: `${progressPercentage}%` }}
          transition={{ duration: 0.5 }}
        />
      </div>
      <p className="text-sm text-gray-600 dark:text-gray-300 mt-2">
        ${goal.currentAmount.toLocaleString()} / $
        {goal.targetAmount.toLocaleString()} ({progressPercentage}%)
      </p>
    </div>
  );
};

export default GoalProgress;
