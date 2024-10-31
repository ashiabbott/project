import React, { useState, useEffect } from 'react';
import { UpdateProfileModal } from '../components/Settings/UpdateProfileModal';
import { ChangePasswordModal } from '../components/Settings/ChangePasswordModal';
import { motion } from 'framer-motion';
import { UserData } from '../types';
import axios from '../api/axiosConfig';

const SettingsPage: React.FC = () => {
  const [isUpdateProfileOpen, setIsUpdateProfileOpen] =
    useState<boolean>(false);
  const [isChangePasswordOpen, setIsChangePasswordOpen] =
    useState<boolean>(false);
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string>('');

  // Fetch user data from the backend API
  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get<UserData>('/api/settings/profile');
        setUser(response.data);
        setLoading(false);
      } catch (err: any) {
        console.error('Fetch User Data Error:', err);
        setError('Failed to fetch user data. Please try again later.');
        setLoading(false);
      }
    };

    fetchUserData();
  }, []);

  // Render
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
      <motion.h1
        className="text-3xl font-bold text-gray-900 dark:text-gray-100 mb-6"
        initial={{ opacity: 0, y: -10 }}
        animate={{ opacity: 1, y: 0 }}
      >
        Settings
      </motion.h1>

      {loading ? (
        <div>Loading...</div>
      ) : error ? (
        <div className="text-red-600 dark:text-red-400">{error}</div>
      ) : user ? (
        <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-6 space-y-6">
          {/* Profile Section */}
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                Profile
              </h2>
              <button
                onClick={() => setIsUpdateProfileOpen(true)}
                className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              >
                Update Profile
              </button>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Manage your account details and personal information.
            </p>
            <div className="mt-4">
              <p className="text-gray-800 dark:text-gray-300">
                <strong>Name:</strong> {user.name}
              </p>
              <p className="text-gray-800 dark:text-gray-300 mt-2">
                <strong>Email:</strong> {user.email}
              </p>
            </div>
          </div>

          {/* Security Section */}
          <div>
            <div className="flex justify-between items-center">
              <h2 className="text-xl font-semibold text-gray-700 dark:text-gray-200">
                Security
              </h2>
              <button
                onClick={() => setIsChangePasswordOpen(true)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500"
              >
                Change Password
              </button>
            </div>
            <p className="mt-2 text-gray-600 dark:text-gray-400">
              Update your account password and enhance security.
            </p>
          </div>
        </div>
      ) : null}

      {/* Modals */}
      {isUpdateProfileOpen && user && (
        <UpdateProfileModal
          closeModal={() => setIsUpdateProfileOpen(false)}
          user={user}
          setUser={setUser}
        />
      )}

      {isChangePasswordOpen && (
        <ChangePasswordModal
          closeModal={() => setIsChangePasswordOpen(false)}
        />
      )}
    </div>
  );
};

export default SettingsPage;
