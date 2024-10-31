// src/components/Notifications/Notifications.tsx

import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import { removeNotification } from '../../store/slices/notificationSlice';
import { Transition } from '@headlessui/react';
import { XMarkIcon } from '@heroicons/react/24/solid';
import { motion, AnimatePresence } from 'framer-motion';

interface Notification {
  id: string;
  message: string;
  type: 'error' | 'info' | 'success' | 'warning';
}

interface NotificationsProps {
  notifications: Notification[];
  removeNotification: (id: string) => void;
}

const Notifications: React.FC<NotificationsProps> = ({
  notifications,
  removeNotification,
}) => {
  useEffect(() => {
    notifications.forEach(notification => {
      // Automatically remove notification after 5 seconds
      const timer = setTimeout(() => {
        removeNotification(notification.id);
      }, 5000);

      // Clear timeout if component unmounts or notification is removed
      return () => clearTimeout(timer);
    });
  }, [notifications, removeNotification]);

  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col space-y-4">
      <AnimatePresence>
        {notifications.map(notification => (
          <motion.div
            key={notification.id}
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 50 }}
            transition={{ duration: 0.3 }}
            className={`max-w-sm w-full bg-${notification.type}-500 text-white shadow-lg rounded-lg pointer-events-auto flex ring-1 ring-black ring-opacity-5`}
          >
            <div className="flex-1 w-0 p-4">
              <p className="text-sm font-medium">{notification.message}</p>
            </div>
            <div className="flex border-l border-white">
              <button
                onClick={() => removeNotification(notification.id)}
                className="w-full border border-transparent rounded-none rounded-r-lg p-4 flex items-center justify-center text-white hover:text-gray-200 focus:outline-none"
                aria-label="Close notification"
              >
                <XMarkIcon className="h-5 w-5" aria-hidden="true" />
              </button>
            </div>
          </motion.div>
        ))}
      </AnimatePresence>
    </div>
  );
};

// Map state to props
const mapStateToProps = (state: RootState) => ({
  notifications: state.notifications.notifications,
});

// Map dispatch to props
const mapDispatchToProps = (dispatch: AppDispatch) => ({
  removeNotification: (id: string) => dispatch(removeNotification(id)),
});

// Connect component to Redux
export default connect(mapStateToProps, mapDispatchToProps)(Notifications);
