import React from 'react';
import SubscriptionManager from '../../components/Subscriptions/SubscriptionManager';

const SubscriptionsPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        Subscription Management
      </h1>
      <SubscriptionManager />
    </div>
  );
};

export default SubscriptionsPage;
