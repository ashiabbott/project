// src/components/Navbar.tsx

import React, { useContext, Fragment } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { Menu, Transition } from '@headlessui/react';
import {
  ChartBarSquareIcon,
  Cog6ToothIcon,
  UsersIcon,
  SunIcon,
  MoonIcon,
  UserCircleIcon,
  BellIcon,
} from '@heroicons/react/24/outline';
import { ThemeContext } from '../contexts/ThemeContext';
import { useDispatch, useSelector } from 'react-redux';
import { logout } from '../store/slices/authSlice';
import { RootState } from '../store';

const Navbar: React.FC = () => {
  const { theme, toggleTheme } = useContext(ThemeContext);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const isAuthenticated = useSelector(
    (state: RootState) => state.auth.isAuthenticated
  );

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  return (
    <nav className="bg-white shadow dark:bg-gray-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left Side - Logo and Navigation Links */}
          <div className="flex">
            {/* Logo */}
            <div className="flex-shrink-0 flex items-center">
              <NavLink to="/">
                <img className="h-8 w-8" src="/logo.svg" alt="Logo" />
              </NavLink>
            </div>
            {/* Navigation Links */}
            <div className="hidden md:ml-6 md:flex md:space-x-8">
              <NavLink
                to="/dashboard"
                className={({ isActive }) =>
                  isActive
                    ? 'border-b-2 border-indigo-500 text-indigo-700 inline-flex items-center px-1 pt-1 text-sm font-medium'
                    : 'border-b-2 border-transparent text-gray-900 dark:text-white inline-flex items-center px-1 pt-1 text-sm font-medium hover:border-indigo-500'
                }
              >
                <HomeIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                Dashboard
              </NavLink>
              <NavLink
                to="/analytics"
                className={({ isActive }) =>
                  isActive
                    ? 'border-b-2 border-indigo-500 text-indigo-700 inline-flex items-center px-1 pt-1 text-sm font-medium'
                    : 'border-b-2 border-transparent text-gray-500 dark:text-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium hover:border-indigo-500'
                }
              >
                <ChartBarSquareIcon
                  className="h-5 w-5 mr-1"
                  aria-hidden="true"
                />
                Analytics
              </NavLink>
              <NavLink
                to="/budget"
                className={({ isActive }) =>
                  isActive
                    ? 'border-b-2 border-indigo-500 text-indigo-700 inline-flex items-center px-1 pt-1 text-sm font-medium'
                    : 'border-b-2 border-transparent text-gray-500 dark:text-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium hover:border-indigo-500'
                }
              >
                <Cog6ToothIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                Budget
              </NavLink>
              <NavLink
                to="/goals"
                className={({ isActive }) =>
                  isActive
                    ? 'border-b-2 border-indigo-500 text-indigo-700 inline-flex items-center px-1 pt-1 text-sm font-medium'
                    : 'border-b-2 border-transparent text-gray-500 dark:text-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium hover:border-indigo-500'
                }
              >
                <UsersIcon className="h-5 w-5 mr-1" aria-hidden="true" />
                Goals
              </NavLink>
              <NavLink
                to="/social"
                className={({ isActive }) =>
                  isActive
                    ? 'border-b-2 border-indigo-500 text-indigo-700 inline-flex items-center px-1 pt-1 text-sm font-medium'
                    : 'border-b-2 border-transparent text-gray-500 dark:text-gray-300 inline-flex items-center px-1 pt-1 text-sm font-medium hover:border-indigo-500'
                }
              >
                Social Finance
              </NavLink>
            </div>
          </div>

          {/* Right Side - Theme Toggle, Notifications, Profile Dropdown */}
          <div className="flex items-center">
            <button
              onClick={toggleTheme}
              aria-label="Toggle Theme"
              className="p-2 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
            >
              {theme === 'dark' || theme === 'oled' ? (
                <SunIcon className="h-6 w-6 text-yellow-400" />
              ) : (
                <MoonIcon className="h-6 w-6 text-gray-500" />
              )}
            </button>

            <button
              className="ml-4 bg-white dark:bg-gray-800 p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-white focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
              aria-label="View notifications"
            >
              <BellIcon className="h-6 w-6" aria-hidden="true" />
            </button>

            <Menu as="div" className="ml-3 relative">
              <div>
                <Menu.Button className="bg-white dark:bg-gray-800 flex text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <span className="sr-only">Open user menu</span>
                  <UserCircleIcon className="h-8 w-8 rounded-full text-gray-400" />
                </Menu.Button>
              </div>
              <Transition
                as={Fragment}
                enter="transition ease-out duration-100"
                enterFrom="transform opacity-0 scale-95"
                enterTo="transform opacity-100 scale-100"
                leave="transition ease-in duration-75"
                leaveFrom="transform opacity-100 scale-100"
                leaveTo="transform opacity-0 scale-95"
              >
                <Menu.Items
                  className="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-700 ring-1 ring-black ring-opacity-5 focus:outline-none"
                  role="menu"
                  aria-orientation="vertical"
                  aria-labelledby="user-menu"
                >
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        to="/profile"
                        className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-200' : 'text-gray-700 dark:text-gray-200'}`}
                        role="menuitem"
                      >
                        Your Profile
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <NavLink
                        to="/settings"
                        className={`block px-4 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-200' : 'text-gray-700 dark:text-gray-200'}`}
                        role="menuitem"
                      >
                        Settings
                      </NavLink>
                    )}
                  </Menu.Item>
                  <Menu.Item>
                    {({ active }) => (
                      <button
                        onClick={handleLogout}
                        className={`w-full text-left block px-4 py-2 text-sm ${active ? 'bg-gray-100 dark:bg-gray-600 text-gray-900 dark:text-gray-200' : 'text-gray-700 dark:text-gray-200'}`}
                        role="menuitem"
                      >
                        Sign out
                      </button>
                    )}
                  </Menu.Item>
                </Menu.Items>
              </Transition>
            </Menu>

            <div className="-mr-2 flex md:hidden">
              <Menu>
                {({ open }) => (
                  <>
                    <Menu.Button
                      className="ml-4 inline-flex items-center justify-center p-2 rounded-md text-gray-400 hover:text-gray-500 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-indigo-500"
                      aria-label="Toggle main menu"
                    >
                      <span className="sr-only">Open main menu</span>
                      {open ? (
                        <XMarkIcon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      ) : (
                        <Bars3Icon
                          className="block h-6 w-6"
                          aria-hidden="true"
                        />
                      )}
                    </Menu.Button>
                  </>
                )}
              </Menu>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
