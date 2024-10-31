// src/components/Dashboard/GoalsProgress.tsx

import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import GoalProgress from '../Goals/GoalProgress';

interface Goal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
}

const GoalsProgress: React.FC = () => {
  const goals = useSelector((state: RootState) => state.goals.items);

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow-lg h-full">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-4">
        Goals Progress
      </h2>
      {goals.length === 0 ? (
        <p className="text-gray-500 dark:text-gray-400">No goals set.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {goals.map(goal => (
            <GoalProgress key={goal.id} goal={goal} />
          ))}
        </div>
      )}
    </div>
  );
};

export default GoalsProgress;
