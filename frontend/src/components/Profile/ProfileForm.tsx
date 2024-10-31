import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateProfile } from '../../store/slices/profileSlice';
import { RootState } from '../../store';

const ProfileForm: React.FC = () => {
  const dispatch = useDispatch();
  const { user } = useSelector((state: RootState) => state.profile);
  const [name, setName] = useState(user?.name || '');
  const [email] = useState(user?.email || ''); // Email is usually not editable

  const handleSave = () => {
    dispatch(updateProfile({ name }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Edit Profile
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Name
        </label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        />
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Email
        </label>
        <input
          type="email"
          value={email}
          disabled
          className="w-full p-2 border rounded bg-gray-200 dark:bg-gray-700 dark:text-gray-400 cursor-not-allowed"
        />
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Changes
      </button>
    </div>
  );
};

export default ProfileForm;
