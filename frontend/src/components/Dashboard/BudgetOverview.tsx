import React from 'react';
import { Pie } from 'react-chartjs-2';
import { motion } from 'framer-motion';
import { Budget } from '../../types';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

interface BudgetOverviewProps {
  budget: Budget | undefined;
}

const BudgetOverview: React.FC<BudgetOverviewProps> = ({ budget }) => {
  if (!budget) {
    return (
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg">
        <p className="text-gray-500 dark:text-gray-400">
          No budget data available.
        </p>
      </div>
    );
  }

  const data = {
    labels: ['Spent', 'Remaining'],
    datasets: [
      {
        data: [budget.spentAmount, budget.remainingAmount],
        backgroundColor: ['#EF4444', '#10B981'], // Red-500 and Green-500
        hoverBackgroundColor: ['#DC2626', '#059669'], // Darker shades on hover
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
        labels: {
          color: '#4B5563', // Tailwind gray-700
          font: {
            size: 14,
          },
        },
      },
      tooltip: {
        callbacks: {
          label: function (context: any) {
            let label = context.label || '';
            if (label) {
              label += ': ';
            }
            label += `$${context.parsed}`;
            return label;
          },
        },
      },
    },
  };

  return (
    <motion.div
      className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      role="region"
      aria-labelledby="budget-overview"
    >
      <h2
        id="budget-overview"
        className="text-xl font-semibold text-gray-800 dark:text-gray-100 mb-4"
      >
        Budget Overview
      </h2>
      <div className="flex flex-col items-center">
        <Pie data={data} options={options} />
        <div className="mt-4 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Total Budget: ${budget.totalBudget.toLocaleString()}
          </p>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Spent: ${budget.spentAmount.toLocaleString()} | Remaining: $
            {budget.remainingAmount.toLocaleString()}
          </p>
        </div>
      </div>
    </motion.div>
  );
};

export default BudgetOverview;
