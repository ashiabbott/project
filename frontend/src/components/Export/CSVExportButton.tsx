import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';
import { CSVLink } from 'react-csv';
import { DownloadIcon } from '@heroicons/react/outline';

const CSVExportButton: React.FC = () => {
  const { transactions } = useSelector(
    (state: RootState) => state.transactions
  );

  const headers = [
    { label: 'Date', key: 'date' },
    { label: 'Description', key: 'description' },
    { label: 'Amount', key: 'amount' },
    { label: 'Category', key: 'category' },
    { label: 'Type', key: 'type' },
  ];

  return (
    <CSVLink
      data={transactions}
      headers={headers}
      filename={'transactions.csv'}
      className="inline-flex items-center px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
    >
      <DownloadIcon className="w-5 h-5 mr-2" />
      Export CSV
    </CSVLink>
  );
};

export default CSVExportButton;
