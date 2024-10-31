import React from 'react';
import { Budget } from '../../types';
import { Doughnut } from 'react-chartjs-2';
import { Chart, ArcElement, Tooltip, Legend } from 'chart.js';

Chart.register(ArcElement, Tooltip, Legend);

interface BudgetChartProps {
  budget: Budget;
}

const BudgetChart: React.FC<BudgetChartProps> = ({ budget }) => {
  const data = {
    labels: budget.categories.map(category => category.name),
    datasets: [
      {
        data: budget.categories.map(category => category.spent),
        backgroundColor: [
          '#4ade80',
          '#f97316',
          '#14b8a6',
          '#f43f5e',
          '#6366f1',
          '#ec4899',
        ],
        hoverBackgroundColor: [
          '#22c55e',
          '#ea580c',
          '#0d9488',
          '#e11d48',
          '#4f46e5',
          '#db2777',
        ],
      },
    ],
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 rounded shadow">
      <h3 className="text-xl font-semibold text-gray-800 dark:text-gray-200 mb-4">
        Spending by Category
      </h3>
      <Doughnut data={data} />
    </div>
  );
};

export default BudgetChart;
