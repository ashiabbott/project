import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import Navbar from '../../components/Navbar';
import CurrencySettings from '../../components/Settings/CurrencySettings';

const ProfilePage: React.FC = () => {
  const { user } = useSelector((state: RootState) => state.profile);

  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Profile
        </h1>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Personal Information
          </h2>
          <p>
            <strong>Name:</strong> {user?.name}
          </p>
          <p>
            <strong>Email:</strong> {user?.email}
          </p>
          {/* Add more user info and settings */}
        </div>
        <CurrencySettings />
      </main>
    </div>
  );
};

export default ProfilePage;
