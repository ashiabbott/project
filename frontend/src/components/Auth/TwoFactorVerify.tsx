import React, { useState } from 'react';
import api from '../../services/api';
import { useNavigate } from 'react-router-dom';

const TwoFactorVerify: React.FC = () => {
  const [token, setToken] = useState('');
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const handleVerify = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/auth/2fa/verify', { token });
      navigate('/dashboard');
    } catch (err) {
      setError('Invalid authentication code.');
    }
  };

  return (
    <div className="max-w-md mx-auto mt-20 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Two-Factor Authentication
      </h2>
      <form onSubmit={handleVerify}>
        <label
          htmlFor="token"
          className="block text-gray-700 dark:text-gray-300"
        >
          Authentication Code
        </label>
        <input
          id="token"
          name="token"
          type="text"
          className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
          value={token}
          onChange={e => setToken(e.target.value)}
        />
        {error && <p className="text-red-500 mb-4">{error}</p>}
        <button
          type="submit"
          className="w-full p-2 bg-green-500 text-white rounded hover:bg-green-600"
        >
          Verify
        </button>
      </form>
    </div>
  );
};

export default TwoFactorVerify;
