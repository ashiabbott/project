// src/components/Visualizations/BarChartVisualization.tsx

import React from 'react';
import { ResponsiveBar } from '@nivo/bar';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const BarChartVisualization: React.FC = () => {
  const monthlyData = useSelector(
    (state: RootState) => state.finance.monthlyData
  );

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Monthly Income vs Expenses
      </h2>
      <div style={{ height: '400px' }}>
        <ResponsiveBar
          data={monthlyData}
          keys={['income', 'expenses']}
          indexBy="month"
          margin={{ top: 50, right: 130, bottom: 50, left: 60 }}
          padding={0.3}
          colors={{ scheme: 'nivo' }}
          borderColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Month',
            legendPosition: 'middle',
            legendOffset: 32,
          }}
          axisLeft={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Amount',
            legendPosition: 'middle',
            legendOffset: -40,
          }}
          labelSkipWidth={12}
          labelSkipHeight={12}
          labelTextColor={{ from: 'color', modifiers: [['darker', 1.6]] }}
          role="application"
          ariaLabel="Monthly income vs expenses bar chart"
          isInteractive={true}
        />
      </div>
    </div>
  );
};

export default BarChartVisualization;
