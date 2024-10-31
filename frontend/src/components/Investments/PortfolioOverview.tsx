import React from 'react';
import { ResponsivePie } from '@nivo/pie';
import { ResponsiveLine } from '@nivo/line';

interface Investment {
  id: string;
  name: string;
  value: number;
  performance: number;
}

interface PortfolioOverviewProps {
  investments: Investment[];
  historicalPerformance: { date: string; value: number }[];
}

export default function PortfolioOverview({
  investments,
  historicalPerformance,
}: PortfolioOverviewProps) {
  const totalValue = investments.reduce((sum, inv) => sum + inv.value, 0);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Portfolio Allocation</h2>
        <div style={{ height: '300px' }}>
          <ResponsivePie
            data={investments.map(inv => ({ id: inv.name, value: inv.value }))}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={0.7}
            cornerRadius={3}
            activeOuterRadiusOffset={8}
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
      <div className="bg-white rounded-lg shadow p-6">
        <h2 className="text-xl font-semibold mb-4">Investment Performance</h2>
        <ul className="space-y-2">
          {investments.map(inv => (
            <li key={inv.id} className="flex justify-between items-center">
              <span>{inv.name}</span>
              <span
                className={
                  inv.performance >= 0 ? 'text-green-600' : 'text-red-600'
                }
              >
                {inv.performance >= 0 ? '+' : ''}
                {inv.performance.toFixed(2)}%
              </span>
            </li>
          ))}
        </ul>
      </div>
      <div className="bg-white rounded-lg shadow p-6 col-span-2">
        <h2 className="text-xl font-semibold mb-4">Historical Performance</h2>
        <div style={{ height: '300px' }}>
          <ResponsiveLine
            data={[
              {
                id: 'portfolio value',
                color: 'hsl(120, 70%, 50%)',
                data: historicalPerformance,
              },
            ]}
            margin={{ top: 50, right: 110, bottom: 50, left: 60 }}
            xScale={{ type: 'point' }}
            yScale={{
              type: 'linear',
              min: 'auto',
              max: 'auto',
              stacked: true,
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
              legend: 'Value',
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
}
