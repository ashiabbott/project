// src/routes/chatRoutes.js
import express from 'express';
import authMiddleware from '../middleware/authMiddleware.js';
import {
  sendMessage,
  getMessages,
} from '../controllers/chatController.js';

const router = express.Router();

// Apply authentication middleware
router.use(authMiddleware);

/**
 * @route   POST /api/chat/send
 * @desc    Send a chat message
 * @access  Private
 */
router.post('/send', sendMessage);

/**
 * @route   GET /api/chat/messages
 * @desc    Get chat messages
 * @access  Private
 */
router.get('/messages', getMessages);

export default router;

