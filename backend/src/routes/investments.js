const express = require('express');
const { body } = require('express-validator');
const investmentController = require('../controllers/investmentController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', investmentController.getInvestments);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Investment name is required'),
    body('type')
      .isIn([
        'stock',
        'bond',
        'mutual_fund',
        'etf',
        'real_estate',
        'crypto',
        'other',
      ])
      .withMessage('Invalid investment type'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('purchaseDate').isISO8601().toDate().withMessage('Invalid date'),
    body('currentValue')
      .isNumeric()
      .withMessage('Current value must be a number'),
  ],
  investmentController.addInvestment,
);

router.put(
  '/:id',
  [
    body('name').notEmpty().withMessage('Investment name is required'),
    body('type')
      .isIn([
        'stock',
        'bond',
        'mutual_fund',
        'etf',
        'real_estate',
        'crypto',
        'other',
      ])
      .withMessage('Invalid investment type'),
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('purchaseDate').isISO8601().toDate().withMessage('Invalid date'),
    body('currentValue')
      .isNumeric()
      .withMessage('Current value must be a number'),
  ],
  investmentController.updateInvestment,
);

router.delete('/:id', investmentController.deleteInvestment);

module.exports = router;
