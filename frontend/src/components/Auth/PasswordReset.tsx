import React, { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import api from '../../services/api';

const PasswordReset: React.FC = () => {
  const [message, setMessage] = useState('');

  const formik = useFormik({
    initialValues: { email: '' },
    validationSchema: Yup.object({
      email: Yup.string()
        .email('Invalid email address')
        .required('Email is required'),
    }),
    onSubmit: async values => {
      try {
        await api.post('/auth/password-reset', { email: values.email });
        setMessage('A password reset link has been sent to your email.');
      } catch (error) {
        setMessage(
          'Error sending password reset link. Please try again later.'
        );
      }
    },
  });

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white dark:bg-gray-800 rounded-lg shadow">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Reset Your Password
      </h2>
      {message && <p className="mb-4 text-green-500">{message}</p>}
      <form onSubmit={formik.handleSubmit}>
        <label
          htmlFor="email"
          className="block text-gray-700 dark:text-gray-300"
        >
          Email Address
        </label>
        <input
          id="email"
          name="email"
          type="email"
          className="w-full p-2 border rounded mb-4 dark:bg-gray-700 dark:text-white"
          onChange={formik.handleChange}
          value={formik.values.email}
        />
        {formik.touched.email && formik.errors.email && (
          <div className="text-red-500 mb-4">{formik.errors.email}</div>
        )}
        <button
          type="submit"
          className="w-full p-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Send Password Reset Link
        </button>
      </form>
    </div>
  );
};

export default PasswordReset;
