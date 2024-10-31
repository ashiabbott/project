import React from 'react';
import { UserGroupIcon } from '@heroicons/react/24/outline';

interface Challenge {
  id: string;
  name: string;
  description: string;
  participants: number;
  duration: string;
  reward: string;
}

interface ChallengeCardProps {
  challenge: Challenge;
  onJoin: () => void;
}

const ChallengeCard: React.FC<ChallengeCardProps> = ({ challenge, onJoin }) => (
  <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow hover:shadow-lg transition-shadow">
    <h3 className="text-xl font-bold mb-2">{challenge.name}</h3>
    <p className="text-gray-600 dark:text-gray-300 mb-2">
      {challenge.description}
    </p>
    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-2">
      <UserGroupIcon className="h-4 w-4 mr-1" />
      {challenge.participants} participants
    </div>
    <div className="text-sm text-gray-500 dark:text-gray-400 mb-4">
      Duration: {challenge.duration}
    </div>
    <div className="flex justify-between items-center">
      <button
        onClick={onJoin}
        className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
      >
        Join Challenge
      </button>
      <span className="text-gray-700 dark:text-gray-200">
        Reward: {challenge.reward}
      </span>
    </div>
  </div>
);

export default ChallengeCard;
