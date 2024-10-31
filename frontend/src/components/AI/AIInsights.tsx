import React from 'react';

interface Insight {
  id: string;
  title: string;
  description: string;
}

const AIInsights: React.FC = () => {
  // TODO: Fetch real insights from an AI service
  const insights: Insight[] = [
    {
      id: '1',
      title: 'Spending Trend',
      description: 'Your dining out expenses have increased by 15% this month.',
    },
    {
      id: '2',
      title: 'Savings Opportunity',
      description:
        'You could save $50 per month by switching to a different phone plan.',
    },
    {
      id: '3',
      title: 'Investment Tip',
      description:
        'Based on your risk profile, consider diversifying your portfolio with index funds.',
    },
  ];

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">AI Insights</h2>
      <ul>
        {insights.map(insight => (
          <li key={insight.id} className="mb-4">
            <h3 className="text-lg font-semibold">{insight.title}</h3>
            <p>{insight.description}</p>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AIInsights;
