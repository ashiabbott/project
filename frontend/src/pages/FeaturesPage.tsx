import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const FeaturesPage: React.FC = () => {
  return (
    <motion.div
      className="container mx-auto p-6"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <h1 className="text-4xl font-bold mb-4">Our Features</h1>
      <p className="mb-6">
        Discover the amazing features we offer to help you manage your finances
        effectively.
      </p>

      {/* List of features with descriptions, including icons and visuals */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* Feature 1 */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">
            Personalized Dashboard
          </h2>
          <p>
            Get an overview of your finances at a glance with our customizable
            dashboard.
          </p>
        </div>

        {/* Feature 2 */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Goal Tracking</h2>
          <p>Set financial goals and track your progress over time.</p>
        </div>

        {/* Feature 3 */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Budget Management</h2>
          <p>
            Create budgets, monitor spending, and stay on top of your finances.
          </p>
        </div>

        {/* Feature 4 */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Investment Insights</h2>
          <p>Analyze your investments and make informed decisions.</p>
        </div>

        {/* Feature 5 */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">AI Financial Advisor</h2>
          <p>
            Receive personalized financial advice powered by our AI-driven
            advisor.
          </p>
        </div>

        {/* Feature 6 */}
        <div className="p-4 bg-white dark:bg-gray-800 rounded-lg shadow">
          <h2 className="text-2xl font-semibold mb-2">Secure Data Sync</h2>
          <p>
            Sync your data securely across all your devices with end-to-end
            encryption.
          </p>
        </div>
      </div>

      <div className="mt-8">
        <Link to="/register">
          <button className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300">
            Get Started
          </button>
        </Link>
      </div>
    </motion.div>
  );
};

export default FeaturesPage;
