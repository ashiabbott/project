import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState } from '../../store';
import {
  executeSavedSearch,
  deleteSavedSearch,
} from '../../store/slices/searchSlice';

const SavedSearches: React.FC = () => {
  const dispatch = useDispatch();
  const { savedSearches } = useSelector((state: RootState) => state.search);

  if (savedSearches.length === 0) return null;

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mt-4">
      <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
        Saved Searches
      </h2>
      <ul className="space-y-2">
        {savedSearches.map((search, idx) => (
          <li
            key={idx}
            className="flex justify-between items-center text-gray-700 dark:text-gray-300"
          >
            <span>{search.name}</span>
            <div className="space-x-2">
              <button
                onClick={() => dispatch(executeSavedSearch(search.id))}
                className="px-2 py-1 bg-blue-500 text-white rounded hover:bg-blue-600"
              >
                Execute
              </button>
              <button
                onClick={() => dispatch(deleteSavedSearch(search.id))}
                className="px-2 py-1 bg-red-500 text-white rounded hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default SavedSearches;
