// src/components/Notifications/NotificationProvider.tsx

import React, { useEffect } from 'react';
import { removeNotification } from '../../store/slices/notificationSlice';
import { motion, AnimatePresence } from 'framer-motion';
import { XMarkIcon } from '@heroicons/react/24/outline';
import { useAppSelector, useAppDispatch } from '../../hooks';

const NotificationProvider: React.FC = () => {
  const dispatch = useAppDispatch();
  const notifications = useAppSelector(
    state => state.notifications.notifications
  );

  useEffect(() => {
    notifications.forEach(notification => {
      // Auto-dismiss notifications after 5 seconds
      const timer = setTimeout(() => {
        dispatch(removeNotification(notification.id));
      }, 5000);

      // Clear timeout if the component unmounts or notification changes
      return () => clearTimeout(timer);
    });
  }, [notifications, dispatch]);

  return (
    <div className="fixed top-5 right-5 z-50 space-y-2">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, y: -20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.95 }}
            transition={{ duration: 0.3 }}
            className={`max-w-xs w-full px-4 py-3 rounded shadow-lg flex items-start ${
              notification.type === 'success'
                ? 'bg-green-500 text-white'
                : notification.type === 'error'
                  ? 'bg-red-500 text-white'
                  : notification.type === 'warning'
                    ? 'bg-yellow-500 text-white'
                    : 'bg-blue-500 text-white'
            }`}
          >
            <div className="flex-1">
              <p className="text-sm">{notification.message}</p>
              <p className="mt-1 text-xs opacity-75">
                {new Date(notification.timestamp).toLocaleTimeString([], {
                  hour: '2-digit',
                  minute: '2-digit',
                })}
              </p>
            </div>
            <button
              onClick={() => dispatch(removeNotification(notification.id))}
              className="ml-4 text-lg leading-none focus:outline-none"
              aria-label="Close Notification"
            >
              <XMarkIcon className="h-5 w-5" aria-hidden="true" />
            </button>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

export default NotificationProvider;
