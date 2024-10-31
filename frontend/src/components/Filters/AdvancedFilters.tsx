import React, { useState } from 'react';
import DateRangePicker from '../UI/DateRangePicker';
import MultiSelect from 'react-multi-select-component';

interface AdvancedFiltersProps {
  onApplyFilters: (filters: any) => void;
}

const AdvancedFilters: React.FC<AdvancedFiltersProps> = ({
  onApplyFilters,
}) => {
  const [dateRange, setDateRange] = useState<{
    startDate: Date;
    endDate: Date;
  }>({
    startDate: new Date(),
    endDate: new Date(),
  });
  const [selectedCategories, setSelectedCategories] = useState([]);

  const handleApplyFilters = () => {
    onApplyFilters({
      dateRange,
      categories: selectedCategories.map(cat => cat.value),
    });
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 space-y-4">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
        Advanced Filters
      </h2>
      <DateRangePicker value={dateRange} onChange={setDateRange} />
      <div>
        <label className="block text-gray-700 dark:text-gray-300 mb-2">
          Categories
        </label>
        <MultiSelect
          options={/* Fetch category options */}
          value={selectedCategories}
          onChange={setSelectedCategories}
          labelledBy="Select"
          className="dark:bg-gray-700 dark:text-white"
        />
      </div>
      <button
        onClick={handleApplyFilters}
        className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
      >
        Apply Filters
      </button>
    </div>
  );
};

export default AdvancedFilters;
