const express = require('express');
const analyticsController = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/future-expenses', analyticsController.getFutureExpensePredictions);
router.get('/spending-patterns', analyticsController.getSpendingPatterns);

module.exports = router;
