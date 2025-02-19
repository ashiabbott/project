import React from 'react';
import { ResponsiveLine } from '@nivo/line';

interface Prediction {
  date: string;
  income: number;
  expenses: number;
  savings: number;
}

interface PredictiveAnalysisProps {
  predictions: Prediction[];
}

const PredictiveAnalysis: React.FC<PredictiveAnalysisProps> = ({
  predictions,
}) => {
  const data = [
    {
      id: 'Income',
      data: predictions.map(p => ({ x: p.date, y: p.income })),
    },
    {
      id: 'Expenses',
      data: predictions.map(p => ({ x: p.date, y: p.expenses })),
    },
    {
      id: 'Savings',
      data: predictions.map(p => ({ x: p.date, y: p.savings })),
    },
  ];

  return (
    <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6">
      <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
        Predictive Analysis
      </h3>
      <div style={{ height: '400px' }}>
        <ResponsiveLine
          data={data}
          margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
          xScale={{ type: 'point' }}
          yScale={{
            type: 'linear',
            min: 'auto',
            max: 'auto',
            stacked: false,
            reverse: false,
          }}
          yFormat=" >-.2f"
          axisTop={null}
          axisRight={null}
          axisBottom={{
            tickSize: 5,
            tickPadding: 5,
            tickRotation: 0,
            legend: 'Date',
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
  );
};

export default PredictiveAnalysis;
