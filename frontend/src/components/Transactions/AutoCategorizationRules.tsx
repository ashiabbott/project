import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchRules,
  addRule,
  deleteRule,
} from '../../store/slices/autoCategorizationSlice';
import { RootState, AppDispatch } from '../../store';
import { PlusIcon, TrashIcon } from '@heroicons/react/24/solid';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorMessage from '../UI/ErrorMessage';

interface Rule {
  id: string;
  keyword: string;
  category: string;
}

const AutoCategorizationRules: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { rules, loading, error } = useSelector(
    (state: RootState) => state.autoCategorization
  );
  const [newRule, setNewRule] = useState({ keyword: '', category: '' });

  useEffect(() => {
    dispatch(fetchRules());
  }, [dispatch]);

  const handleAddRule = () => {
    if (newRule.keyword.trim() && newRule.category.trim()) {
      dispatch(addRule(newRule));
      setNewRule({ keyword: '', category: '' });
    } else {
      alert('Please fill in both keyword and category.');
    }
  };

  const handleDeleteRule = (id: string) => {
    dispatch(deleteRule(id));
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-4">
      <h2 className="text-lg font-semibold">Auto-Categorization Rules</h2>
      <div className="flex space-x-2">
        <input
          type="text"
          placeholder="Keyword"
          className="flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={newRule.keyword}
          onChange={e => setNewRule({ ...newRule, keyword: e.target.value })}
        />
        <input
          type="text"
          placeholder="Category"
          className="flex-1 rounded-md border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
          value={newRule.category}
          onChange={e => setNewRule({ ...newRule, category: e.target.value })}
        />
        <button
          onClick={handleAddRule}
          className="inline-flex items-center px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500"
        >
          <PlusIcon className="h-5 w-5 mr-1" />
          Add Rule
        </button>
      </div>
      <ul className="divide-y divide-gray-200">
        {rules.map(rule => (
          <li key={rule.id} className="py-2 flex justify-between items-center">
            <div>
              <p className="text-sm text-gray-800">
                <strong>Keyword:</strong> {rule.keyword}
              </p>
              <p className="text-sm text-gray-800">
                <strong>Category:</strong> {rule.category}
              </p>
            </div>
            <button
              onClick={() => handleDeleteRule(rule.id)}
              className="text-red-600 hover:text-red-800 focus:outline-none"
            >
              <TrashIcon className="h-5 w-5" />
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default AutoCategorizationRules;
