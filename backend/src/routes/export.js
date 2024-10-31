const express = require('express');
const exportController = require('../controllers/exportController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/transactions', exportController.exportTransactions);

module.exports = router;
