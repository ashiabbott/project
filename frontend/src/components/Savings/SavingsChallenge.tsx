import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  fetchChallenges,
  createSavingsChallenge,
  updateChallengeSavedAmount,
  deleteChallenge,
} from '../../store/slices/savingsChallengeSlice';
import { RootState, AppDispatch } from '../../store';
import { Challenge } from '../../store/slices/savingsChallengeSlice';
import { format, parseISO } from 'date-fns';

const SavingsChallenge: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { challenges, loading, error } = useSelector(
    (state: RootState) => state.savingsChallenge
  );

  const [showForm, setShowForm] = useState(false);
  const [challengeName, setChallengeName] = useState('');
  const [targetAmount, setTargetAmount] = useState('');

  useEffect(() => {
    dispatch(fetchChallenges());
  }, [dispatch]);

  const handleCreateChallenge = (e: React.FormEvent) => {
    e.preventDefault();
    const parsedAmount = parseFloat(targetAmount);
    if (!challengeName || isNaN(parsedAmount) || parsedAmount <= 0) {
      alert('Please enter a valid challenge name and target amount.');
      return;
    }
    dispatch(
      createSavingsChallenge({
        name: challengeName,
        targetAmount: parsedAmount,
      })
    );
    setChallengeName('');
    setTargetAmount('');
    setShowForm(false);
  };

  const handleUpdateSavedAmount = (id: string, amount: number) => {
    dispatch(updateChallengeSavedAmount({ id, amount }));
  };

  const handleDeleteChallenge = (id: string) => {
    dispatch(deleteChallenge(id));
  };

  if (loading) {
    return <div>Loading challenges...</div>;
  }

  if (error) {
    return <div className="text-red-600">Error: {error}</div>;
  }

  return (
    <div className="p-6 bg-white shadow-md rounded-lg">
      <h2 className="text-2xl font-bold mb-4">Savings Challenges</h2>

      <button
        onClick={() => setShowForm(!showForm)}
        className="mb-4 px-4 py-2 bg-blue-500 text-white rounded"
      >
        {showForm ? 'Cancel' : 'Add New Challenge'}
      </button>

      {showForm && (
        <form onSubmit={handleCreateChallenge} className="mb-6">
          <div className="mb-2">
            <label className="block text-gray-700">Challenge Name</label>
            <input
              type="text"
              value={challengeName}
              onChange={e => setChallengeName(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <div className="mb-2">
            <label className="block text-gray-700">Target Amount ($)</label>
            <input
              type="number"
              value={targetAmount}
              onChange={e => setTargetAmount(e.target.value)}
              className="w-full p-2 border rounded"
              required
            />
          </div>
          <button
            type="submit"
            className="px-4 py-2 bg-green-500 text-white rounded"
          >
            Create Challenge
          </button>
        </form>
      )}

      {challenges.length === 0 ? (
        <p>No challenges found. Start by adding a new challenge.</p>
      ) : (
        <ul>
          {challenges.map(challenge => {
            const daysRemaining = Math.max(
              0,
              Math.ceil(
                (parseISO(challenge.endDate).getTime() - Date.now()) /
                  (1000 * 60 * 60 * 24)
              )
            );

            return (
              <li
                key={challenge.id}
                className="mb-4 p-4 border rounded shadow-sm bg-gray-50"
              >
                <h3 className="text-xl font-semibold">{challenge.name}</h3>
                <p>Target Amount: ${challenge.targetAmount.toFixed(2)}</p>
                <p>Saved Amount: ${challenge.savedAmount.toFixed(2)}</p>
                <progress
                  value={challenge.savedAmount}
                  max={challenge.targetAmount}
                  className="w-full h-4 mt-2"
                />
                <div className="flex items-center mt-2 space-x-2">
                  <button
                    onClick={() => handleUpdateSavedAmount(challenge.id, 100)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Save $100
                  </button>
                  <button
                    onClick={() => handleUpdateSavedAmount(challenge.id, 500)}
                    className="px-3 py-1 bg-blue-500 text-white rounded"
                  >
                    Save $500
                  </button>
                  <button
                    onClick={() => handleDeleteChallenge(challenge.id)}
                    className="px-3 py-1 bg-red-500 text-white rounded"
                  >
                    Delete
                  </button>
                </div>
                {/* Notifications */}
                {challenge.savedAmount >= challenge.targetAmount && (
                  <p className="text-green-600 font-semibold">
                    Congratulations! You've reached your savings goal!
                  </p>
                )}
                {challenge.savedAmount >= challenge.targetAmount * 0.75 &&
                  challenge.savedAmount < challenge.targetAmount && (
                    <p className="text-blue-600">
                      Great job! You're over 75% of the way to your goal.
                    </p>
                  )}
                {challenge.savedAmount >= challenge.targetAmount * 0.5 &&
                  challenge.savedAmount < challenge.targetAmount * 0.75 && (
                    <p className="text-blue-600">
                      You're halfway there! Keep up the good work.
                    </p>
                  )}
                <p className="text-sm text-gray-600 mt-2">
                  Started on: {format(parseISO(challenge.startDate), 'PPP')}
                </p>
                <p className="text-sm text-gray-600">
                  Ends on: {format(parseISO(challenge.endDate), 'PPP')}
                </p>
                <p className="text-sm text-gray-600">
                  {daysRemaining > 0
                    ? `Time remaining: ${daysRemaining} days`
                    : 'Challenge has ended'}
                </p>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
};

export default SavingsChallenge;
