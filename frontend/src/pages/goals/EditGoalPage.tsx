// src/pages/goals/EditGoalPage.tsx

import React, { useEffect } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import { useAppDispatch, useAppSelector } from '../../hooks';
import { updateGoal, fetchGoals } from '../../store/slices/goalsSlice';
import { useNavigate, useParams } from 'react-router-dom';
import { addNotification } from '../../store/slices/notificationSlice';
import { Goal } from '../../types';

const EditGoalPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();

  const { goals, loading, error } = useAppSelector(state => state.goals);

  const goal = goals.find(g => g.id === id);

  useEffect(() => {
    if (!goals.length) {
      dispatch(fetchGoals());
    }
  }, [dispatch, goals.length]);

  const formik = useFormik<Omit<Goal, 'id'>>({
    enableReinitialize: true,
    initialValues: {
      name: goal?.name || '',
      currentAmount: goal?.currentAmount || 0,
      targetAmount: goal?.targetAmount || 0,
      startDate:
        goal?.startDate.split('T')[0] || new Date().toISOString().split('T')[0],
      endDate: goal?.endDate.split('T')[0] || '',
      description: goal?.description || '',
    },
    validationSchema: Yup.object({
      name: Yup.string().required('Goal name is required'),
      currentAmount: Yup.number()
        .min(0, 'Cannot be negative')
        .required('Current amount is required'),
      targetAmount: Yup.number()
        .min(1, 'Target amount must be at least 1')
        .required('Target amount is required'),
      startDate: Yup.date()
        .required('Start date is required')
        .max(Yup.ref('endDate'), 'Start date cannot be after end date'),
      endDate: Yup.date()
        .required('End date is required')
        .min(Yup.ref('startDate'), 'End date cannot be before start date'),
      description: Yup.string(),
    }),
    onSubmit: async values => {
      const updatedGoal: Goal = {
        id: id!,
        ...values,
      };
      try {
        await dispatch(updateGoal(updatedGoal)).unwrap();
        dispatch(
          addNotification({
            message: 'Goal updated successfully!',
            type: 'success',
          })
        );
        navigate(`/goals/${id}`);
      } catch (error: any) {
        dispatch(
          addNotification({
            message: error || 'Failed to update goal',
            type: 'error',
          })
        );
      }
    },
  });

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-red-500 text-center">{error}</div>;
  if (!goal) return <div className="text-center">Goal not found.</div>;

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold mb-6">Edit Goal</h1>
      <form onSubmit={formik.handleSubmit} className="space-y-4">
        {/* Goal Name */}
        <div>
          <label htmlFor="name" className="block mb-1">
            Goal Name
          </label>
          <input
            id="name"
            name="name"
            type="text"
            className={`w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 ${
              formik.touched.name && formik.errors.name
                ? 'focus:ring-red-500'
                : 'focus:ring-indigo-500'
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.name}
            placeholder="e.g., Save for Vacation"
          />
          {formik.touched.name && formik.errors.name ? (
            <div className="text-red-500 text-sm">{formik.errors.name}</div>
          ) : null}
        </div>

        {/* Current Amount */}
        <div>
          <label htmlFor="currentAmount" className="block mb-1">
            Current Amount ($)
          </label>
          <input
            id="currentAmount"
            name="currentAmount"
            type="number"
            className={`w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 ${
              formik.touched.currentAmount && formik.errors.currentAmount
                ? 'focus:ring-red-500'
                : 'focus:ring-indigo-500'
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.currentAmount}
            placeholder="e.g., 500"
          />
          {formik.touched.currentAmount && formik.errors.currentAmount ? (
            <div className="text-red-500 text-sm">
              {formik.errors.currentAmount}
            </div>
          ) : null}
        </div>

        {/* Target Amount */}
        <div>
          <label htmlFor="targetAmount" className="block mb-1">
            Target Amount ($)
          </label>
          <input
            id="targetAmount"
            name="targetAmount"
            type="number"
            className={`w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 ${
              formik.touched.targetAmount && formik.errors.targetAmount
                ? 'focus:ring-red-500'
                : 'focus:ring-indigo-500'
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.targetAmount}
            placeholder="e.g., 5000"
          />
          {formik.touched.targetAmount && formik.errors.targetAmount ? (
            <div className="text-red-500 text-sm">
              {formik.errors.targetAmount}
            </div>
          ) : null}
        </div>

        {/* Start Date */}
        <div>
          <label htmlFor="startDate" className="block mb-1">
            Start Date
          </label>
          <input
            id="startDate"
            name="startDate"
            type="date"
            className={`w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 ${
              formik.touched.startDate && formik.errors.startDate
                ? 'focus:ring-red-500'
                : 'focus:ring-indigo-500'
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.startDate}
          />
          {formik.touched.startDate && formik.errors.startDate ? (
            <div className="text-red-500 text-sm">
              {formik.errors.startDate}
            </div>
          ) : null}
        </div>

        {/* End Date */}
        <div>
          <label htmlFor="endDate" className="block mb-1">
            End Date
          </label>
          <input
            id="endDate"
            name="endDate"
            type="date"
            className={`w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 ${
              formik.touched.endDate && formik.errors.endDate
                ? 'focus:ring-red-500'
                : 'focus:ring-indigo-500'
            }`}
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.endDate}
          />
          {formik.touched.endDate && formik.errors.endDate ? (
            <div className="text-red-500 text-sm">{formik.errors.endDate}</div>
          ) : null}
        </div>

        {/* Description */}
        <div>
          <label htmlFor="description" className="block mb-1">
            Description (Optional)
          </label>
          <textarea
            id="description"
            name="description"
            rows={4}
            className="w-full px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            onChange={formik.handleChange}
            onBlur={formik.handleBlur}
            value={formik.values.description}
            placeholder="Provide details about your goal..."
          ></textarea>
        </div>

        {/* Submit Button */}
        <div>
          <button
            type="submit"
            className={`w-full px-4 py-2 rounded bg-indigo-600 text-white hover:bg-indigo-500 transition ${
              !formik.isValid || formik.isSubmitting
                ? 'opacity-50 cursor-not-allowed'
                : ''
            }`}
            disabled={!formik.isValid || formik.isSubmitting}
          >
            {formik.isSubmitting ? 'Updating Goal...' : 'Update Goal'}
          </button>
        </div>
      </form>
    </div>
  );
};

export default EditGoalPage;
