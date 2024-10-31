// src/routes/notificationRoutes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  getNotifications,
  markNotificationAsRead,
  deleteNotification,
} from '../controllers/notificationController.js';

const router = express.Router();

// Apply authentication middleware to all routes
router.use(authMiddleware);

/**
 * @route   GET /api/notifications
 * @desc    Get all notifications for the user
 * @access  Private
 */
router.get('/', getNotifications);

/**
 * @route   PUT /api/notifications/:id/read
 * @desc    Mark a notification as read
 * @access  Private
 */
router.put('/:id/read', markNotificationAsRead);

/**
 * @route   DELETE /api/notifications/:id
 * @desc    Delete a notification
 * @access  Private
 */
router.delete('/:id', deleteNotification);

export default router;

