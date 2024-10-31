import React, { useEffect, useState, useCallback } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchGoals, addGoal, updateGoal } from '../../store/slices/goalsSlice';
import { AppDispatch, RootState } from '../../store';
import { PlusIcon } from '@heroicons/react/24/outline';
import GoalCard from '../../components/Goals/GoalCard';
import AddGoalModal from '../../components/Goals/AddGoalModal';
import LoadingSpinner from '../../components/UI/LoadingSpinner';
import ErrorMessage from '../../components/UI/ErrorMessage';

const GoalsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { goals, loading, error } = useSelector(
    (state: RootState) => state.goals
  );
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchGoals());
  }, [dispatch]);

  const handleAddGoal = useCallback(
    newGoal => {
      dispatch(addGoal(newGoal));
      setIsAddModalOpen(false);
    },
    [dispatch]
  );

  const handleUpdateGoal = useCallback(
    updatedGoal => {
      dispatch(updateGoal(updatedGoal));
    },
    [dispatch]
  );

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Financial Goals</h1>
        <button
          onClick={() => setIsAddModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Add Goal
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {goals.map(goal => (
          <GoalCard key={goal.id} goal={goal} onUpdate={handleUpdateGoal} />
        ))}
      </div>

      <AddGoalModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAddGoal={handleAddGoal}
      />
    </div>
  );
};

export default GoalsPage;
