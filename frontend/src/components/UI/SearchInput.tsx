import React from 'react';
import { SearchIcon } from '@heroicons/react/outline';

interface SearchInputProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
}

const SearchInput: React.FC<SearchInputProps> = ({
  value,
  onChange,
  placeholder = 'Search',
}) => {
  return (
    <div className="flex items-center border rounded px-3 py-2 dark:bg-gray-700 dark:border-gray-600">
      <SearchIcon className="h-5 w-5 text-gray-500 dark:text-gray-300" />
      <input
        type="text"
        value={value}
        onChange={e => onChange(e.target.value)}
        placeholder={placeholder}
        className="ml-2 w-full bg-transparent focus:outline-none text-gray-700 dark:text-white"
      />
    </div>
  );
};

export default SearchInput;
