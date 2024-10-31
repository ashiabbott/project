import React, { useState, useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  scheduleReport,
  fetchScheduledReports,
} from '../../store/slices/reportSlice';
import { RootState } from '../../store';

const ScheduledReports: React.FC = () => {
  const dispatch = useDispatch();
  const { scheduledReports } = useSelector((state: RootState) => state.report);
  const [frequency, setFrequency] = useState<'daily' | 'weekly' | 'monthly'>(
    'weekly'
  );

  useEffect(() => {
    dispatch(fetchScheduledReports());
  }, [dispatch]);

  const handleSchedule = () => {
    dispatch(scheduleReport({ frequency }));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Scheduled Reports
      </h2>
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Frequency
        </label>
        <select
          value={frequency}
          onChange={e =>
            setFrequency(e.target.value as 'daily' | 'weekly' | 'monthly')
          }
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="daily">Daily</option>
          <option value="weekly">Weekly</option>
          <option value="monthly">Monthly</option>
        </select>
      </div>
      <button
        onClick={handleSchedule}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Schedule Report
      </button>
      <div>
        <h3 className="text-xl font-semibold text-gray-900 dark:text-white mt-6">
          Existing Scheduled Reports
        </h3>
        <ul className="list-disc list-inside">
          {scheduledReports.map((report, idx) => (
            <li key={idx} className="text-gray-700 dark:text-gray-300">
              {report.frequency} report scheduled to {report.email}
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

export default ScheduledReports;
