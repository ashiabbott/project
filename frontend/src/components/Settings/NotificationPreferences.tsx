import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateNotifications } from '../../store/slices/profileSlice';
import { RootState } from '../../store';

const NotificationPreferences: React.FC = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector((state: RootState) => state.profile);
  const [emailNotifications, setEmailNotifications] = useState(
    notifications.email
  );
  const [smsNotifications, setSmsNotifications] = useState(notifications.sms);

  const handleSave = () => {
    dispatch(
      updateNotifications({ email: emailNotifications, sms: smsNotifications })
    );
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
        Notification Preferences
      </h2>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={emailNotifications}
            onChange={e => setEmailNotifications(e.target.checked)}
            className="mr-2"
          />
          <span className="text-gray-700 dark:text-gray-300">
            Email Notifications
          </span>
        </label>
      </div>
      <div className="mb-4">
        <label className="flex items-center">
          <input
            type="checkbox"
            checked={smsNotifications}
            onChange={e => setSmsNotifications(e.target.checked)}
            className="mr-2"
          />
          <span className="text-gray-700 dark:text-gray-300">
            SMS Notifications
          </span>
        </label>
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

export default NotificationPreferences;
