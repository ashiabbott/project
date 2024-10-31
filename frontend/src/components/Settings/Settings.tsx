import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import { RootState, AppDispatch } from '../../store';
import {
  updateSettings,
  fetchUserSettings,
} from '../../store/slices/settingsSlice';
import { Switch } from '@headlessui/react';
import {
  CogIcon,
  BellIcon,
  LockClosedIcon,
  UserCircleIcon,
  CurrencyDollarIcon,
  GlobeIcon,
} from '@heroicons/react/outline';

const Settings: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { settings, loading, error } = useSelector(
    (state: RootState) => state.settings
  );
  const [localSettings, setLocalSettings] = useState(settings);

  useEffect(() => {
    dispatch(fetchUserSettings());
  }, [dispatch]);

  useEffect(() => {
    setLocalSettings(settings);
  }, [settings]);

  const handleToggle = (key: string) => {
    setLocalSettings(prev => ({ ...prev, [key]: !prev[key] }));
  };

  const handleCurrencyChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalSettings(prev => ({ ...prev, currency: e.target.value }));
  };

  const handleLanguageChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    setLocalSettings(prev => ({ ...prev, language: e.target.value }));
  };

  const handleSave = () => {
    dispatch(updateSettings(localSettings));
  };

  if (loading) return <div className="text-center">Loading settings...</div>;
  if (error)
    return <div className="text-center text-red-500">Error: {error}</div>;

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
    >
      <h2 className="text-2xl font-semibold mb-6 text-gray-900 dark:text-white flex items-center">
        <CogIcon className="w-6 h-6 mr-2" />
        Settings
      </h2>

      <div className="space-y-6">
        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <BellIcon className="w-5 h-5 mr-2" />
            Notifications
          </h3>
          <div className="space-y-4">
            <Switch.Group>
              <div className="flex items-center justify-between">
                <Switch.Label className="mr-4">
                  Email Notifications
                </Switch.Label>
                <Switch
                  checked={localSettings.emailNotifications}
                  onChange={() => handleToggle('emailNotifications')}
                  className={`${
                    localSettings.emailNotifications
                      ? 'bg-blue-600'
                      : 'bg-gray-200'
                  } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  <span
                    className={`${
                      localSettings.emailNotifications
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                  />
                </Switch>
              </div>
            </Switch.Group>
            <Switch.Group>
              <div className="flex items-center justify-between">
                <Switch.Label className="mr-4">Push Notifications</Switch.Label>
                <Switch
                  checked={localSettings.pushNotifications}
                  onChange={() => handleToggle('pushNotifications')}
                  className={`${
                    localSettings.pushNotifications
                      ? 'bg-blue-600'
                      : 'bg-gray-200'
                  } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
                >
                  <span
                    className={`${
                      localSettings.pushNotifications
                        ? 'translate-x-6'
                        : 'translate-x-1'
                    } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                  />
                </Switch>
              </div>
            </Switch.Group>
          </div>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <LockClosedIcon className="w-5 h-5 mr-2" />
            Privacy
          </h3>
          <Switch.Group>
            <div className="flex items-center justify-between">
              <Switch.Label className="mr-4">
                Two-Factor Authentication
              </Switch.Label>
              <Switch
                checked={localSettings.twoFactorAuth}
                onChange={() => handleToggle('twoFactorAuth')}
                className={`${
                  localSettings.twoFactorAuth ? 'bg-blue-600' : 'bg-gray-200'
                } relative inline-flex items-center h-6 rounded-full w-11 transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500`}
              >
                <span
                  className={`${
                    localSettings.twoFactorAuth
                      ? 'translate-x-6'
                      : 'translate-x-1'
                  } inline-block w-4 h-4 transform bg-white rounded-full transition-transform`}
                />
              </Switch>
            </div>
          </Switch.Group>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <UserCircleIcon className="w-5 h-5 mr-2" />
            Account
          </h3>
          <button
            className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            onClick={() => {
              /* Implement password change logic */
            }}
          >
            Change Password
          </button>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <CurrencyDollarIcon className="w-5 h-5 mr-2" />
            Currency
          </h3>
          <select
            value={localSettings.currency}
            onChange={handleCurrencyChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="USD">USD ($)</option>
            <option value="EUR">EUR (€)</option>
            <option value="GBP">GBP (£)</option>
            <option value="JPY">JPY (¥)</option>
          </select>
        </div>

        <div>
          <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-4 flex items-center">
            <GlobeIcon className="w-5 h-5 mr-2" />
            Language
          </h3>
          <select
            value={localSettings.language}
            onChange={handleLanguageChange}
            className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
          >
            <option value="en">English</option>
            <option value="es">Español</option>
            <option value="fr">Français</option>
            <option value="de">Deutsch</option>
          </select>
        </div>
      </div>

      <div className="mt-8">
        <button
          onClick={handleSave}
          className="w-full bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
        >
          Save Changes
        </button>
      </div>
    </motion.div>
  );
};

export default Settings;
