import React, { useEffect, useState } from 'react';
import FinancialInsights from '../components/AI/FinancialInsights';
import AIAssistant from '../components/AI/AIAssistant';
import { fetchFinancialInsights } from '../api/aiAdvisorAPI';
import { Insight } from '../types';
import LoadingSpinner from '../components/Common/LoadingSpinner';

const AIAdvisor: React.FC = () => {
  const [insights, setInsights] = useState<Insight[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    // Fetch financial insights from the AI service
    const getInsights = async () => {
      try {
        const data = await fetchFinancialInsights();
        setInsights(data);
      } catch (err) {
        console.error('Error fetching insights:', err);
        setError('Failed to load financial insights.');
      } finally {
        setLoading(false);
      }
    };

    getInsights();
  }, []);

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
        AI Financial Advisor
      </h1>
      <FinancialInsights insights={insights} loading={loading} error={error} />
      <AIAssistant />
    </div>
  );
};

export default AIAdvisor;
