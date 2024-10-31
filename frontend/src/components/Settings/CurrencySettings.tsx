import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { updateCurrency } from '../../store/slices/profileSlice';
import { RootState } from '../../store';

const CurrencySettings: React.FC = () => {
  const dispatch = useDispatch();
  const { currency } = useSelector((state: RootState) => state.profile);
  const [selectedCurrency, setSelectedCurrency] = useState(currency || 'USD');

  const handleSave = () => {
    dispatch(updateCurrency(selectedCurrency));
  };

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 max-w-lg">
      <h2 className="text-2xl font-bold mb-4 text-gray-900 dark:text-white">
        Currency Settings
      </h2>
      <div className="mb-4">
        <label
          htmlFor="currency"
          className="block text-gray-700 dark:text-gray-300"
        >
          Select Your Currency
        </label>
        <select
          id="currency"
          value={selectedCurrency}
          onChange={e => setSelectedCurrency(e.target.value)}
          className="w-full p-2 border rounded dark:bg-gray-700 dark:text-white"
        >
          {/* Add more currency options as needed */}
          <option value="USD">USD - US Dollar</option>
          <option value="EUR">EUR - Euro</option>
          <option value="GBP">GBP - British Pound</option>
          <option value="JPY">JPY - Japanese Yen</option>
        </select>
      </div>
      <button
        onClick={handleSave}
        className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
      >
        Save
      </button>
    </div>
  );
};

export default CurrencySettings;
