import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import SearchInput from '../UI/SearchInput';
import { searchAll, addToHistory, saveSearch } from '../../store/slices/searchSlice';

const GlobalSearch: React.FC = () => {
  const dispatch = useDispatch();
  const [query, setQuery] = useState('');
  const [isSaving, setIsSaving] = useState(false);
  const [searchName, setSearchName] = useState('');

  const handleSearch = () => {
    if (query.trim() !== '') {
      dispatch(searchAll(query));
      dispatch(addToHistory(query));
    }
  };

  const handleSaveSearch = () => {
    dispatch(saveSearch({ name: searchName, query }));
    setIsSaving(false);
    setSearchName('');
  };

  return (
    <div className="flex items-center space-x-2">
      <SearchInput value={query} onChange={setQuery} placeholder="Search..." />
      <button
        onClick={handleSearch}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Search
      </button>
      <button
        onClick={() => setIsSaving(true)}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Save Search
      </button>
    </div>

    {isSaving && (
      <div className="mt-2">
        <input
          type="text"
          value={searchName}
          onChange={(e) => setSearchName(e.target.value)}
          placeholder="Search Name"
          className="p-2 border rounded w-full mb-2"
        />
        <button
          onClick={handleSaveSearch}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Save
        </button>
        <button
          onClick={() => setIsSaving(false)}
          className="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600 ml-2"
        >
          Cancel
        </button>
      </div>
    )}
  );
};

export default GlobalSearch; 