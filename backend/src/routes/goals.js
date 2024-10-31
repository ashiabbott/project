const express = require('express');
const { body } = require('express-validator');
const goalController = require('../controllers/goalController');
const auth = require('../middleware/auth');
const router = express.Router();

router.use(auth);

router.get('/', goalController.getGoals);

router.post(
  '/',
  [
    body('name').notEmpty().withMessage('Goal name is required'),
    body('targetAmount')
      .isNumeric()
      .withMessage('Target amount must be a number'),
    body('deadline').isISO8601().toDate().withMessage('Invalid date'),
  ],
  goalController.createGoal,
);

router.put(
  '/:id',
  [
    body('name').notEmpty().withMessage('Goal name is required'),
    body('targetAmount')
      .isNumeric()
      .withMessage('Target amount must be a number'),
    body('currentAmount')
      .isNumeric()
      .withMessage('Current amount must be a number'),
    body('deadline').isISO8601().toDate().withMessage('Invalid date'),
  ],
  goalController.updateGoal,
);

router.delete('/:id', goalController.deleteGoal);

module.exports = router;
