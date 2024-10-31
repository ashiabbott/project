import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  InformationCircleIcon,
  ExclamationTriangleIcon,
  CheckCircleIcon,
  XCircleIcon,
} from '@heroicons/react/24/outline';
import { fetchFinancialInsights } from '../../store/slices/financialInsightsSlice';
import { Insight } from '../../types';

const iconMap = {
  info: <InformationCircleIcon className="h-6 w-6 text-blue-500" />,
  warning: <ExclamationTriangleIcon className="h-6 w-6 text-yellow-500" />,
  success: <CheckCircleIcon className="h-6 w-6 text-green-500" />,
  error: <XCircleIcon className="h-6 w-6 text-red-500" />,
};

const FinancialInsights: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { insights, loading, error } = useSelector(
    (state: RootState) => state.financialInsights
  );

  useEffect(() => {
    dispatch(fetchFinancialInsights());
  }, [dispatch]);

  if (loading) {
    return (
      <p className="text-gray-600 dark:text-gray-400">Loading insights...</p>
    );
  }

  if (error) {
    return <p className="text-red-600 dark:text-red-400">Error: {error}</p>;
  }

  if (insights.length === 0) {
    return (
      <p className="text-gray-600 dark:text-gray-400">
        No insights available at the moment.
      </p>
    );
  }

  return (
    <div className="space-y-6 mt-6">
      <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-200">
        Your Financial Insights
      </h2>
      {insights.map(insight => (
        <div
          key={insight.id}
          className="p-4 bg-white dark:bg-gray-800 rounded shadow flex items-start"
        >
          <div className="mr-4">{iconMap[insight.type]}</div>
          <div>
            <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100">
              {insight.title}
            </h3>
            <p className="text-gray-700 dark:text-gray-300">
              {insight.description}
            </p>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              {new Date(insight.date).toLocaleDateString()}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
};

export default FinancialInsights;
