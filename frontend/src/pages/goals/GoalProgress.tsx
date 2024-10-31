// src/components/Goals/GoalProgress.tsx

import React, { useMemo } from 'react';
import Tooltip from '@mui/material/Tooltip';
import { motion } from 'framer-motion';
import { FaCheckCircle, FaExclamationCircle } from 'react-icons/fa';
import dayjs from 'dayjs';

interface GoalProgressProps {
  currentAmount: number;
  targetAmount: number;
  deadline: string; // ISO date string
  startDate?: string; // ISO date string, optional
  onClick?: () => void; // Optional click handler
}

/**
 * GoalProgress Component
 *
 * Displays a progress bar indicating the progress towards a financial goal.
 * Includes animated transitions, tooltips, overachievement handling,
 * estimated completion time, and accessibility enhancements.
 *
 * Props:
 * - currentAmount: The current amount saved towards the goal.
 * - targetAmount: The target amount to be achieved.
 * - deadline: The deadline for the goal in ISO format.
 * - startDate: The start date of the goal in ISO format (optional).
 * - onClick: Callback function when the progress bar is clicked (optional).
 */
const GoalProgress: React.FC<GoalProgressProps> = ({
  currentAmount,
  targetAmount,
  deadline,
  startDate,
  onClick,
}) => {
  // Handle edge cases
  const safeTargetAmount = targetAmount > 0 ? targetAmount : 0;
  const safeCurrentAmount = currentAmount >= 0 ? currentAmount : 0;

  // Calculate progress percentage
  const percentage = useMemo(() => {
    if (safeTargetAmount === 0) return 0;
    const calc = (safeCurrentAmount / safeTargetAmount) * 100;
    return calc > 100 ? 100 : calc;
  }, [safeCurrentAmount, safeTargetAmount]);

  const overAchieved = safeCurrentAmount > safeTargetAmount;

  // Calculate estimated completion time
  const estimatedCompletion = useMemo(() => {
    if (!startDate) return null;

    const start = dayjs(startDate);
    const today = dayjs();
    const daysPassed = today.diff(start, 'day') || 1; // Avoid division by zero

    const dailyRate = safeCurrentAmount / daysPassed;
    if (dailyRate === 0) return null;

    const remainingAmount = safeTargetAmount - safeCurrentAmount;
    const daysToComplete = Math.ceil(remainingAmount / dailyRate);

    if (remainingAmount <= 0) return 'Goal achieved!';

    const estimatedDate = today.add(daysToComplete, 'day');
    return `Estimated completion: ${estimatedDate.format('MMM D, YYYY')}`;
  }, [safeCurrentAmount, safeTargetAmount, startDate]);

  // Determine progress bar color based on percentage
  const progressColor = useMemo(() => {
    if (overAchieved) return 'bg-blue-500';
    if (percentage < 50) return 'bg-red-500';
    if (percentage < 100) return 'bg-yellow-500';
    return 'bg-green-500';
  }, [percentage, overAchieved]);

  // Accessibility: aria-label content
  const ariaLabel = useMemo(() => {
    if (overAchieved) {
      return `Goal exceeded by ${safeCurrentAmount - safeTargetAmount} dollars.`;
    }
    return `${percentage.toFixed(2)} percent of the goal achieved.`;
  }, [percentage, overAchieved, safeCurrentAmount, safeTargetAmount]);

  return (
    <div
      className="w-full"
      onClick={onClick}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick ? 0 : undefined}
      onKeyPress={e => {
        if (onClick && (e.key === 'Enter' || e.key === ' ')) onClick();
      }}
    >
      {/* Progress Bar Container */}
      <div className="relative pt-1">
        <div className="flex mb-2 items-center justify-between">
          <div>
            <Tooltip title={ariaLabel} arrow>
              <span className="text-xs font-semibold inline-block py-1 px-2 uppercase rounded-full text-gray-700 bg-gray-200 dark:bg-gray-700">
                {overAchieved ? '100%+' : `${percentage.toFixed(2)}%`}
              </span>
            </Tooltip>
          </div>
          <div className="text-right">
            <Tooltip title="Click for more details" arrow>
              <span className="text-xs font-semibold text-gray-700 dark:text-gray-300 cursor-pointer">
                ${safeCurrentAmount.toLocaleString()} / $
                {safeTargetAmount.toLocaleString()}
              </span>
            </Tooltip>
          </div>
        </div>
        <Tooltip title={estimatedCompletion || 'No estimation available'} arrow>
          <div
            className="overflow-hidden h-4 mb-4 text-xs flex rounded bg-gray-200 dark:bg-gray-700 cursor-pointer"
            role="progressbar"
            aria-valuenow={percentage}
            aria-valuemin={0}
            aria-valuemax={100}
            aria-label={ariaLabel}
          >
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: `${percentage}%` }}
              transition={{ duration: 1 }}
              className={`${progressColor} shadow-none flex flex-col text-center whitespace-nowrap text-white justify-center`}
            >
              {/* Optional: Display icon when goal is achieved */}
              {percentage >= 100 && (
                <FaCheckCircle
                  className="inline-block mr-1"
                  aria-hidden="true"
                />
              )}
              {overAchieved && (
                <FaExclamationCircle
                  className="inline-block mr-1"
                  aria-hidden="true"
                />
              )}
            </motion.div>
          </div>
        </Tooltip>
        {estimatedCompletion && (
          <div className="text-xs text-gray-500 dark:text-gray-400">
            {estimatedCompletion}
          </div>
        )}
      </div>
    </div>
  );
};

export default GoalProgress;
