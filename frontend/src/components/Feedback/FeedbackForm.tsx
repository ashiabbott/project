import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { submitFeedback } from '../../store/slices/feedbackSlice';
import { AppDispatch } from '../../store';

const FeedbackForm: React.FC = () => {
  const [message, setMessage] = useState('');
  const dispatch = useDispatch<AppDispatch>();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(submitFeedback({ message }));
    setMessage('');
  };

  return (
    <div className="bg-white shadow-md rounded-lg p-6">
      <h2 className="text-2xl font-bold mb-4">Feedback</h2>
      <form onSubmit={handleSubmit}>
        <textarea
          value={message}
          onChange={e => setMessage(e.target.value)}
          placeholder="Your feedback..."
          className="w-full p-2 border rounded"
          rows={4}
          required
        />
        <button
          type="submit"
          className="mt-2 px-4 py-2 bg-blue-500 text-white rounded"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default FeedbackForm;
