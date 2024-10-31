import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchDashboardData } from '../../store/slices/dashboardSlice';
import { RootState, AppDispatch } from '../../store';
import Navbar from '../../components/Navbar';
import FinancialOverview from '../../components/Dashboard/FinancialOverview';
import RecentTransactions from '../../components/Dashboard/RecentTransactions';
import BudgetOverview from '../../components/Budget/BudgetOverview';
import GoalsProgress from '../../components/Dashboard/GoalsProgress';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const DashboardPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    data: userData,
    loading,
    error,
  } = useSelector((state: RootState) => state.dashboard);

  useEffect(() => {
    dispatch(fetchDashboardData());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />

      <main className="container mx-auto px-4 py-6">
        {/* Dashboard content */}
        {/* Similar to previous, but using real data from userData */}
      </main>
    </div>
  );
};

export default DashboardPage;
