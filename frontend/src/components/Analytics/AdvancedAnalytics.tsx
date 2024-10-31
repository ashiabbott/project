import React from 'react';
import { Line } from 'react-chartjs-2';

const AdvancedAnalytics: React.FC = () => {
  // TODO: Fetch real data from API
  const data = {
    labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
    datasets: [
      {
        label: 'Income',
        data: [4000, 3500, 4200, 3800, 4100, 4300, 4500],
        borderColor: 'rgb(75, 192, 192)',
        tension: 0.1,
      },
      {
        label: 'Expenses',
        data: [3000, 3200, 3100, 3400, 3300, 3600, 3500],
        borderColor: 'rgb(255, 99, 132)',
        tension: 0.1,
      },
    ],
  };

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top' as const,
      },
      title: {
        display: true,
        text: 'Income vs Expenses',
      },
    },
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Advanced Analytics</h2>
      <Line data={data} options={options} />
    </div>
  );
};

export default AdvancedAnalytics;
