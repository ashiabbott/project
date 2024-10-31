import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../../services/api';

const EmailVerification: React.FC = () => {
  const { token } = useParams<{ token: string }>();
  const [message, setMessage] = useState('Verifying your email...');
  const navigate = useNavigate();

  useEffect(() => {
    const verifyEmail = async () => {
      try {
        await api.post('/auth/verify-email', { token });
        setMessage('Your email has been verified successfully!');
        setTimeout(() => navigate('/login'), 3000);
      } catch (error) {
        setMessage('Invalid or expired verification link.');
      }
    };
    verifyEmail();
  }, [token, navigate]);

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-800 rounded-lg shadow text-center">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Email Verification
      </h2>
      <p className="text-gray-700 dark:text-gray-300">{message}</p>
    </div>
  );
};

export default EmailVerification;
