const { body, validationResult } = require('express-validator');

// Middleware to validate collection input
const validateCollectionInput = [
  body('name')
    .trim()
    .notEmpty().withMessage('Collection name is required')
    .isLength({ max: 100 }).withMessage('Collection name cannot be more than 100 characters long')
    .matches(/^[A-Za-z0-9 ]+$/).withMessage('Collection name can only contain letters, numbers, and spaces'),

  body('description')
    .trim()
    .optional() // Description is optional
    .isLength({ max: 500 }).withMessage('Description cannot be more than 500 characters long'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: "invalid input",errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateCollectionInput };