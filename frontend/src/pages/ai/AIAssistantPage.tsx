import React from 'react';
import AIAssistant from '../../components/AI/AIAssistant';
import InvestmentTracker from '../../components/Investments/InvestmentTracker';

const AIAssistantPage: React.FC = () => {
  return (
    <div className="space-y-8">
      <h1 className="text-3xl font-semibold text-primary-light">
        AI Financial Assistant
      </h1>
      <AIAssistant />
      <InvestmentTracker />
    </div>
  );
};

export default AIAssistantPage;
