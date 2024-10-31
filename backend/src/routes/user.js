const express = require('express');
const userController = require('../controllers/userController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/profile', userController.getUserProfile);
router.get('/insights', userController.getInsights);

module.exports = router;
