import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState, AppDispatch } from '../../store';
import { fetchFinancialAdvice } from '../../store/slices/financialAdvisorSlice';
import {
  LightBulbIcon,
  ChartBarIcon,
  CashIcon,
  TrendingUpIcon,
} from '@heroicons/react/24/outline';

interface Advice {
  category: string;
  title: string;
  description: string;
  action: string;
}

const FinancialAdvisor: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { advice, loading, error } = useSelector(
    (state: RootState) => state.financialAdvisor
  );
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  useEffect(() => {
    dispatch(fetchFinancialAdvice());
  }, [dispatch]);

  const categories = Array.from(new Set(advice.map(item => item.category)));

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'Budgeting':
        return <ChartBarIcon className="w-6 h-6" />;
      case 'Saving':
        return <CashIcon className="w-6 h-6" />;
      case 'Investing':
        return <TrendingUpIcon className="w-6 h-6" />;
      default:
        return <LightBulbIcon className="w-6 h-6" />;
    }
  };

  if (loading)
    return <div className="text-center">Loading financial advice...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
        <LightBulbIcon className="w-6 h-6 mr-2" />
        Financial Advisor
      </h2>

      <div className="mb-6">
        <h3 className="text-lg font-medium mb-4 text-gray-700 dark:text-gray-300">
          Categories
        </h3>
        <div className="flex flex-wrap gap-2">
          {categories.map(category => (
            <button
              key={category}
              onClick={() =>
                setSelectedCategory(
                  category === selectedCategory ? null : category
                )
              }
              className={`px-4 py-2 rounded-full flex items-center ${
                category === selectedCategory
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {getCategoryIcon(category)}
              <span className="ml-2">{category}</span>
            </button>
          ))}
        </div>
      </div>

      <div className="space-y-6">
        {advice
          .filter(
            item => !selectedCategory || item.category === selectedCategory
          )
          .map((item, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
              className="bg-gray-100 dark:bg-gray-700 p-4 rounded-lg"
            >
              <h4 className="text-lg font-medium mb-2 text-gray-800 dark:text-gray-200">
                {item.title}
              </h4>
              <p className="text-gray-600 dark:text-gray-400 mb-4">
                {item.description}
              </p>
              <div className="flex justify-between items-center">
                <span className="text-sm font-medium text-blue-500">
                  {item.category}
                </span>
                <button className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600">
                  {item.action}
                </button>
              </div>
            </motion.div>
          ))}
      </div>
    </motion.div>
  );
};

export default FinancialAdvisor;
