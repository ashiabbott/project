const { validationResult } = require('express-validator');
const chatbotService = require('../services/chatbotService');

exports.sendMessage = async (req, res) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  const { message } = req.body;

  try {
    const response = await chatbotService.generateResponse(
      req.user.id,
      message,
    );
    res.json({ message: response });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: 'Server error' });
  }
};
