const express = require('express');
const { body } = require('express-validator');
const budgetController = require('../controllers/budgetController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', budgetController.getBudget);

router.post(
  '/',
  [
    body('month').isISO8601().toDate().withMessage('Invalid date'),
    body('categories').isArray().withMessage('Categories must be an array'),
    body('categories.*.category')
      .notEmpty()
      .withMessage('Category name is required'),
    body('categories.*.limit')
      .isNumeric()
      .withMessage('Category limit must be a number'),
    body('totalBudget')
      .isNumeric()
      .withMessage('Total budget must be a number'),
  ],
  budgetController.createBudget,
);

router.put(
  '/:id',
  [
    body('categories').isArray().withMessage('Categories must be an array'),
    body('categories.*.category')
      .notEmpty()
      .withMessage('Category name is required'),
    body('categories.*.limit')
      .isNumeric()
      .withMessage('Category limit must be a number'),
    body('totalBudget')
      .isNumeric()
      .withMessage('Total budget must be a number'),
  ],
  budgetController.updateBudget,
);

module.exports = router;
