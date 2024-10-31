import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { exportData } from '../../store/slices/exportSlice';
import ExportButton from '../Common/ExportButton';

const DataExport: React.FC = () => {
  const dispatch = useDispatch();
  const [format, setFormat] = useState<'pdf' | 'csv' | 'xlsx'>('csv');

  const handleExport = () => {
    dispatch(exportData(format));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Export Data
      </h2>
      <div className="flex items-center mb-4">
        <label
          htmlFor="format"
          className="mr-2 text-gray-700 dark:text-gray-300"
        >
          Format:
        </label>
        <select
          id="format"
          value={format}
          onChange={e => setFormat(e.target.value as 'pdf' | 'csv' | 'xlsx')}
          className="p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          <option value="csv">CSV</option>
          <option value="xlsx">Excel (XLSX)</option>
          <option value="pdf">PDF</option>
        </select>
      </div>
      <ExportButton onExport={handleExport} />
    </div>
  );
};

export default DataExport;
