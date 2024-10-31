import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchFutureExpensePredictions,
  fetchSpendingPatterns,
} from '../store/slices/analyticsSlice';
import { AppDispatch, RootState } from '../store';
import AdvancedVisualization from '../components/Visualization/AdvancedVisualization';

const Analytics: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { futureExpenses, spendingPatterns, loading, error } = useSelector(
    (state: RootState) => state.analytics
  );

  useEffect(() => {
    dispatch(fetchFutureExpensePredictions());
    dispatch(fetchSpendingPatterns());
  }, [dispatch]);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
      <AdvancedVisualization
        futureExpenses={futureExpenses}
        spendingPatterns={spendingPatterns}
      />
    </div>
  );
};

export default Analytics;
