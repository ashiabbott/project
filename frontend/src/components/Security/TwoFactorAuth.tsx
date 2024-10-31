import React, { useState } from 'react';

const TwoFactorAuth: React.FC = () => {
  const [isEnabled, setIsEnabled] = useState(false);
  const [verificationCode, setVerificationCode] = useState('');

  const handleToggle = () => {
    // TODO: Implement actual 2FA logic
    setIsEnabled(!isEnabled);
  };

  const handleVerify = (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement verification logic
    console.log('Verifying code:', verificationCode);
    setVerificationCode('');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Two-Factor Authentication</h2>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={isEnabled}
            onChange={handleToggle}
            className="mr-2"
          />
          Enable Two-Factor Authentication
        </label>
      </div>
      {isEnabled && (
        <form onSubmit={handleVerify}>
          <input
            type="text"
            value={verificationCode}
            onChange={e => setVerificationCode(e.target.value)}
            placeholder="Enter verification code"
            className="mr-2 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded"
          >
            Verify
          </button>
        </form>
      )}
    </div>
  );
};

export default TwoFactorAuth;
