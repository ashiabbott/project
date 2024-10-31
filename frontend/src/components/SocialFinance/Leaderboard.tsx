import React from 'react';
import { CrownIcon } from '@heroicons/react/24/solid';

interface LeaderboardEntry {
  userId: string;
  username: string;
  score: number;
  rank: number;
}

interface LeaderboardProps {
  entries: LeaderboardEntry[];
}

const Leaderboard: React.FC<LeaderboardProps> = ({ entries }) => (
  <div className="mt-4">
    <table className="min-w-full bg-white dark:bg-gray-800 rounded-lg overflow-hidden">
      <thead>
        <tr>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
            Rank
          </th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
            User
          </th>
          <th className="px-4 py-2 text-left text-sm font-semibold text-gray-700 dark:text-gray-200">
            Score
          </th>
        </tr>
      </thead>
      <tbody>
        {entries.map(entry => (
          <tr key={entry.userId} className="border-t">
            <td className="px-4 py-2">
              {entry.rank === 1 ? (
                <CrownIcon className="h-5 w-5 text-yellow-500" />
              ) : (
                entry.rank
              )}
            </td>
            <td className="px-4 py-2">{entry.username}</td>
            <td className="px-4 py-2">{entry.score}</td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
);

export default Leaderboard;
