import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode.react';
import api from '../../services/api';

const TwoFactorSetup: React.FC = () => {
  const [qrCodeUrl, setQrCodeUrl] = useState('');
  const [secret, setSecret] = useState('');

  useEffect(() => {
    const fetch2FAData = async () => {
      try {
        const response = await api.get('/auth/2fa/setup');
        setQrCodeUrl(response.data.qrCodeUrl);
        setSecret(response.data.secret);
      } catch (error) {
        console.error('Error fetching 2FA data:', error);
      }
    };
    fetch2FAData();
  }, []);

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Set Up Two-Factor Authentication
      </h2>
      <p className="mb-4 text-gray-700 dark:text-gray-300">
        Scan the QR code with your authenticator app.
      </p>
      {qrCodeUrl && (
        <QRCode value={qrCodeUrl} size={200} className="mx-auto mb-4" />
      )}
      <p className="text-sm text-gray-500 dark:text-gray-400">
        If you cannot scan the QR code, use this secret key:{' '}
        <strong>{secret}</strong>
      </p>
    </div>
  );
};

export default TwoFactorSetup;
