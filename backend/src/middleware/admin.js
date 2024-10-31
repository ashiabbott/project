import User from '../models/User.js';

/**
 * @desc    Middleware to check if the user has admin privileges
 */
const adminMiddleware = async (req, res, next) => {
  try {
    // Ensure the user is authenticated
    if (!req.user || !req.user.id) {
      return res.status(401).json({ success: false, message: 'Not authorized' });
    }

    // Fetch the user from the database
    const user = await User.findById(req.user.id).select('role');

    if (!user) {
      return res.status(401).json({ success: false, message: 'User not found' });
    }

    // Check if the user has admin role
    if (user.role !== 'admin') {
      return res.status(403).json({ success: false, message: 'Access denied' });
    }

    // Proceed to the next middleware or route handler
    next();
  } catch (error) {
    console.error('Admin middleware error:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

export default adminMiddleware;

