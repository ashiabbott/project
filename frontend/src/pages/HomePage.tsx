// src/pages/HomePage.tsx

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

// Define animation variants and transitions
const pageVariants = {
  initial: { opacity: 0, y: 20, scale: 0.98 },
  in: { opacity: 1, y: 0, scale: 1 },
  out: { opacity: 0, y: -20, scale: 0.98 },
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.5,
};

const HomePage: React.FC = () => {
  return (
    <motion.div
      className="container mx-auto p-4 flex flex-col items-center justify-center min-h-screen text-center"
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
    >
      <motion.h1
        className="text-5xl font-bold mb-6 text-teal-400"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.3 }}
      >
        Welcome to the Future of Finance
      </motion.h1>
      <motion.p
        className="text-xl mb-8 max-w-2xl text-gray-300"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.6 }}
      >
        Experience cutting-edge technology and design to manage your finances
        efficiently and effectively.
      </motion.p>
      <motion.div
        className="flex space-x-4"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.9 }}
      >
        <Link to="/register">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-teal-500 hover:bg-teal-600 text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300"
          >
            Get Started
          </motion.button>
        </Link>
        <Link to="/features">
          <motion.button
            whileHover={{ scale: 1.05 }}
            className="bg-transparent border border-teal-500 hover:bg-teal-500 text-teal-500 hover:text-white font-bold py-3 px-6 rounded-full shadow-lg transition duration-300"
          >
            Learn More
          </motion.button>
        </Link>
      </motion.div>
    </motion.div>
  );
};

export default HomePage;
