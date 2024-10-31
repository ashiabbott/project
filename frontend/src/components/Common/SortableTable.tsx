import React from 'react';
import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/solid';

interface Column<T> {
  header: string;
  accessor: keyof T;
}

interface SortableTableProps<T> {
  data: T[];
  columns: Column<T>[];
  sortConfig: { key: keyof T; direction: 'asc' | 'desc' };
  onSort: (key: keyof T) => void;
}

function SortableTable<T>({
  data,
  columns,
  sortConfig,
  onSort,
}: SortableTableProps<T>) {
  const handleSort = (key: keyof T) => {
    onSort(key);
  };

  return (
    <table className="min-w-full bg-white dark:bg-gray-800">
      <thead>
        <tr>
          {columns.map(col => (
            <th
              key={String(col.accessor)}
              onClick={() => handleSort(col.accessor)}
              className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
            >
              <div className="flex items-center">
                {col.header}
                {sortConfig.key === col.accessor ? (
                  sortConfig.direction === 'asc' ? (
                    <ArrowUpIcon className="w-4 h-4 ml-1" />
                  ) : (
                    <ArrowDownIcon className="w-4 h-4 ml-1" />
                  )
                ) : null}
              </div>
            </th>
          ))}
        </tr>
      </thead>
      <tbody className="divide-y divide-gray-200 dark:divide-gray-700">
        {data.map((item, idx) => (
          <tr key={idx}>
            {columns.map(col => (
              <td
                key={String(col.accessor)}
                className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-200"
              >
                {String(item[col.accessor])}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}

export default SortableTable;
