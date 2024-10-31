import React, { useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { searchItems } from '../store/slices/searchSlice';
import { AppDispatch, RootState } from '../store';
import LoadingSpinner from '../components/UI/LoadingSpinner';

const SearchResults: React.FC = () => {
  const location = useLocation();
  const dispatch = useDispatch<AppDispatch>();
  const { results, loading, error } = useSelector(
    (state: RootState) => state.search
  );

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get('q');
    if (query) {
      dispatch(searchItems(query));
    }
  }, [dispatch, location.search]);

  if (loading) return <LoadingSpinner />;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="max-w-4xl mx-auto py-6 sm:px-6 lg:px-8">
      <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-8">
        Search Results
      </h1>
      {results.length === 0 ? (
        <p>No results found.</p>
      ) : (
        <ul className="divide-y divide-gray-200">
          {results.map(item => (
            <li key={item.id} className="py-4">
              <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                {item.title}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-300">
                {item.description}
              </p>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchResults;
