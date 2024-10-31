import User from '../models/User.js';
import Achievement from '../models/Achievement.js';
import Notification from '../models/Notification.js';

/**
 * Check and award achievements for the user
 * @param {String} userId - User ID
 */
export const checkAchievements = async (userId) => {
  try {
    const user = await User.findById(userId);

    // Predefined achievements
    const achievements = await Achievement.find().lean();

    for (const achievement of achievements) {
      const alreadyAwarded = user.achievements.includes(achievement._id);

      if (!alreadyAwarded && meetsCriteria(user, achievement.criteria)) {
        user.achievements.push(achievement._id);
        await user.save();

        // Send notification
        const notification = new Notification({
          user: user._id,
          message: `You've earned a new achievement: ${achievement.title}`,
          type: 'success',
        });
        await notification.save();
      }
    }
  } catch (error) {
    console.error('Error checking achievements:', error.message);
  }
};

/**
 * Helper function to check if user meets the achievement criteria
 * @param {Object} user - User object
 * @param {Object} criteria - Achievement criteria
 * @returns {Boolean} - Whether the user meets the criteria
 */
const meetsCriteria = (user, criteria) => {
  // Implement logic to evaluate criteria
  // Example: Check if totalExpenses exceeds a threshold
  if (criteria.totalExpenses && user.totalExpenses >= criteria.totalExpenses) {
    return true;
  }
  // Add more criteria checks as needed
  return false;
};
