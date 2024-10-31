import React from 'react';
import { motion } from 'framer-motion';
import {
  ChatBubbleLeftRightIcon,
  LightBulbIcon,
} from '@heroicons/react/24/outline';
import FinancialInsights from '../AI/FinancialInsights';
import AIAssistant from '../AI/AIAssistant';

const AIAdvisor: React.FC = () => {
  // Mock data for insights, replace with real data from your AI model
  const mockInsights = [
    {
      id: '1',
      title: 'Unusual Spending',
      description:
        'Your dining out expenses are 30% higher than usual this month.',
      type: 'warning',
    },
    {
      id: '2',
      title: 'Savings Opportunity',
      description: 'You could save $50 by switching to a different phone plan.',
      type: 'info',
    },
    {
      id: '3',
      title: 'Investment Tip',
      description:
        'Based on your risk profile, consider diversifying your portfolio with index funds.',
      type: 'success',
    },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        AI Financial Advisor
      </h1>
      <FinancialInsights insights={mockInsights} />

      <div className="mt-6 bg-blue-50 dark:bg-blue-900 rounded-lg p-4">
        <h3 className="text-lg font-semibold mb-2 text-blue-800 dark:text-blue-200 flex items-center">
          <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2" />
          Need more specific advice?
        </h3>
        <p className="text-blue-600 dark:text-blue-300">
          Chat with our AI advisor for personalized financial guidance tailored
          to your unique situation.
        </p>
        <AIAssistant />
      </div>
    </motion.div>
  );
};

export default AIAdvisor;
