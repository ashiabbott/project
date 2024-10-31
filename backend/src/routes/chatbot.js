const express = require('express');
const { body } = require('express-validator');
const chatbotController = require('../controllers/chatbotController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.post(
  '/',
  [body('message').notEmpty().withMessage('Message is required')],
  chatbotController.sendMessage,
);

module.exports = router;
