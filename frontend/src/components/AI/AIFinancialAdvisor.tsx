import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState, AppDispatch } from '../../store';
import { fetchAIAdvice } from '../../store/slices/aiAdvisorSlice';
import {
  LightBulbIcon,
  ExclamationCircleIcon,
  CheckCircleIcon,
} from '@heroicons/react/24/outline';
import Tooltip from '@mui/material/Tooltip';

const AIFinancialAdvisor: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { advice, loading, error } = useSelector(
    (state: RootState) => state.aiAdvisor
  );

  useEffect(() => {
    dispatch(fetchAIAdvice());
  }, [dispatch]);

  const handleRetry = () => {
    dispatch(fetchAIAdvice());
  };

  if (loading) {
    return (
      <div className="text-center p-4">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="text-gray-600 dark:text-gray-300"
        >
          Loading AI advice...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-center p-4">
        <p className="text-red-600 dark:text-red-400">{error}</p>
        <button
          onClick={handleRetry}
          className="mt-4 text-blue-500 underline hover:text-blue-700"
        >
          Retry
        </button>
      </div>
    );
  }

  return (
    <div className="space-y-4 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h3 className="text-xl font-semibold flex items-center">
        <LightBulbIcon className="h-6 w-6 mr-2 text-yellow-500" />
        AI Financial Advisor
      </h3>
      <AnimatePresence>
        {advice.map(item => (
          <motion.div
            key={item.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-4 bg-gray-50 dark:bg-gray-700 rounded-lg shadow-sm"
          >
            <div className="flex items-center justify-between">
              <h4 className="font-medium text-gray-900 dark:text-gray-100">
                {item.title}
              </h4>
              <Tooltip
                title={`Impact: ${item.impact.charAt(0).toUpperCase() + item.impact.slice(1)}`}
              >
                <span
                  className={`px-2 py-1 rounded-full text-xs font-semibold ${
                    item.impact === 'high'
                      ? 'bg-red-100 text-red-800'
                      : item.impact === 'medium'
                        ? 'bg-yellow-100 text-yellow-800'
                        : 'bg-green-100 text-green-800'
                  }`}
                >
                  {item.impact.charAt(0).toUpperCase() + item.impact.slice(1)}
                </span>
              </Tooltip>
            </div>
            <p className="mt-2 text-sm text-gray-600 dark:text-gray-300">
              {item.message}
            </p>
            <button
              className="mt-3 text-indigo-600 dark:text-indigo-400 hover:underline text-sm"
              onClick={() => alert(`More details for: ${item.title}`)} // Placeholder for detailed view
            >
              Learn More
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
      <div className="text-center pt-4">
        <button
          onClick={() => dispatch(fetchAIAdvice())}
          className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-500 transition"
        >
          Refresh Advice
        </button>
      </div>
    </div>
  );
};

export default AIFinancialAdvisor;
