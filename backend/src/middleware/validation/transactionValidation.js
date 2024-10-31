import { check, body } from 'express-validator';

export const transactionValidation = [
  // Date Validation
  check('date')
    .exists()
    .withMessage('Date is required.')
    .isISO8601()
    .withMessage('Date must be a valid ISO 8601 date.')
    .toDate(),

  // Amount Validation
  check('amount')
    .exists()
    .withMessage('Amount is required.')
    .isFloat({ gt: 0 })
    .withMessage('Amount must be a number greater than zero.')
    .toFloat(),

  // Description Validation (Optional)
  check('description')
    .optional()
    .isString()
    .withMessage('Description must be a string.')
    .trim()
    .isLength({ max: 255 })
    .withMessage('Description cannot exceed 255 characters.'),

  // Category Validation
  check('category')
    .exists()
    .withMessage('Category is required.')
    .isString()
    .withMessage('Category must be a string.')
    .trim()
    .notEmpty()
    .withMessage('Category cannot be empty.')
    .isLength({ max: 50 })
    .withMessage('Category cannot exceed 50 characters.'),

  // Type Validation
  check('type')
    .exists()
    .withMessage('Type is required.')
    .isIn(['income', 'expense'])
    .withMessage('Type must be either "income" or "expense".'),

  // Account Validation (Optional)
  check('account')
    .optional()
    .isString()
    .withMessage('Account must be a string.')
    .trim()
    .isLength({ max: 50 })
    .withMessage('Account cannot exceed 50 characters.'),

  // Custom Validation: Prevent Invalid Categories
  body('category').custom(async value => {
    // Replace this with your own logic to fetch valid categories from the database
    const validCategories = [
      'Salary',
      'Rent',
      'Groceries',
      'Utilities',
      'Entertainment',
    ];
    if (!validCategories.includes(value)) {
      throw new Error(`Invalid category: ${value}`);
    }
    return true;
  }),

  // Custom Validation: Prevent Invalid Accounts (Optional)
  body('account').custom(async value => {
    if (value) {
      // Replace this with your own logic to fetch valid accounts from the database
      const validAccounts = ['Cash', 'Bank', 'Credit Card'];
      if (!validAccounts.includes(value)) {
        throw new Error(`Invalid account: ${value}`);
      }
    }
    return true;
  }),
];
