import React, { useEffect, useState } from 'react';
import { BellIcon } from '@heroicons/react/outline';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchNotifications,
  markAllAsRead,
} from '../../store/slices/notificationSlice';
import { RootState } from '../../store';

const NotificationBell: React.FC = () => {
  const dispatch = useDispatch();
  const { notifications } = useSelector(
    (state: RootState) => state.notification
  );
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());
  }, [dispatch]);

  const unreadCount = notifications.filter(n => !n.read).length;

  const handleMarkAllAsRead = () => {
    dispatch(markAllAsRead());
  };

  return (
    <div className="relative">
      <button onClick={() => setIsOpen(!isOpen)} className="relative">
        <BellIcon className="w-6 h-6 text-gray-700 dark:text-gray-300" />
        {unreadCount > 0 && (
          <span className="absolute top-0 right-0 inline-flex items-center justify-center px-1 py-0.5 text-xs font-bold leading-none text-red-100 bg-red-600 rounded-full">
            {unreadCount}
          </span>
        )}
      </button>
      {isOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 shadow-lg rounded-lg overflow-hidden z-50">
          <div className="p-4 flex justify-between items-center">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            <button
              onClick={handleMarkAllAsRead}
              className="text-blue-500 hover:underline"
            >
              Mark all as read
            </button>
          </div>
          <ul>
            {notifications.map(notification => (
              <li
                key={notification.id}
                className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-700"
              >
                <p
                  className={`text-sm ${
                    notification.read
                      ? 'text-gray-500'
                      : 'text-gray-900 dark:text-white'
                  }`}
                >
                  {notification.message}
                </p>
                <span className="text-xs text-gray-400">
                  {notification.createdAt}
                </span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
};

export default NotificationBell;
