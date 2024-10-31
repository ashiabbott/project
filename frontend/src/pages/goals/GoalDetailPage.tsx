// src/pages/goals/GoalDetailPage.tsx

import React from 'react';
import { useParams } from 'react-router-dom';
import { useGetGoalQuery } from '../../store/slices/apiSlice';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const GoalDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { data: goal, error, isLoading } = useGetGoalQuery(id!);

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (error) {
    return <ErrorMessage message="Failed to load goal details." />;
  }

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h1 className="text-2xl font-bold text-gray-900 dark:text-white">
        {goal?.title}
      </h1>
      <p className="mt-4 text-gray-700 dark:text-gray-300">
        {goal?.description}
      </p>
      <p className="mt-2 text-teal-600 dark:text-teal-400">
        Target Amount: ${goal?.targetAmount}
      </p>
      <p className="mt-2 text-teal-600 dark:text-teal-400">
        Current Amount: ${goal?.currentAmount}
      </p>
    </div>
  );
};

export default GoalDetailPage;
