const express = require('express');
const { body } = require('express-validator');
const transactionController = require('../controllers/transactionController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', transactionController.getTransactions);

router.post(
  '/',
  [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('type')
      .isIn(['income', 'expense'])
      .withMessage('Type must be income or expense'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  transactionController.addTransaction,
);

router.put(
  '/:id',
  [
    body('amount').isNumeric().withMessage('Amount must be a number'),
    body('type')
      .isIn(['income', 'expense'])
      .withMessage('Type must be income or expense'),
    body('category').notEmpty().withMessage('Category is required'),
  ],
  transactionController.updateTransaction,
);

router.delete('/:id', transactionController.deleteTransaction);

module.exports = router;
