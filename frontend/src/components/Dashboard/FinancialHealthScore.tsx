import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import LoadingSpinner from '../UI/LoadingSpinner';

const FinancialHealthScore: React.FC = () => {
  const { score, factors, loading, error } = useSelector(
    (state: RootState) => state.financialHealth
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <div className="text-red-500">Error: {error}</div>;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Financial Health Score
      </h2>
      <div className="text-6xl font-bold text-center mb-4">{score}</div>
      <ul className="list-disc pl-5">
        {factors.map((factor, index) => (
          <li key={index} className="text-gray-600 dark:text-gray-300">
            {factor}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default FinancialHealthScore;
