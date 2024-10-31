import React, { useState } from 'react';
import { NavLink } from 'react-router-dom';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';
import {
  HomeIcon,
  CurrencyDollarIcon,
  ChartPieIcon,
  FlagIcon,
  ChartBarIcon,
  Cog6ToothIcon,
} from '@heroicons/react/24/outline';

const navItems = [
  { name: 'Dashboard', icon: HomeIcon, path: '/' },
  { name: 'Transactions', icon: CurrencyDollarIcon, path: '/transactions' },
  { name: 'Budget', icon: ChartPieIcon, path: '/budget' },
  { name: 'Goals', icon: FlagIcon, path: '/goals' },
  { name: 'Investments', icon: ChartBarIcon, path: '/investments' },
  { name: 'Settings', icon: Cog6ToothIcon, path: '/settings' },
];

const MobileNavigation: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div className="lg:hidden">
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="p-2 rounded-md text-gray-400 hover:text-white hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-white"
        >
          <span className="sr-only">Open main menu</span>
          {isOpen ? (
            <XMarkIcon className="block h-6 w-6" aria-hidden="true" />
          ) : (
            <Bars3Icon className="block h-6 w-6" aria-hidden="true" />
          )}
        </button>
      </div>

      {isOpen && (
        <div className="lg:hidden">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navItems.map(item => (
              <NavLink
                key={item.name}
                to={item.path}
                className={({ isActive }) =>
                  `${
                    isActive
                      ? 'bg-gray-900 text-white'
                      : 'text-gray-300 hover:bg-gray-700 hover:text-white'
                  } block px-3 py-2 rounded-md text-base font-medium`
                }
                onClick={() => setIsOpen(false)}
              >
                <div className="flex items-center">
                  <item.icon className="h-6 w-6 mr-3" />
                  {item.name}
                </div>
              </NavLink>
            ))}
          </div>
        </div>
      )}
    </>
  );
};

export default MobileNavigation;
