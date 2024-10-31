// src/components/Notifications/NotificationCenter.tsx

import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { BellIcon, XMarkIcon } from '@heroicons/react/24/outline';
import { motion, AnimatePresence } from 'framer-motion';
import { RootState, AppDispatch } from '../../store';
import {
  fetchNotifications,
  removeNotification,
} from '../../store/slices/notificationSlice';

const NotificationCenter: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const notifications = useSelector(
    (state: RootState) => state.notifications.items
  );
  const hasUnread = notifications.some(n => !n.read);

  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchNotifications());

    const socket = new WebSocket('wss://your-api.com/notifications');
    socket.onmessage = event => {
      const newNotification = JSON.parse(event.data);
      dispatch({ type: 'notifications/add', payload: newNotification });
    };

    return () => {
      socket.close();
    };
  }, [dispatch]);

  const handleRemoveNotification = (id: string) => {
    dispatch(removeNotification(id));
  };

  return (
    <div className="relative">
      <button
        className="relative focus:outline-none"
        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
        aria-label="Notifications"
      >
        <BellIcon className="h-6 w-6 text-gray-600 dark:text-gray-300" />
        {hasUnread && (
          <span className="absolute top-0 right-0 inline-block w-2 h-2 bg-red-600 dark:bg-red-400 rounded-full" />
        )}
      </button>

      {isDropdownOpen && (
        <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden z-20">
          <div className="p-4">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
              Notifications
            </h3>
            <div className="mt-2">
              {notifications.length === 0 ? (
                <p className="text-gray-600 dark:text-gray-300">
                  You're all caught up!
                </p>
              ) : (
                <AnimatePresence>
                  {notifications.map(notification => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95 }}
                      className={`flex justify-between items-center p-2 mb-2 rounded-lg shadow-sm ${
                        notification.type === 'success'
                          ? 'bg-green-500'
                          : 'bg-red-500'
                      } text-white`}
                    >
                      <p className="text-sm">{notification.message}</p>
                      <button
                        onClick={() =>
                          handleRemoveNotification(notification.id)
                        }
                        className="ml-4 text-white hover:text-gray-200 focus:outline-none"
                        aria-label="Dismiss notification"
                      >
                        <XMarkIcon className="h-5 w-5" />
                      </button>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default NotificationCenter;
