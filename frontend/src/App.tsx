// src/App.tsx

import React, { lazy, Suspense, useEffect } from 'react';
import { Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import ErrorBoundary from './components/ErrorBoundary/ErrorBoundary';
import DashboardLayout from './components/Layout/DashboardLayout';
import PrivateRoute from './components/Auth/PrivateRoute';
import LoadingSpinner from './components/Loading/LoadingSpinner';
import Notifications from './components/Notifications/Notifications';
import { fetchNotifications } from './store/slices/notificationSlice';
import { useAppDispatch, useAppSelector } from './hooks';

// Lazy-loaded Pages
const HomePage = lazy(() => import('./pages/HomePage'));
const LoginPage = lazy(() => import('./pages/auth/LoginPage'));
const RegisterPage = lazy(() => import('./pages/auth/RegisterPage'));
const ForgotPasswordPage = lazy(
  () => import('./pages/auth/ForgotPasswordPage')
);
const FeaturesPage = lazy(() => import('./pages/FeaturesPage'));
const NotFoundPage = lazy(() => import('./pages/NotFoundPage'));
const DashboardPage = lazy(() => import('./pages/dashboard/DashboardPage'));
const TransactionsPage = lazy(
  () => import('./pages/transactions/TransactionsPage')
);
const BudgetPage = lazy(() => import('./pages/budget/BudgetPage'));
const GoalsPage = lazy(() => import('./pages/goals/GoalsPage'));
const SettingsPage = lazy(() => import('./pages/SettingsPage'));
const AddGoalPage = lazy(() => import('./pages/goals/AddGoalPage'));
const EditGoalPage = lazy(() => import('./pages/goals/EditGoalPage'));
const GoalDetailPage = lazy(() => import('./pages/goals/GoalDetailPage'));
const AddTransactionPage = lazy(
  () => import('./pages/transactions/AddTransactionPage')
);
const EditTransactionPage = lazy(
  () => import('./pages/transactions/EditTransactionPage')
);
const InvestmentList = lazy(
  () => import('./components/Investments/InvestmentList')
);
const AddInvestmentPage = lazy(
  () => import('./pages/investments/AddInvestmentPage')
);
const EditInvestmentPage = lazy(
  () => import('./pages/investments/EditInvestmentPage')
);

function App() {
  const location = useLocation();
  const isAuthenticated = useAppSelector(state => state.auth.isAuthenticated);
  const dispatch = useAppDispatch();

  useEffect(() => {
    if (isAuthenticated) {
      dispatch(fetchNotifications());
    }
  }, [isAuthenticated, dispatch]);

  const pageVariants = {
    initial: { opacity: 0, y: 20, scale: 0.98 },
    in: { opacity: 1, y: 0, scale: 1 },
    out: { opacity: 0, y: -20, scale: 0.98 },
  };

  const pageTransition = {
    type: 'tween' as const,
    ease: 'anticipate',
    duration: 0.5,
  };

  return (
    <ErrorBoundary>
      <Notifications />
      <AnimatePresence mode="wait">
        <Suspense fallback={<LoadingSpinner />}>
          <Routes location={location} key={location.pathname}>
            {/* Public Routes */}
            <Route
              path="/"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <HomePage />
                )
              }
            />
            <Route
              path="/login"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <LoginPage />
                )
              }
            />
            <Route
              path="/register"
              element={
                isAuthenticated ? (
                  <Navigate to="/dashboard" replace />
                ) : (
                  <RegisterPage />
                )
              }
            />
            <Route path="/forgot-password" element={<ForgotPasswordPage />} />
            <Route path="/features" element={<FeaturesPage />} />

            {/* Protected Routes */}
            <Route element={<PrivateRoute />}>
              <Route element={<DashboardLayout />}>
                <Route path="/dashboard" element={<DashboardPage />} />
                <Route path="/transactions" element={<TransactionsPage />} />
                <Route
                  path="/transactions/add"
                  element={<AddTransactionPage />}
                />
                <Route
                  path="/transactions/edit/:id"
                  element={<EditTransactionPage />}
                />
                <Route path="/investments" element={<InvestmentList />} />
                <Route
                  path="/investments/add"
                  element={<AddInvestmentPage />}
                />
                <Route
                  path="/investments/edit/:id"
                  element={<EditInvestmentPage />}
                />
                <Route path="/budget" element={<BudgetPage />} />
                <Route path="/goals" element={<GoalsPage />} />
                <Route path="/goals/add" element={<AddGoalPage />} />
                <Route path="/goals/edit/:id" element={<EditGoalPage />} />
                <Route path="/goals/:id" element={<GoalDetailPage />} />
                <Route path="/settings" element={<SettingsPage />} />
              </Route>
            </Route>

            {/* Catch-all Route */}
            <Route path="*" element={<NotFoundPage />} />
          </Routes>
        </Suspense>
      </AnimatePresence>
    </ErrorBoundary>
  );
}

export default App;
