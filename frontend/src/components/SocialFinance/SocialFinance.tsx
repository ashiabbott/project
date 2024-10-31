import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { RootState, AppDispatch } from '../../store';
import {
  fetchChallenges,
  joinChallenge,
  fetchLeaderboard,
  createChallenge,
} from '../../store/slices/socialFinanceSlice';
import {
  UserGroupIcon,
  TrophyIcon,
  ChartBarIcon,
  PlusIcon,
} from '@heroicons/react/24/outline';
import ChallengeCard from './ChallengeCard';
import Leaderboard from './Leaderboard';
import CreateChallengeModal from './CreateChallengeModal';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorMessage from '../UI/ErrorMessage';

const SocialFinance: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { challenges, leaderboard, loading, error } = useSelector(
    (state: RootState) => state.socialFinance
  );
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  useEffect(() => {
    dispatch(fetchChallenges());
    dispatch(fetchLeaderboard());
  }, [dispatch]);

  const handleJoinChallenge = (challengeId: string) => {
    dispatch(joinChallenge(challengeId));
  };

  const handleCreateChallenge = (challengeData: {
    name: string;
    description: string;
    duration: string;
    reward: string;
  }) => {
    dispatch(createChallenge(challengeData));
    setIsCreateModalOpen(false);
  };

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Social Finance</h1>
        <button
          onClick={() => setIsCreateModalOpen(true)}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          <PlusIcon className="h-5 w-5 mr-2" />
          Create Challenge
        </button>
      </div>

      <section>
        <h2 className="text-xl font-semibold mb-4">Active Challenges</h2>
        {challenges.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map(challenge => (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                onJoin={() => handleJoinChallenge(challenge.id)}
              />
            ))}
          </div>
        ) : (
          <p>No active challenges available.</p>
        )}
      </section>

      <section>
        <h2 className="text-xl font-semibold mb-4">Leaderboard</h2>
        {leaderboard.length > 0 ? (
          <Leaderboard entries={leaderboard} />
        ) : (
          <p>No leaderboard data available.</p>
        )}
      </section>

      <CreateChallengeModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onCreate={handleCreateChallenge}
      />
    </div>
  );
};

export default SocialFinance;
