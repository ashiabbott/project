import React from 'react';
import { DownloadIcon } from '@heroicons/react/outline';

interface ExportButtonProps {
  onExport: () => void;
}

const ExportButton: React.FC<ExportButtonProps> = ({ onExport }) => {
  return (
    <button
      onClick={onExport}
      className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      <DownloadIcon className="w-5 h-5 mr-2" />
      Export
    </button>
  );
};

export default ExportButton;
