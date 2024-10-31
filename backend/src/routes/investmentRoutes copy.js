const express = require('express');
const router = express.Router();
const investmentController = require('../controllers/investmentController');
const authenticate = require('../middleware/authenticate');

// GET /api/investments - Get all investments
router.get('/', authenticate, investmentController.getInvestments);

// POST /api/investments - Create a new investment
router.post('/', authenticate, investmentController.createInvestment);

// PUT /api/investments/:id - Update an existing investment
router.put('/:id', authenticate, investmentController.updateInvestment);

// DELETE /api/investments/:id - Delete an investment
router.delete('/:id', authenticate, investmentController.deleteInvestment);

module.exports = router;
