import React, { useState } from 'react';
import { motion } from 'framer-motion';

const UserOnboarding: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const steps = [
    {
      title: 'Welcome to FinanceApp!',
      content: 'Let’s get started with setting up your account.',
    },
    {
      title: 'Connect Your Bank',
      content: 'Link your bank account for seamless transaction tracking.',
    },
    {
      title: 'Set Your Goals',
      content: 'Define your financial goals to stay on track.',
    },
    {
      title: 'Budgeting Made Easy',
      content: 'We’ll help you create a budget that works for you.',
    },
  ];

  const handleNext = () => {
    setCurrentStep(prev => Math.min(prev + 1, steps.length - 1));
  };

  const handlePrevious = () => {
    setCurrentStep(prev => Math.max(prev - 1, 0));
  };

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">{steps[currentStep].title}</h2>
      <p className="mb-4">{steps[currentStep].content}</p>
      <div className="flex justify-between">
        {currentStep > 0 && (
          <button
            onClick={handlePrevious}
            className="px-4 py-2 bg-gray-300 rounded"
          >
            Previous
          </button>
        )}
        {currentStep < steps.length - 1 ? (
          <button
            onClick={handleNext}
            className="px-4 py-2 bg-blue-500 text-white rounded"
          >
            Next
          </button>
        ) : (
          <button className="px-4 py-2 bg-green-500 text-white rounded">
            Finish
          </button>
        )}
      </div>
    </div>
  );
};

export default UserOnboarding;
