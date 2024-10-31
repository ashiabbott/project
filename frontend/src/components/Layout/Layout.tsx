import React from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import Header from './Header';
import Footer from './Footer';
import Chatbot from '../Chatbot/Chatbot';
import NotificationCenter from '../Notifications/NotificationCenter';

const Layout: React.FC = () => {
  return (
    <div className="flex h-screen bg-gray-100 dark:bg-gray-900">
      <Sidebar />
      <div className="flex-1 flex flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-x-hidden overflow-y-auto bg-gray-200 dark:bg-gray-800">
          <div className="container mx-auto px-6 py-8">
            <Outlet />
          </div>
        </main>
        <Footer />
      </div>
      <Chatbot />
      <NotificationCenter />
    </div>
  );
};

export default Layout;
