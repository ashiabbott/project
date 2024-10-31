import React from 'react';
import { Routes, Route } from 'react-router-dom';
import AIAssistantPage from './pages/ai/AIAssistantPage';
import AIAdvisor from './components/AIAdvisor/AIAdvisor';
import FinancialAdvisor from './components/FinancialAdvisor/FinancialAdvisor';

const AppRoutes: React.FC = () => {
  return (
    <Routes>
      <Route path="/ai-assistant" element={<AIAssistantPage />} />
      <Route path="/ai-advisor" element={<AIAdvisor />} />
      <Route path="/financial-advisor" element={<FinancialAdvisor />} />
      {/* Add more routes as needed */}
    </Routes>
  );
};

export default AppRoutes;
