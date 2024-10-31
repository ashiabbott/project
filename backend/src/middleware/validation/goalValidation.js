const { check } = require('express-validator');

exports.goalValidation = [
  check('title', 'Title is required').exists().notEmpty(),
  check('targetAmount', 'Target amount is required and must be a number')
    .exists()
    .isFloat(),
  check('currentAmount', 'Current amount must be a number')
    .optional()
    .isFloat(),
  check('targetDate', 'Target date must be a valid date')
    .optional()
    .isISO8601()
    .toDate(),
];
