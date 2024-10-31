import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updatePreferences } from '../../store/slices/profileSlice';
import { RootState } from '../../store';

const Preferences: React.FC = () => {
  const dispatch = useDispatch();
  const { preferences } = useSelector((state: RootState) => state.profile);
  const [theme, setTheme] = useState(preferences.theme || 'light');
  const [language, setLanguage] = useState(preferences.language || 'en');

  const handleSave = () => {
    dispatch(updatePreferences({ theme, language }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Preferences
      </h2>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Theme
        </label>
        <select
          value={theme}
          onChange={e => setTheme(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          {/* More themes if available */}
        </select>
      </div>
      <div className="mb-4">
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Language
        </label>
        <select
          value={language}
          onChange={e => setLanguage(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="en">English</option>
          {/* Add more language options */}
        </select>
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Save Preferences
      </button>
    </div>
  );
};

export default Preferences;
