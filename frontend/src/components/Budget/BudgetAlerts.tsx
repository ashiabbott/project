import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchBudgetAlerts } from '../../store/slices/budgetSlice';
import { RootState, AppDispatch } from '../../store';
import { ExclamationIcon } from '@heroicons/react/outline';

const BudgetAlerts: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { alerts, loading, error } = useSelector(
    (state: RootState) => state.budget
  );

  useEffect(() => {
    dispatch(fetchBudgetAlerts());
  }, [dispatch]);

  if (loading) return null;
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <div className="mb-4">
      {alerts.map(alert => (
        <div
          key={alert.id}
          className="flex items-center p-4 mb-2 bg-yellow-100 dark:bg-yellow-200 rounded"
        >
          <ExclamationIcon className="h-6 w-6 text-yellow-600 mr-2" />
          <p className="text-yellow-800">{alert.message}</p>
        </div>
      ))}
    </div>
  );
};

export default BudgetAlerts;
