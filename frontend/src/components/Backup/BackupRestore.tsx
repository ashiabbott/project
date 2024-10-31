import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { backupData, restoreData } from '../../store/slices/backupSlice';
import FileUpload from '../UI/FileUpload';
import { RootState } from '../../store';

const BackupRestore: React.FC = () => {
  const dispatch = useDispatch();
  const { loading, error } = useSelector((state: RootState) => state.backup);

  const handleBackup = async () => {
    const response: any = await dispatch(backupData());
    if (response.payload) {
      const url = window.URL.createObjectURL(new Blob([response.payload]));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'backup.json');
      document.body.appendChild(link);
      link.click();
      link.remove();
    }
  };

  const handleFileSelect = (files: FileList) => {
    const file = files[0];
    dispatch(restoreData(file));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Backup & Restore
      </h2>
      {error && <p className="text-red-500">{error}</p>}
      <button
        onClick={handleBackup}
        disabled={loading}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
      >
        {loading ? 'Processing...' : 'Backup Data'}
      </button>
      <div>
        <p className="text-gray-700 dark:text-gray-300">Restore Data:</p>
        <FileUpload onFileSelect={handleFileSelect} accept=".json" />
      </div>
    </div>
  );
};

export default BackupRestore;
