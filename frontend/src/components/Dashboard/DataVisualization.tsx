import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';

const DataVisualization: React.FC = () => {
  const expenseData = [
    { id: 'Housing', value: 35 },
    { id: 'Food', value: 20 },
    { id: 'Transportation', value: 15 },
    { id: 'Entertainment', value: 10 },
    { id: 'Utilities', value: 10 },
    { id: 'Other', value: 10 },
  ];

  const incomeVsExpenseData = [
    {
      id: 'Income',
      data: [
        { x: 'Jan', y: 5000 },
        { x: 'Feb', y: 5200 },
        { x: 'Mar', y: 5100 },
        { x: 'Apr', y: 5300 },
        { x: 'May', y: 5400 },
        { x: 'Jun', y: 5600 },
      ],
    },
    {
      id: 'Expenses',
      data: [
        { x: 'Jan', y: 4000 },
        { x: 'Feb', y: 4100 },
        { x: 'Mar', y: 3900 },
        { x: 'Apr', y: 4200 },
        { x: 'May', y: 4100 },
        { x: 'Jun', y: 4300 },
      ],
    },
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Expense Breakdown
        </h3>
        <div style={{ height: '300px' }}>
          <ResponsivePie
            data={expenseData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
            colors={{ scheme: 'nivo' }}
            borderWidth={1}
            borderColor={{ from: 'color', modifiers: [['darker', 0.2]] }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{ from: 'color', modifiers: [['darker', 2]] }}
          />
        </div>
      </div>
      <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-4 text-gray-900 dark:text-white">
          Income vs Expenses
        </h3>
        <div style={{ height: '300px' }}>
          <ResponsiveLine
            data={incomeVsExpenseData}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: false,
              reverse: false,
            }}
            yFormat=" >-$,.2f"
            axisTop={null}
            axisRight={null}
            axisBottom={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Month',
              legendOffset: 36,
              legendPosition: 'middle',
            }}
            axisLeft={{
              tickSize: 5,
              tickPadding: 5,
              tickRotation: 0,
              legend: 'Amount',
              legendOffset: -40,
              legendPosition: 'middle',
            }}
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
                effects: [
                  {
                    on: 'hover',
                    style: {
                      itemBackground: 'rgba(0, 0, 0, .03)',
                      itemOpacity: 1,
                    },
                  },
                ],
              },
            ]}
          />
        </div>
      </div>
    </div>
  );
};

export default DataVisualization;
