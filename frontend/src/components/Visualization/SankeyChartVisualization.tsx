// src/components/Visualizations/SankeyChartVisualization.tsx

import React from 'react';
import { ResponsiveSankey } from '@nivo/sankey';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const SankeyChartVisualization: React.FC = () => {
  const transactions = useSelector(
    (state: RootState) => state.finance.transactions
  );

  const nodes = Array.from(
    new Set(transactions.flatMap(({ source, target }) => [source, target]))
  ).map(id => ({ id }));

  return (
    <div className="h-96 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Income Distribution
      </h2>
      <ResponsiveSankey
        data={{ nodes, links: transactions }}
        margin={{ top: 40, right: 160, bottom: 40, left: 50 }}
        align="justify"
        colors={{ scheme: 'category10' }}
        nodeOpacity={1}
        nodeThickness={18}
        nodeInnerPadding={3}
        nodeSpacing={24}
        nodeBorderWidth={0}
        nodeBorderColor={{ from: 'color', modifiers: [['darker', 0.8]] }}
        linkOpacity={0.5}
        linkHoverOpacity={0.6}
        linkHoverOthersOpacity={0.1}
        enableLinkGradient={true}
        labelPosition="inside"
        labelOrientation="horizontal"
        labelPadding={16}
        labelTextColor={{ from: 'color', modifiers: [['darker', 1]] }}
      />
    </div>
  );
};

export default SankeyChartVisualization;
