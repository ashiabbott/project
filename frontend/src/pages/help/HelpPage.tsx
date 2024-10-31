import React from 'react';
import Navbar from '../../components/Navbar';

const HelpPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-gray-100 dark:bg-gray-900">
      <Navbar />
      <main className="container mx-auto px-4 py-6 space-y-6">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
          Help & Support
        </h1>
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            FAQ
          </h2>
          {/* Add frequently asked questions */}
        </section>
        <section className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h2 className="text-2xl font-semibold mb-4 text-gray-900 dark:text-white">
            Contact Support
          </h2>
          <p>
            If you have any issues, please contact us at support@financeapp.com.
          </p>
        </section>
      </main>
    </div>
  );
};

export default HelpPage;
