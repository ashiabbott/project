// src/components/Goals/GoalsList.tsx

import React, { useEffect, useState, useMemo } from 'react';
import { useAppDispatch, useAppSelector } from '../../hooks/useAppDispatch';
import { fetchGoals, deleteGoal } from '../../store/slices/goalsSlice';
import { RootState } from '../../store';
import GoalProgress from './GoalProgress';
import { Goal } from '../../types';
import Loading from '../Loading/Loading';
import { addNotification } from '../../store/slices/notificationSlice';
import DeleteConfirmationModal from '../Modals/DeleteConfirmationModal';
import { FaSort, FaSortUp, FaSortDown, FaEdit, FaTrash } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';

type SortKey = 'name' | 'targetAmount' | 'currentAmount' | 'deadline' | 'progress';
type SortOrder = 'asc' | 'desc';

const GoalsList: React.FC = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { goals, loading, error } = useAppSelector((state: RootState) => state.goals);

  const [searchTerm, setSearchTerm] = useState('');
  const [sortKey, setSortKey] = useState<SortKey>('deadline');
  const [sortOrder, setSortOrder] = useState<SortOrder>('asc');
  const [currentPage, setCurrentPage] = useState(1);
  const goalsPerPage = 10; // Adjust as needed
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [goalToDelete, setGoalToDelete] = useState<Goal | null>(null);

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const handleSort = (key: SortKey) => {
    if (sortKey === key) {
      // Toggle sort order
      setSortOrder(sortOrder === 'asc' ? 'desc' : 'asc');
    } else {
      setSortKey(key);
      setSortOrder('asc');
    }
  };

  const sortedGoals = useMemo(() => {
    const sorted = [...goals].sort((a, b) => {
      let aValue: number | string = '';
      let bValue: number | string = '';

      switch (sortKey) {
        case 'name':
          aValue = a.name.toLowerCase();
          bValue = b.name.toLowerCase();
          break;
        case 'targetAmount':
          aValue = a.targetAmount;
          bValue = b.targetAmount;
          break;
        case 'currentAmount':
          aValue = a.currentAmount;
          bValue = b.currentAmount;
          break;
        case 'deadline':
          aValue = new Date(a.deadline).getTime();
          bValue = new Date(b.deadline).getTime();
          break;
        case 'progress':
          aValue = a.currentAmount / a.targetAmount;
          bValue = b.currentAmount / b.targetAmount;
          break;
        default:
          break;
      }

      if (aValue < bValue) return sortOrder === 'asc' ? -1 : 1;
      if (aValue > bValue) return sortOrder === 'asc' ? 1 : -1;
      return 0;
    });

    return sorted;
  }, [goals, sortKey, sortOrder]);

  const filteredGoals = useMemo(() => {
    return sortedGoals.filter(goal =>
      goal.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [sortedGoals, searchTerm]);

  // Pagination Logic
  const indexOfLastGoal = currentPage * goalsPerPage;
  const indexOfFirstGoal = indexOfLastGoal - goalsPerPage;
  const currentGoals = filteredGoals.slice(indexOfFirstGoal, indexOfLastGoal);
  const totalPages = Math.ceil(filteredGoals.length / goalsPerPage);

  const handleDeleteClick = (goal: Goal) => {
    setGoalToDelete(goal);
    setIsModalOpen(true);
  };

  const confirmDelete = async () => {
    if (goalToDelete) {
      try {
        await dispatch(deleteGoal(goalToDelete.id)).unwrap();
        dispatch(addNotification({ message: 'Goal deleted successfully!', type: 'success' }));
      } catch (err: any) {
        dispatch(addNotification({ message: err || 'Failed to delete goal', type: 'error' }));
      } finally {
        setIsModalOpen(false);
        setGoalToDelete(null);
      }
    }
  };

  const getSortIcon = (key: SortKey) => {
    if (sortKey !== key) return <FaSort />;
    return sortOrder === 'asc' ? <FaSortUp /> : <FaSortDown />;
  };

  if (loading) {
    return <Loading />;
  }

  if (error) {
    return <div className="text-center text-red-500">Error: {error}</div>;
  }

  return (
    <div className="mt-8">
      {/* Search and Sort Controls */}
      <div className="flex flex-col md:flex-row md:justify-between mb-4 space-y-4 md:space-y-0">
        {/* Search Bar */}
        <input
          type="text"
          placeholder="Search goals..."
          value={searchTerm}
          onChange={(e) => {
            setSearchTerm(e.target.value);
            setCurrentPage(1); // Reset to first page on search
          }}
          className="w-full md:w-1/3 px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
          aria-label="Search Goals"
        />

        {/* Sort Dropdown */}
        <div className="flex items-center space-x-2">
          <label htmlFor="sort" className="text-gray-700 dark:text-gray-300">
            Sort By:
          </label>
          <select
            id="sort"
            value={sortKey}
            onChange={(e) => handleSort(e.target.value as SortKey)}
            className="px-4 py-2 rounded bg-gray-700 text-white focus:outline-none focus:ring-2 focus:ring-indigo-500"
            aria-label="Sort Goals"
          >
            <option value="deadline">Deadline</option>
            <option value="name">Name</option>
            <option value="progress">Progress</option>
            <option value="targetAmount">Target Amount</option>
            <option value="currentAmount">Current Amount</option>
          </select>
          <button
            onClick={() => handleSort(sortKey)}
            className="text-gray-400 hover:text-gray-200 focus:outline-none"
            aria-label={`Toggle sort order for ${sortKey}`}
          >
            {getSortIcon(sortKey)}
          </button>
        </div>
      </div>

      {/* Goals Table */}
      <div className="overflow-x-auto">
        <div className="inline-block min-w-full align-middle">
          <div className="shadow overflow-hidden sm:rounded-lg">
            <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead className="bg-gray-50 dark:bg-gray-800">
                <tr>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('name')}
                    aria-sort={sortKey === 'name' ? sortOrder : 'none'}
                  >
                    Goal {getSortIcon('name')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('targetAmount')}
                    aria-sort={sortKey === 'targetAmount' ? sortOrder : 'none'}
                  >
                    Target Amount {getSortIcon('targetAmount')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('currentAmount')}
                    aria-sort={sortKey === 'currentAmount' ? sortOrder : 'none'}
                  >
                    Current Amount {getSortIcon('currentAmount')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('deadline')}
                    aria-sort={sortKey === 'deadline' ? sortOrder : 'none'}
                  >
                    Deadline {getSortIcon('deadline')}
                  </th>
                  <th
                    className="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider cursor-pointer"
                    onClick={() => handleSort('progress')}
                    aria-sort={sortKey === 'progress' ? sortOrder : 'none'}
                  >
                    Progress {getSortIcon('progress')}
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white dark:bg-gray-900 divide-y divide-gray-200 dark:divide-gray-700">
                <AnimatePresence>
                  {currentGoals.map((goal: Goal) => (
                    <motion.tr
                      key={goal.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      transition={{ duration: 0.3 }}
                      className="hover:bg-gray-100 dark:hover:bg-gray-800"
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-100">
                        {goal.name}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        ${goal.targetAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        ${goal.currentAmount.toLocaleString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        {new Date(goal.deadline).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-300">
                        <GoalProgress
                          currentAmount={goal.currentAmount}
                          targetAmount={goal.targetAmount}
                        />
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-center text-sm space-x-2">
                        <button
                          onClick={() => navigate(`/goals/edit/${goal.id}`)}
                          className="text-blue-500 hover:text-blue-700 focus:outline-none"
                          aria-label={`Edit ${goal.name}`}
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteClick(goal)}
                          className="text-red-500 hover:text-red-700 focus:outline-none"
                          aria-label={`Delete ${goal.name}`}
                        >
                          <FaTrash />
                        </button>
                      </td>
                    </motion.tr>
                  ))}
                </AnimatePresence>
              </tbody>
            </table>
            {currentGoals.length === 0 && (
              <div className="p-4 text-center text-gray-500 dark:text-gray-400">
                No goals found.
              </div>
            )}
          </div>
        </div>

        {/* Pagination Controls */}
        {totalPages > 1 && (
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`px-4 py-2 rounded ${
                currentPage === 1
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              } transition`}
              aria-label="Previous Page"
            >
              Previous
            </button>
            <span className="text-sm text-gray-700 dark:text-gray-300">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`px-4 py-2 rounded ${
                currentPage === totalPages
                  ? 'bg-gray-300 dark:bg-gray-700 text-gray-500 cursor-not-allowed'
                  : 'bg-indigo-600 hover:bg-indigo-500 text-white'
              } transition`}
              aria-label="Next Page"
            >
              Next
            </button>
          </div>
        )}

        {/* Delete Confirmation Modal */}
        <DeleteConfirmationModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          onConfirm={confirmDelete}
          goalName={goalToDelete?.name || ''}
        />
      </div>
  );
};

export default GoalsList;
