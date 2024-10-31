import React from 'react';
import TwoFactorAuth from '../../components/Security/TwoFactorAuth';

const SecurityPage: React.FC = () => {
  return (
    <div>
      <h1 className="text-3xl font-semibold text-gray-900 mb-6">
        Security Settings
      </h1>
      <TwoFactorAuth />
    </div>
  );
};

export default SecurityPage;
