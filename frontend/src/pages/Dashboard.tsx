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
import Navbar from '../components/Navbar';
import api from '../services/api';
import LoadingSpinner from '../components/UI/LoadingSpinner';
import ErrorMessage from '../components/UI/ErrorMessage';

interface Transaction {
  id: string;
  date: string;
  description: string;
  amount: number;
  category: string;
  type: 'income' | 'expense';
}

interface BudgetCategory {
  name: string;
  allocated: number;
  spent: number;
}

interface Budget {
  totalBudget: number;
  spentAmount: number;
  remainingAmount: number;
  categories: BudgetCategory[];
}

interface Goal {
  id: string;
  name: string;
  currentAmount: number;
  targetAmount: number;
  progress: number; // percentage
}

interface FinancialOverviewData {
  totalAssets: number;
  totalLiabilities: number;
  netWorth: number;
}

interface UserData {
  totalBalance: number;
  monthlyIncome: number;
  monthlyExpenses: number;
  savings: number;
  transactions: Transaction[];
  budget: Budget;
  goals: Goal[];
  financialOverview: FinancialOverviewData;
}

const Dashboard: React.FC = () => {
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await api.get<UserData>('/dashboard');
        setUserData(response.data);
      } catch (error: any) {
        setError(error.response?.data?.message || 'Failed to fetch user data');
      } finally {
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-6"
        >
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100">
            Dashboard
          </h1>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total Balance Card */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.3 }}
            className="bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg shadow-lg p-6 text-white"
            role="region"
            aria-labelledby="total-balance"
          >
            <CurrencyDollarIcon className="h-8 w-8 mb-4" aria-hidden="true" />
            <h2 id="total-balance" className="text-xl font-semibold mb-2">
              Total Balance
            </h2>
            <p className="text-3xl font-bold">
              ${userData!.totalBalance.toLocaleString()}
            </p>
          </motion.div>

          {/* Monthly Income Card */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.4 }}
            className="bg-gradient-to-br from-green-500 to-green-600 rounded-lg shadow-lg p-6 text-white"
            role="region"
            aria-labelledby="monthly-income"
          >
            <TrendingUpIcon className="h-8 w-8 mb-4" aria-hidden="true" />
            <h2 id="monthly-income" className="text-xl font-semibold mb-2">
              Monthly Income
            </h2>
            <p className="text-3xl font-bold">
              ${userData!.monthlyIncome.toLocaleString()}
            </p>
          </motion.div>

          {/* Monthly Expenses Card */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.5 }}
            className="bg-gradient-to-br from-red-500 to-red-600 rounded-lg shadow-lg p-6 text-white"
            role="region"
            aria-labelledby="monthly-expenses"
          >
            <CreditCardIcon className="h-8 w-8 mb-4" aria-hidden="true" />
            <h2 id="monthly-expenses" className="text-xl font-semibold mb-2">
              Monthly Expenses
            </h2>
            <p className="text-3xl font-bold">
              ${userData!.monthlyExpenses.toLocaleString()}
            </p>
          </motion.div>

          {/* Savings Card */}
          <motion.div
            initial="hidden"
            animate="visible"
            variants={{
              hidden: { opacity: 0, y: 20 },
              visible: { opacity: 1, y: 0 },
            }}
            transition={{ duration: 0.6 }}
            className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-lg shadow-lg p-6 text-white"
            role="region"
            aria-labelledby="savings"
          >
            <BanknotesIcon className="h-8 w-8 mb-4" aria-hidden="true" />
            <h2 id="savings" className="text-xl font-semibold mb-2">
              Savings
            </h2>
            <p className="text-3xl font-bold">
              ${userData!.savings.toLocaleString()}
            </p>
          </motion.div>
        </div>

        {/* Financial Overview and Recent Transactions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <FinancialOverview data={userData!.financialOverview} />
          <RecentTransactions transactions={userData!.transactions} />
        </div>

        {/* Budget Overview and Goals Progress */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
          <BudgetOverview budget={userData!.budget} />
          <GoalsProgress goals={userData!.goals} />
        </div>
      </main>
    </div>
  );
};

export default Dashboard;

import { Transaction, Budget, Goal, FinancialOverviewData } from '../types';

const Dashboard: React.FC = () => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [budget, setBudget] = useState<Budget | null>(null);
  const [goals, setGoals] = useState<Goal[]>([]);
  const [financialOverviewData, setFinancialOverviewData] =
    useState<FinancialOverviewData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const [transactionsRes, budgetRes, goalsRes, financialOverviewRes] =
          await Promise.all([
            api.get('/transactions'),
            api.get('/budget'),
            api.get('/goals'),
            api.get('/financial-overview'),
          ]);

        setTransactions(transactionsRes.data);
        setBudget(budgetRes.data);
        setGoals(goalsRes.data);
        setFinancialOverviewData(financialOverviewRes.data);
        setLoading(false);
      } catch (err) {
        setError('Failed to load dashboard data.');
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  if (error || !budget || !financialOverviewData) {
    return <ErrorMessage message={error || 'An unexpected error occurred.'} />;
  }

  return (
    <div className="p-6">
      <Navbar />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="max-w-7xl mx-auto space-y-6"
      >
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Dashboard
        </h1>

        {/* Financial Overview */}
        <section>
          <FinancialOverview data={financialOverviewData} />
        </section>

        {/* Grid Layout for Widgets */}
        <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {/* Recent Transactions */}
          <div className="col-span-1">
            <RecentTransactions transactions={transactions} />
          </div>

          {/* Budget Overview */}
          <div className="col-span-1">
            <BudgetOverview budget={budget} />
          </div>

          {/* Goals Progress */}
          <div className="col-span-1">
            <GoalsProgress goals={goals} />
          </div>
        </section>

        {/* Additional Widgets or Sections */}
        {/* Investment Portfolio, AI Advisor, etc. */}
      </motion.div>
    </div>
  );
};

export default Dashboard;
