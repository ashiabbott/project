import React, { useState, useEffect } from 'react';
import { UserData } from '../../types';
import { XIcon } from '@heroicons/react/solid';
import { motion } from 'framer-motion';
import axios from '../../api/axiosConfig';

interface UpdateProfileModalProps {
  closeModal: () => void;
  user: UserData;
  setUser: React.Dispatch<React.SetStateAction<UserData | null>>;
}

export const UpdateProfileModal: React.FC<UpdateProfileModalProps> = ({
  closeModal,
  user,
  setUser,
}) => {
  const [name, setName] = useState<string>(user.name);
  const [email, setEmail] = useState<string>(user.email);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    // Basic validation
    if (!name.trim() || !email.trim()) {
      setError('Please fill in all fields.');
      return;
    }

    try {
      const response = await axios.put<UserData>('/api/settings/profile', {
        name,
        email,
      });

      // Update user state with the response data
      setUser(response.data);

      setSuccess('Profile updated successfully!');
      // Optionally, close the modal after a delay
      setTimeout(() => {
        closeModal();
      }, 1500);
    } catch (err: any) {
      console.error('Update Profile Error:', err);
      setError(
        err.response?.data?.message ||
          'Failed to update profile. Please try again.'
      );
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-40 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6 w-full max-w-md"
        role="dialog"
        aria-modal="true"
        aria-labelledby="modal-title"
      >
        <div className="flex justify-between items-center mb-4">
          <h3
            id="modal-title"
            className="text-xl font-semibold text-gray-900 dark:text-gray-100"
          >
            Update Profile
          </h3>
          <button
            onClick={closeModal}
            className="text-gray-700 dark:text-gray-200 hover:text-gray-900 dark:hover:text-white focus:outline-none"
            aria-label="Close modal"
          >
            <XIcon className="h-6 w-6" />
          </button>
        </div>

        {error && <p className="text-red-600 mb-4">{error}</p>}
        {success && <p className="text-green-600 mb-4">{success}</p>}

        <form onSubmit={handleSubmit}>
          <div className="mb-6">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={e => setName(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="Your Name"
              required
            />
          </div>
          <div className="mb-6">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 dark:text-gray-300"
            >
              Email
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={e => setEmail(e.target.value)}
              className="mt-1 block w-full px-3 py-2 bg-white dark:bg-gray-700 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
              placeholder="you@example.com"
              required
            />
          </div>
          <div className="flex justify-end">
            <button
              type="button"
              onClick={closeModal}
              className="mr-3 px-4 py-2 bg-gray-300 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-md hover:bg-gray-400 dark:hover:bg-gray-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              Save Changes
            </button>
          </div>
        </form>
      </motion.div>
    </div>
  );
};
