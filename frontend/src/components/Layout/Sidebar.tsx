import React from 'react';
import { Link } from 'react-router-dom';

const Sidebar: React.FC = () => {
  return (
    <div className="hidden lg:flex lg:flex-shrink-0">
      <div className="flex flex-col w-64">
        <div className="flex flex-col h-0 flex-1 bg-gray-800">
          <div className="flex-1 flex flex-col pt-5 pb-4 overflow-y-auto">
            <div className="flex items-center flex-shrink-0 px-4">
              <img className="h-8 w-auto" src="/logo.svg" alt="Logo" />
            </div>
            <nav className="mt-5 flex-1 px-2 bg-gray-800 space-y-1">
              <Link
                to="/"
                className="group flex items-center px-2 py-2 text-sm leading-5 font-medium text-white rounded-md hover:bg-gray-700 focus:outline-none focus:bg-gray-700 transition ease-in-out duration-150"
              >
                Dashboard
              </Link>
              {/* Add more navigation items here */}
            </nav>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Sidebar;
