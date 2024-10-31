import { check, body } from 'express-validator';

export const budgetValidation = [
  check('month')
    .exists()
    .withMessage('Month is required.')
    .matches(/^\d{4}-\d{2}$/)
    .withMessage('Month should be in YYYY-MM format.')
    .custom(value => {
      const [year, month] = value.split('-').map(Number);
      if (month < 1 || month > 12) {
        throw new Error('Month must be between 01 and 12.');
      }
      if (year < 2000 || year > new Date().getFullYear() + 10) {
        throw new Error('Year is out of acceptable range.');
      }
      return true;
    }),
  check('categories')
    .exists()
    .withMessage('Categories are required.')
    .isArray({ min: 1 })
    .withMessage('Categories must be a non-empty array.'),
  check('categories.*.name')
    .exists()
    .withMessage('Category name is required.')
    .isString()
    .withMessage('Category name must be a string.')
    .trim()
    .notEmpty()
    .withMessage('Category name cannot be empty.')
    .isLength({ max: 50 })
    .withMessage('Category name cannot exceed 50 characters.'),
  check('categories.*.limit')
    .exists()
    .withMessage('Category limit is required.')
    .isFloat({ gt: 0 })
    .withMessage('Category limit must be a number greater than zero.'),
  check('totalBudget')
    .exists()
    .withMessage('Total budget is required.')
    .isFloat({ gt: 0 })
    .withMessage('Total budget must be a number greater than zero.')
    .custom((value, { req }) => {
      const totalCategoryLimits = req.body.categories.reduce(
        (sum, category) => sum + parseFloat(category.limit),
        0,
      );
      if (parseFloat(value) < totalCategoryLimits) {
        throw new Error(
          'Total budget cannot be less than the sum of category limits.',
        );
      }
      return true;
    }),
  // Additional validation to prevent duplicate categories
  body('categories').custom(categories => {
    const categoryNames = categories.map(cat => cat.name.toLowerCase());
    const uniqueNames = new Set(categoryNames);
    if (uniqueNames.size !== categoryNames.length) {
      throw new Error('Categories contain duplicate names.');
    }
    return true;
  }),
];
