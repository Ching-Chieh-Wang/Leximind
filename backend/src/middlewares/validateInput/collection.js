const { body, validationResult } = require('express-validator');

// Middleware to validate collection input
const validateCollectionInput = [
  body('name')
    .notEmpty().withMessage('Collection name is required')
    .isLength({ max: 100 }).withMessage('Collection name cannot be more than 100 characters long'),

  body('description')
    .optional() // Description is optional
    .isLength({ max: 500 }).withMessage('Description cannot be more than 500 characters long'),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateCollectionInput };