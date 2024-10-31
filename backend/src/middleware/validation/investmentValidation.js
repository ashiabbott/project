const { check } = require('express-validator');

exports.investmentValidation = [
  check('name', 'Name is required').exists().notEmpty(),
  check('type', 'Type is required').exists().notEmpty(),
  check('amount', 'Amount is required and must be a number').exists().isFloat(),
  check('purchaseDate', 'Purchase date is required and must be a valid date')
    .exists()
    .isISO8601()
    .toDate(),
  check('currentValue', 'Current value must be a number').optional().isFloat(),
];
