import React from 'react';
import {
  CurrencyDollarIcon,
  TrendingUpIcon,
  TrendingDownIcon,
} from '@heroicons/react/24/outline';
import { ResponsivePie } from '@nivo/pie';
import { FinancialOverviewData } from '../../types';

interface FinancialOverviewProps {
  data: FinancialOverviewData;
}

const FinancialOverview: React.FC<FinancialOverviewProps> = ({ data }) => {
  const pieData = [
    {
      id: 'Assets',
      label: 'Assets',
      value: data.totalAssets,
      color: '#28a745', // Green for positive
    },
    {
      id: 'Liabilities',
      label: 'Liabilities',
      value: data.totalLiabilities,
      color: '#dc3545', // Red for liabilities
    },
  ];

  return (
    <div className="p-6 bg-white dark:bg-gray-800 rounded-lg shadow space-y-6">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white">
        Financial Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Net Worth Card */}
        <div className="flex items-center bg-green-100 dark:bg-green-900 p-4 rounded-lg shadow-lg">
          <CurrencyDollarIcon className="h-12 w-12 text-green-600 animate-pulse" />
          <div className="ml-4">
            <p className="text-sm text-gray-500 dark:text-gray-300">
              Net Worth
            </p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white">
              ${data.netWorth.toLocaleString()}
            </p>
          </div>
        </div>

        {/* Monthly Income and Expenses Overview */}
        <div className="flex flex-col space-y-4">
          <div className="flex items-center bg-blue-100 dark:bg-blue-900 p-4 rounded-lg shadow-lg">
            <TrendingUpIcon className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Monthly Income
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ${data.totalAssets.toLocaleString()}
              </p>
            </div>
          </div>

          <div className="flex items-center bg-red-100 dark:bg-red-900 p-4 rounded-lg shadow-lg">
            <TrendingDownIcon className="h-8 w-8 text-red-600" />
            <div className="ml-3">
              <p className="text-sm text-gray-500 dark:text-gray-300">
                Monthly Expenses
              </p>
              <p className="text-lg font-bold text-gray-900 dark:text-white">
                ${data.totalLiabilities.toLocaleString()}
              </p>
            </div>
          </div>
        </div>

        {/* Assets vs. Liabilities Pie Chart */}
        <div className="col-span-2 h-64">
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
            Assets vs. Liabilities
          </h3>
          <ResponsivePie
            data={pieData}
            margin={{ top: 40, right: 80, bottom: 80, left: 80 }}
            innerRadius={0.5}
            padAngle={1}
            cornerRadius={5}
            activeOuterRadiusOffset={8}
            colors={pieData.map(d => d.color)}
            borderWidth={1}
            borderColor={{
              from: 'color',
              modifiers: [['darker', 0.2]],
            }}
            arcLabelsSkipAngle={10}
            arcLabelsTextColor={{
              from: 'color',
              modifiers: [['darker', 2]],
            }}
            arcLinkLabelsSkipAngle={10}
            arcLinkLabelsTextColor="#333333"
            arcLinkLabelsThickness={2}
            arcLinkLabelsColor={{ from: 'color' }}
            tooltip={({ datum }) => (
              <div className="p-2 text-xs font-medium bg-white dark:bg-gray-800 rounded shadow-lg">
                {datum.label}: ${datum.value.toLocaleString()} (
                {((datum.value / data.netWorth) * 100).toFixed(2)}%)
              </div>
            )}
          />
        </div>
      </div>
    </div>
  );
};

export default FinancialOverview;
