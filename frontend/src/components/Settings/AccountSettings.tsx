import React from 'react';
import { useDispatch } from 'react-redux';
import { deactivateAccount } from '../../store/slices/profileSlice';

const AccountSettings: React.FC = () => {
  const dispatch = useDispatch();

  const handleDeactivate = () => {
    // Confirm before deactivation
    if (window.confirm('Are you sure you want to deactivate your account?')) {
      dispatch(deactivateAccount());
    }
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-lg">
      <h2 className="text-2xl font-bold text-red-600 mb-4">Account Settings</h2>
      <button
        onClick={handleDeactivate}
        className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
      >
        Deactivate Account
      </button>
    </div>
  );
};

export default AccountSettings;
