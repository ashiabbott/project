import React from 'react';
import AdvancedAnalytics from '../../components/Analytics/AdvancedAnalytics';
import AIInsights from '../../components/AI/AIInsights';

const AnalyticsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">Analytics</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <AdvancedAnalytics />
        <AIInsights />
      </div>
    </div>
  );
};

export default AnalyticsPage;
