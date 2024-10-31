import React from 'react';
import { ResponsiveLine } from '@nivo/line';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const ExpenseTrendsChart: React.FC = () => {
  const { expenseTrends } = useSelector((state: RootState) => state.analytics);

  return (
    <div className="h-80 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Expense Trends
      </h2>
      <ResponsiveLine
        data={expenseTrends}
        margin={{ top: 20, right: 110, bottom: 50, left: 60 }}
        xScale={{ type: 'point' }}
        yScale={{ type: 'linear', stacked: false }}
        axisBottom={{ tickRotation: -45 }}
        colors={{ scheme: 'nivo' }}
        pointSize={8}
        pointBorderWidth={2}
        pointBorderColor={{ from: 'serieColor' }}
        useMesh={true}
        theme={{
          textColor: 'var(--text-color)',
          grid: { line: { stroke: 'var(--grid-line-color)' } },
        }}
      />
    </div>
  );
};

export default ExpenseTrendsChart;
