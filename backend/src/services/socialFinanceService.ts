import axios from 'axios';

const API_BASE_URL =
  process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

export const fetchChallenges = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/social-finance/challenges`,
    { withCredentials: true },
  );
  return response.data.challenges;
};

export const fetchLeaderboardData = async () => {
  const response = await axios.get(
    `${API_BASE_URL}/social-finance/leaderboard`,
    { withCredentials: true },
  );
  return response.data.leaderboard;
};

export const joinChallengeService = async (challengeId: string) => {
  await axios.post(
    `${API_BASE_URL}/social-finance/challenges/${challengeId}/join`,
    {},
    { withCredentials: true },
  );
};

export const createChallengeService = async (
  challengeData: Partial<Challenge>,
) => {
  const response = await axios.post(
    `${API_BASE_URL}/social-finance/challenges`,
    challengeData,
    { withCredentials: true },
  );
  return response.data.challenge;
};
