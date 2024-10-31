// src/components/Visualizations/AdvancedVisualization.tsx

import React, { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { fetchFinanceData } from '../../store/slices/financeSlice';
import BarChartVisualization from './BarChartVisualization';
import SankeyChartVisualization from './SankeyChartVisualization';

const AdvancedVisualization: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();

  useEffect(() => {
    dispatch(fetchFinanceData());
  }, [dispatch]);

  return (
    <div className="space-y-8">
      <BarChartVisualization />
      <SankeyChartVisualization />
    </div>
  );
};

export default AdvancedVisualization;
