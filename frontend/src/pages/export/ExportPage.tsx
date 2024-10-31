import React from 'react';
import Navbar from '../../components/Navbar';
import DataExport from '../../components/Export/DataExport';

const ExportPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-6">
        <h1 className="text-3xl font-bold mb-6 text-gray-900 dark:text-white">
          Export Data
        </h1>
        <DataExport />
      </main>
    </div>
  );
};

export default ExportPage;
