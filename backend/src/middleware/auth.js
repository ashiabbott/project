import jwt from 'jsonwebtoken';
import User from '../models/User.js';

/**
 * @desc    Authentication middleware to protect routes
 * @param   {Object} req - Express request object
 * @param   {Object} res - Express response object
 * @param   {Function} next - Express next middleware function
 * @access  Protected routes
 */
const authMiddleware = async (req, res, next) => {
  let token;

  // Check if authorization header exists and starts with 'Bearer'
  if (
    req.headers.authorization &&
    req.headers.authorization.startsWith('Bearer')
  ) {
    try {
      // Extract token from header
      token = req.headers.authorization.split(' ')[1];

      // Verify token
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // Attach user to request object (excluding password)
      req.user = await User.findById(decoded.user.id).select('-password');

      // Proceed to the next middleware or route handler
      next();
    } catch (err) {
      console.error('Authentication error:', err.message);
      res.status(401).json({ success: false, message: 'Unauthorized access' });
    }
  } else {
    // No token provided
    res.status(401).json({ success: false, message: 'No token provided' });
  }
};

export default authMiddleware;
