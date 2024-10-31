import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Bars3Icon, XMarkIcon } from '@heroicons/react/24/outline';

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <nav className="navbar fixed top-0 left-0 right-0 z-50">
      <div className="container mx-auto flex items-center justify-between p-4">
        <Link to="/" className="text-2xl font-bold text-teal-400 font-display">
          FinanceApp
        </Link>
        <div className="hidden md:flex space-x-6">
          <Link
            to="/features"
            className="text-white hover:text-teal-400 transition"
          >
            Features
          </Link>
          <Link
            to="/pricing"
            className="text-white hover:text-teal-400 transition"
          >
            Pricing
          </Link>
          <Link
            to="/login"
            className="text-white hover:text-teal-400 transition"
          >
            Login
          </Link>
          <Link
            to="/register"
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-4 rounded-full transition"
          >
            Sign Up
          </Link>
        </div>
        <div className="md:hidden">
          <button
            onClick={() => setMenuOpen(!menuOpen)}
            className="text-white hover:text-teal-400 focus:outline-none"
          >
            {menuOpen ? (
              <XIcon className="h-6 w-6" />
            ) : (
              <MenuIcon className="h-6 w-6" />
            )}
          </button>
        </div>
      </div>
      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          className="md:hidden bg-black bg-opacity-90 backdrop-filter backdrop-blur-lg"
          initial={{ height: 0 }}
          animate={{ height: 'auto' }}
          transition={{ duration: 0.3 }}
        >
          <div className="flex flex-col items-center space-y-4 py-4">
            <Link
              to="/features"
              className="text-white hover:text-teal-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Features
            </Link>
            <Link
              to="/pricing"
              className="text-white hover:text-teal-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link
              to="/login"
              className="text-white hover:text-teal-400 transition"
              onClick={() => setMenuOpen(false)}
            >
              Login
            </Link>
            <Link
              to="/register"
              className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-2 px-6 rounded-full transition"
              onClick={() => setMenuOpen(false)}
            >
              Sign Up
            </Link>
          </div>
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;
