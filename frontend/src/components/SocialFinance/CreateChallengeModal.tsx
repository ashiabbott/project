import React, { useState } from 'react';
import { Dialog } from '@headlessui/react';

interface CreateChallengeModalProps {
  onClose: () => void;
}

const CreateChallengeModal: React.FC<CreateChallengeModalProps> = ({
  onClose,
}) => {
  const [challengeName, setChallengeName] = useState('');
  const [description, setDescription] = useState('');
  const [duration, setDuration] = useState('');
  const [reward, setReward] = useState('');

  const handleCreateChallenge = () => {
    // Implement logic to create a new challenge
    // For example, dispatch an action or call an API
    onClose();
  };

  return (
    <Dialog
      open
      onClose={onClose}
      className="fixed z-10 inset-0 overflow-y-auto"
    >
      <div className="flex items-center justify-center min-h-screen px-4">
        <Dialog.Overlay className="fixed inset-0 bg-black opacity-50" />
        <div className="relative bg-white dark:bg-gray-800 rounded-lg max-w-md mx-auto p-6">
          <Dialog.Title className="text-lg font-bold">
            Create New Challenge
          </Dialog.Title>
          <div className="mt-4 space-y-4">
            <input
              type="text"
              value={challengeName}
              onChange={e => setChallengeName(e.target.value)}
              placeholder="Challenge Name"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <textarea
              value={description}
              onChange={e => setDescription(e.target.value)}
              placeholder="Description"
              className="w-full px-3 py-2 border rounded-lg"
              rows={3}
            />
            <input
              type="text"
              value={duration}
              onChange={e => setDuration(e.target.value)}
              placeholder="Duration (e.g., '30 days')"
              className="w-full px-3 py-2 border rounded-lg"
            />
            <input
              type="text"
              value={reward}
              onChange={e => setReward(e.target.value)}
              placeholder="Reward"
              className="w-full px-3 py-2 border rounded-lg"
            />
          </div>
          <div className="mt-6 flex justify-end">
            <button
              onClick={onClose}
              className="mr-2 px-4 py-2 bg-gray-500 hover:bg-gray-600 text-white rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleCreateChallenge}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
            >
              Create
            </button>
          </div>
        </div>
      </div>
    </Dialog>
  );
};

export default CreateChallengeModal;
