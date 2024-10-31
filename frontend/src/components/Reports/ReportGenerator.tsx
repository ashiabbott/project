import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { generateReport } from '../../store/slices/reportSlice';
import { RootState, AppDispatch } from '../../store';
import DateRangePicker from '../UI/DateRangePicker';
import LoadingSpinner from '../UI/LoadingSpinner';

const ReportGenerator: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { report, loading, error } = useSelector(
    (state: RootState) => state.report
  );
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(),
    endDate: new Date(),
  });

  const handleGenerateReport = () => {
    dispatch(generateReport(dateRange));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Generate Report
      </h2>
      <DateRangePicker value={dateRange} onChange={setDateRange} />
      <button
        onClick={handleGenerateReport}
        className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Generate
      </button>

      {loading && <LoadingSpinner />}
      {error && <p className="text-red-500 mt-4">{error}</p>}
      {report && (
        <div className="mt-6">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
            Report Result
          </h3>
          {/* Display report data */}
        </div>
      )}
    </div>
  );
};

export default ReportGenerator;
