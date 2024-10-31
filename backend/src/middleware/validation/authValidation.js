const { check } = require('express-validator');

exports.registerValidation = [
  check('name', 'Name is required').exists().notEmpty(),
  check('email', 'Please include a valid email').exists().isEmail(),
  check('password', 'Please enter a password with 6 or more characters')
    .exists()
    .isLength({ min: 6 }),
  check('confirmPassword', 'Please confirm your password').exists(),
  check('confirmPassword', 'Passwords do not match').custom(
    (value, { req }) => value === req.body.password,
  ),
];

exports.loginValidation = [
  check('email', 'Please include a valid email').exists().isEmail(),
  check('password', 'Password is required').exists().notEmpty(),
];
