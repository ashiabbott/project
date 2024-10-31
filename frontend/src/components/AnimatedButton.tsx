import React from 'react';
import { motion } from 'framer-motion';

interface AnimatedButtonProps {
  onClick: () => void;
  label: string;
}

const AnimatedButton: React.FC<AnimatedButtonProps> = ({ onClick, label }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className="px-4 py-2 bg-blue-600 text-white rounded shadow-md"
    aria-label={label}
  >
    {label}
  </motion.button>
);

export default AnimatedButton;
