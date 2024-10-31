import React, { useState } from 'react';
import Papa from 'papaparse';
import { useDispatch } from 'react-redux';
import { importData } from '../../store/slices/importSlice';
import FileUpload from '../UI/FileUpload';

const DataImportWizard: React.FC = () => {
  const [fileData, setFileData] = useState<any[]>([]);
  const dispatch = useDispatch();

  const handleFileSelect = (files: FileList) => {
    const file = files[0];
    Papa.parse(file, {
      header: true,
      complete: results => {
        setFileData(results.data);
      },
    });
  };

  const handleImport = () => {
    dispatch(importData(fileData));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Import Data
      </h2>
      <FileUpload onFileSelect={handleFileSelect} accept=".csv" />
      {fileData.length > 0 && (
        <button
          onClick={handleImport}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Import
        </button>
      )}
    </div>
  );
};

export default DataImportWizard;
