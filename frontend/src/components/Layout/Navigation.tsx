import React from 'react';
import { NavLink } from 'react-router-dom';
import {
  HomeIcon,
  CreditCardIcon,
  ChartBarSquareIcon,
  ShieldCheckIcon,
  CashIcon,
  Cog6ToothIcon,
  DocumentTextIcon,
  AcademicCapIcon,
  TicketIcon,
  InboxIcon,
} from '@heroicons/react/24/outline';

const Navigation: React.FC = () => {
  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: HomeIcon },
    { name: 'Transactions', path: '/transactions', icon: CreditCardIcon },
    { name: 'Budget', path: '/budget', icon: CashIcon },
    { name: 'Goals', path: '/goals', icon: ChartBarSquareIcon },
    { name: 'Allowance', path: '/allowance', icon: TicketIcon },
    { name: 'Analytics', path: '/analytics', icon: ChartBarSquareIcon },
    { name: 'Bills', path: '/bills', icon: InboxIcon },
    { name: 'Documents', path: '/documents', icon: DocumentTextIcon },
    { name: 'Investments', path: '/investments', icon: AcademicCapIcon },
    { name: 'Subscriptions', path: '/subscriptions', icon: TicketIcon },
    { name: 'Tax Planner', path: '/tax-planner', icon: DocumentTextIcon },
    { name: 'Security', path: '/security', icon: ShieldCheckIcon },
    // Add any additional navigation items as needed
  ];

  return (
    <nav className="fixed top-0 left-0 w-64 h-full bg-gray-800 text-white">
      <div className="p-6">
        <h1 className="text-2xl font-semibold">Your App</h1>
      </div>
      <ul className="mt-6">
        {navItems.map(item => (
          <li key={item.name}>
            <NavLink
              to={item.path}
              className={({ isActive }) =>
                `flex items-center px-6 py-2 ${
                  isActive ? 'bg-gray-700' : 'hover:bg-gray-700'
                }`
              }
            >
              <item.icon className="h-5 w-5 mr-3" aria-hidden="true" />
              {item.name}
            </NavLink>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default Navigation;
