import React, { useState } from 'react';
import { useDispatch } from 'react-redux';
import { AppDispatch } from '../../store';
import { createBudget } from '../../store/slices/budgetSlice';
import { generateAIRecommendations } from '../../services/aiService';
import { useForm, FormProvider } from 'react-hook-form';
import LoadingSpinner from '../UI/LoadingSpinner';

interface FormData {
  income: number;
  expenses: { category: string; amount: number }[];
  goals: string[];
}

const steps = ['Income', 'Expenses', 'Goals', 'Recommendations'];

const BudgetingWizard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const [currentStep, setCurrentStep] = useState(0);
  const [recommendations, setRecommendations] = useState<string[]>([]);
  const [loadingRecommendations, setLoadingRecommendations] = useState(false);

  const methods = useForm<FormData>({
    defaultValues: {
      income: 0,
      expenses: [],
      goals: [],
    },
  });

  const { handleSubmit, watch } = methods;

  const onSubmit = async (data: FormData) => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      dispatch(createBudget({ ...data, recommendations }));
      // Navigate to budget overview
    }
  };

  const fetchRecommendations = async () => {
    setLoadingRecommendations(true);
    try {
      const data = watch();
      const aiRecommendations = await generateAIRecommendations(data);
      setRecommendations(aiRecommendations);
    } catch (error) {
      console.error('Error fetching recommendations:', error);
    } finally {
      setLoadingRecommendations(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-6 bg-white rounded-lg shadow-lg">
      <h2 className="text-2xl font-bold mb-4">
        Step {currentStep + 1}: {steps[currentStep]}
      </h2>
      <FormProvider {...methods}>
        <form onSubmit={handleSubmit(onSubmit)}>
          {currentStep === 0 && (
            // Income form component
            // Include fields for income input
          )}
          {currentStep === 1 && (
            // Expenses form component
            // Include dynamic fields to add multiple expenses
          )}
          {currentStep === 2 && (
            // Goals form component
            // Include fields to add financial goals
          )}
          {currentStep === 3 && (
            <>
              <button
                type="button"
                onClick={fetchRecommendations}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Generate Recommendations
              </button>
              {loadingRecommendations ? (
                <LoadingSpinner />
              ) : (
                <div className="mt-4">
                  <h3 className="text-xl font-semibold">AI Recommendations</h3>
                  <ul className="list-disc pl-5 mt-2">
                    {recommendations.map((rec, index) => (
                      <li key={index}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          )}
          <div className="flex justify-between mt-6">
            {currentStep > 0 && (
              <button
                type="button"
                onClick={() => setCurrentStep(currentStep - 1)}
                className="px-4 py-2 bg-gray-300 rounded"
              >
                Previous
              </button>
            )}
            {currentStep < steps.length - 1 ? (
              <button
                type="submit"
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Next
              </button>
            ) : (
              <button
                type="submit"
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Submit
              </button>
            )}
          </div>
        </form>
      </FormProvider>
    </div>
  );
};

export default BudgetingWizard;
