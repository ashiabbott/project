import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { RootState, AppDispatch } from '../store';
import { fetchCommunityTips } from '../store/slices/communitySlice';
import { fetchPeerComparison } from '../store/slices/peerComparisonSlice';
import { fetchSavingsChallenges } from '../store/slices/savingsChallengeSlice';
import FinancialTip from '../components/FinancialTip';
import PeerComparisonChart from '../components/PeerComparisonChart';
import SavingsChallenge from '../components/SavingsChallenge';

const SocialFinance: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const {
    tips,
    loading: tipsLoading,
    error: tipsError,
  } = useSelector((state: RootState) => state.community);
  const {
    comparisonData,
    loading: comparisonLoading,
    error: comparisonError,
  } = useSelector((state: RootState) => state.peerComparison);

  useEffect(() => {
    dispatch(fetchCommunityTips());
    dispatch(fetchPeerComparison());
    dispatch(fetchSavingsChallenges());
  }, [dispatch]);

  return (
    <div className="space-y-6 p-6 bg-white shadow-md rounded-lg">
      <h1 className="text-3xl font-bold text-gray-900">Social Finance</h1>

      {/* Section: Financial Tips */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800">
          Community Financial Tips
        </h2>
        {tipsLoading ? (
          <p>Loading tips...</p>
        ) : tipsError ? (
          <p className="text-red-600">Error: {tipsError}</p>
        ) : (
          <div className="space-y-4">
            {tips.map(tip => (
              <FinancialTip key={tip.id} tip={tip} />
            ))}
          </div>
        )}
      </section>

      {/* Section: Peer Comparison */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800">
          Peer Financial Health Comparison
        </h2>
        {comparisonLoading ? (
          <p>Loading peer comparison...</p>
        ) : comparisonError ? (
          <p className="text-red-600">Error: {comparisonError}</p>
        ) : (
          <PeerComparisonChart data={comparisonData} />
        )}
      </section>

      {/* Section: Savings Challenges */}
      <section>
        <h2 className="text-2xl font-semibold text-gray-800">
          Savings Challenges
        </h2>
        <SavingsChallenge />
      </section>
    </div>
  );
};

export default SocialFinance;
