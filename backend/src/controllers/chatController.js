// src/controllers/chatController.js
import ChatMessage from '../models/ChatMessage.js';
import { generateAIResponse } from '../services/aiService.js';

/**
 * @desc    Send a chat message
 * @route   POST /api/chat/send
 * @access  Private
 */
export const sendMessage = async (req, res) => {
  const { message } = req.body;

  if (!message) {
    return res.status(400).json({ success: false, message: 'Message is required' });
  }

  try {
    // Save user's message
    const userMessage = new ChatMessage({
      user: req.user.id,
      message,
      sender: 'user',
    });

    await userMessage.save();

    // Generate AI response
    const aiResponse = await generateAIResponse(message, req.user);

    // Save AI's response
    const aiMessage = new ChatMessage({
      user: req.user.id,
      message: aiResponse,
      sender: 'assistant',
    });

    await aiMessage.save();

    res.status(200).json({
      success: true,
      data: {
        userMessage: userMessage.message,
        aiMessage: aiMessage.message,
      },
    });
  } catch (error) {
    console.error('Error in sendMessage:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

/**
 * @desc    Get chat messages
 * @route   GET /api/chat/messages
 * @access  Private
 */
export const getMessages = async (req, res) => {
  try {
    const messages = await ChatMessage.find({ user: req.user.id })
      .sort({ createdAt: -1 })
      .limit(50)
      .lean();

    res.status(200).json({ success: true, data: messages });
  } catch (error) {
    console.error('Error in getMessages:', error.message);
    res.status(500).json({ success: false, message: 'Server error' });
  }
};

