import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchChatHistory } from '../../store/slices/aiChatSlice';
import { RootState, AppDispatch } from '../../store';
import LoadingSpinner from '../UI/LoadingSpinner';
import ErrorMessage from '../UI/ErrorMessage';

interface ChatMessage {
  id: string;
  timestamp: string;
  sender: 'user' | 'ai';
  message: string;
}

const AIChatHistory: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { chatHistory, loading, error } = useSelector(
    (state: RootState) => state.aiChat
  );

  useEffect(() => {
    dispatch(fetchChatHistory());
  }, [dispatch]);

  if (loading) return <LoadingSpinner />;
  if (error) return <ErrorMessage message={error} />;

  return (
    <div className="bg-white dark:bg-gray-800 p-4 rounded-lg shadow">
      <h2 className="text-xl font-semibold mb-4">AI Chat History</h2>
      <div className="space-y-4">
        {chatHistory.map((message: ChatMessage) => (
          <div key={message.id} className="flex">
            <div
              className={`max-w-md px-4 py-2 rounded-lg ${
                message.sender === 'user'
                  ? 'bg-blue-500 text-white self-end'
                  : 'bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200'
              }`}
            >
              <p>{message.message}</p>
              <span className="block mt-1 text-xs text-gray-500">
                {new Date(message.timestamp).toLocaleString()}
              </span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AIChatHistory;
