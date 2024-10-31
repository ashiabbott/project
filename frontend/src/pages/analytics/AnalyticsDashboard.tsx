import React, { useEffect } from 'react';
import Navbar from '../../components/Navbar';
import ExpenseTrendsChart from '../../components/Analytics/ExpenseTrendsChart';
import CategorySpendingChart from '../../components/Analytics/CategorySpendingChart';
import { useDispatch } from 'react-redux';
import { fetchAnalyticsData } from '../../store/slices/analyticsSlice';

const AnalyticsDashboard: React.FC = () => {
  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(fetchAnalyticsData());
  }, [dispatch]);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Analytics Dashboard
        </h1>
        <ExpenseTrendsChart />
        <CategorySpendingChart />
        {/* Add more analytics components as needed */}
      </main>
    </div>
  );
};

export default AnalyticsDashboard;
