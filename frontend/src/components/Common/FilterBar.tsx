import React from 'react';

interface FilterOption {
  label: string;
  value: string;
}

interface FilterBarProps {
  options: FilterOption[];
  selectedOption: string;
  onFilterChange: (value: string) => void;
}

const FilterBar: React.FC<FilterBarProps> = ({
  options,
  selectedOption,
  onFilterChange,
}) => {
  return (
    <div className="flex space-x-4">
      {options.map(option => (
        <button
          key={option.value}
          className={`px-4 py-2 rounded ${
            selectedOption === option.value
              ? 'bg-indigo-600 text-white'
              : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
          }`}
          onClick={() => onFilterChange(option.value)}
        >
          {option.label}
        </button>
      ))}
    </div>
  );
};

export default FilterBar;
