import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CurrencyDollarIcon,
  TrendingUpIcon,
  CreditCardIcon,
  BanknotesIcon,
} from '@heroicons/react/24/outline';
import FinancialOverview from '../components/Dashboard/FinancialOverview';
import RecentTransactions from '../components/Dashboard/RecentTransactions';
import BudgetOverview from '../components/Budget/BudgetOverview';
import GoalsProgress from '../components/Dashboard/GoalsProgress';
import InvestmentPortfolio from '../components/Dashboard/InvestmentPortfolio';
import AIFinancialAdvisor from '../components/Dashboard/AIFinancialAdvisor';
import ExpenseTrends from '../components/Dashboard/ExpenseTrends';
import NetWorthGrowth from '../components/Dashboard/NetWorthGrowth';
import SavingsRateCalculator from '../components/Dashboard/SavingsRateCalculator';
import CreditUtilization from '../components/Dashboard/CreditUtilization';
import Navbar from '../components/Navbar';
import api from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

const Dashboard: React.FC = () => {
  const [dashboardData, setDashboardData] = useState<any | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await api.get('/dashboard');
        setDashboardData(response.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <motion.main
        className="container mx-auto px-4 py-6 space-y-6"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
      >
        <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
          Dashboard
        </h1>

        {/* Financial Overview */}
        <FinancialOverview data={dashboardData.financialOverview} />

        {/* Cards for Quick Stats */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <DashboardCard
            icon={<CurrencyDollarIcon className="h-8 w-8" />}
            title="Total Balance"
            amount={dashboardData.totalBalance}
            gradient="from-blue-500 to-blue-600"
          />
          <DashboardCard
            icon={<TrendingUpIcon className="h-8 w-8" />}
            title="Monthly Income"
            amount={dashboardData.monthlyIncome}
            gradient="from-green-500 to-green-600"
          />
          <DashboardCard
            icon={<CreditCardIcon className="h-8 w-8" />}
            title="Monthly Expenses"
            amount={dashboardData.monthlyExpenses}
            gradient="from-red-500 to-red-600"
          />
          <DashboardCard
            icon={<BanknotesIcon className="h-8 w-8" />}
            title="Savings"
            amount={dashboardData.savings}
            gradient="from-purple-500 to-purple-600"
          />
        </div>

        {/* Grid Layout for Widgets */}
        <div className="grid grid-cols-1 lg:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <RecentTransactions transactions={dashboardData.transactions} />

          {/* Budget Overview */}
          <BudgetOverview budget={dashboardData.budget} />

          {/* Goals Progress */}
          <GoalsProgress goals={dashboardData.goals} />

          {/* Additional Widgets */}
          <InvestmentPortfolio investments={dashboardData.investments} />
          <AIFinancialAdvisor advice={dashboardData.aiAdvice} />
          <ExpenseTrends data={dashboardData.expenseTrends} />
          <NetWorthGrowth data={dashboardData.netWorthGrowth} />
          <SavingsRateCalculator savingsData={dashboardData.savingsRate} />
          <CreditUtilization creditData={dashboardData.creditUtilization} />
        </div>
      </motion.main>
    </div>
  );
};

interface DashboardCardProps {
  icon: React.ReactNode;
  title: string;
  amount: number;
  gradient: string;
}

const DashboardCard: React.FC<DashboardCardProps> = ({
  icon,
  title,
  amount,
  gradient,
}) => (
  <motion.div
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.3 }}
    className={`bg-gradient-to-br ${gradient} rounded-lg shadow-lg p-6 text-white`}
  >
    <div className="flex items-center space-x-4">
      {icon}
      <div>
        <h2 className="text-lg font-semibold">{title}</h2>
        <p className="text-3xl font-bold">${amount.toLocaleString()}</p>
      </div>
    </div>
  </motion.div>
);

export default Dashboard;
