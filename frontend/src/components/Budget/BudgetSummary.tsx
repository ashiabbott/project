import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { ResponsiveLine } from '@nivo/line';

const BudgetSummary: React.FC = () => {
  const { totalBudget, spentAmount, categories } = useSelector(
    (state: RootState) => state.budget
  );

  const lineData = [
    {
      id: 'Spent',
      data: categories.map((category, index) => ({
        x: category.name,
        y: category.spent,
      })),
    },
    {
      id: 'Allocated',
      data: categories.map((category, index) => ({
        x: category.name,
        y: category.allocated,
      })),
    },
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Budget Summary
      </h2>
      <div className="h-80">
        <ResponsiveLine
          data={lineData}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false,
          }}
          axisTop={null}
          axisRight={null}
          axisBottom={{
            orient: 'bottom',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: -45,
            legend: 'Category',
            legendOffset: 36,
            legendPosition: 'middle',
          }}
          axisLeft={{
            orient: 'left',
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Amount',
            legendOffset: -50,
            legendPosition: 'middle',
          }}
          colors={{ scheme: 'set2' }}
          pointSize={10}
          pointColor={{ theme: 'background' }}
          pointBorderWidth={2}
          pointBorderColor={{ from: 'serieColor' }}
          pointLabelYOffset={-12}
          useMesh={true}
          legends={[
            {
              anchor: 'bottom-right',
              direction: 'column',
              justify: false,
              translateX: 100,
              translateY: 0,
              itemsSpacing: 0,
              itemDirection: 'left-to-right',
              itemWidth: 80,
              itemHeight: 20,
              itemOpacity: 0.75,
              symbolSize: 12,
              symbolShape: 'circle',
              symbolBorderColor: 'rgba(0, 0, 0, .5)',
            },
          ]}
        />
      </div>
    </div>
  );
};

export default BudgetSummary;
