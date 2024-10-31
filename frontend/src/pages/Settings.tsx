import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { toggleDarkMode } from '../store/slices/themeSlice';
import { RootState } from '../store';

const Settings: React.FC = () => {
  const dispatch = useDispatch();
  const darkMode = useSelector((state: RootState) => state.theme.darkMode);

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Settings
      </h1>

      <div className="bg-white dark:bg-gray-800 shadow overflow-hidden sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg leading-6 font-medium text-gray-900 dark:text-white">
            Appearance
          </h3>
          <div className="mt-2 max-w-xl text-sm text-gray-500 dark:text-gray-300">
            <p>Customize the app's appearance to your liking.</p>
          </div>
          <div className="mt-5">
            <div className="flex items-center">
              <span className="mr-3 text-sm font-medium text-gray-900 dark:text-white">
                Light
              </span>
              <button
                type="button"
                className={`${
                  darkMode ? 'bg-indigo-600' : 'bg-gray-200'
                } relative inline-flex flex-shrink-0 h-6 w-11 border-2 border-transparent rounded-full cursor-pointer transition-colors ease-in-out duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500`}
                onClick={() => dispatch(toggleDarkMode())}
                aria-pressed={darkMode}
              >
                <span className="sr-only">Toggle dark mode</span>
                <span
                  aria-hidden="true"
                  className={`${
                    darkMode ? 'translate-x-5' : 'translate-x-0'
                  } pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow transform ring-0 transition ease-in-out duration-200`}
                />
              </button>
              <span className="ml-3 text-sm font-medium text-gray-900 dark:text-white">
                Dark
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* Add more settings sections here */}
    </div>
  );
};

export default Settings;
