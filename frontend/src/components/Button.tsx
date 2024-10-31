import React from 'react';
import { motion } from 'framer-motion';

interface ButtonProps {
  onClick: () => void;
  label: string;
  className?: string;
}

const Button: React.FC<ButtonProps> = ({ onClick, label, className }) => (
  <motion.button
    whileHover={{ scale: 1.05 }}
    whileTap={{ scale: 0.95 }}
    onClick={onClick}
    className={`px-4 py-2 bg-blue-600 text-white rounded ${className}`}
  >
    {label}
  </motion.button>
);

export default Button;
