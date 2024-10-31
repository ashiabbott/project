import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { getFinancialAdvice } from '../../api/aiAdvisorAPI';

const AIAssistant: React.FC = () => {
  const [query, setQuery] = useState('');
  const [response, setResponse] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setIsLoading(true);
    setResponse(null);

    try {
      const advice = await getFinancialAdvice(query);
      setResponse(advice);
    } catch (error) {
      console.error('Error fetching advice:', error);
      setResponse('Sorry, there was an error processing your request.');
    } finally {
      setIsLoading(false);
      setQuery('');
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 shadow-lg rounded-lg p-6 mt-4"
    >
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        AI Financial Assistant
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <input
          type="text"
          value={query}
          onChange={e => setQuery(e.target.value)}
          placeholder="Ask a financial question..."
          className="w-full p-2 border rounded bg-gray-100 dark:bg-gray-700 text-gray-900 dark:text-white"
        />
        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded"
          disabled={isLoading}
        >
          {isLoading ? 'Analyzing...' : 'Ask'}
        </motion.button>
      </form>
      {response && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="mt-6 p-4 bg-gray-50 dark:bg-gray-700 rounded"
        >
          <p className="text-gray-900 dark:text-white whitespace-pre-line">
            {response}
          </p>
        </motion.div>
      )}
    </motion.div>
  );
};

export default AIAssistant;
