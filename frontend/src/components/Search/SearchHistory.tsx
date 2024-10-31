import React from 'react';
import { useSelector } from 'react-redux';
import { RootState } from '../../store';

const SearchHistory: React.FC = () => {
  const { history } = useSelector((state: RootState) => state.search);

  if (history.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Search History
      </h2>
      <ul className="list-disc list-inside">
        {history.map((item, idx) => (
          <li key={idx} className="text-gray-700 dark:text-gray-300">
            {item}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SearchHistory;
