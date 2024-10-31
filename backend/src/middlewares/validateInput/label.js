const { body, validationResult } = require('express-validator');

// Middleware to validate label input
const validateLabelInput = [
  body('name')
  .trim()
  .notEmpty().withMessage('Label name is required')
  .isLength({ max: 50 }).withMessage('Label name cannot be more than 50 characters long')
  .matches(/^[A-Za-z0-9 ]+$/).withMessage('Label name can only contain letters, numbers, and spaces'),

  // Middleware to check validation result
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ message: errors.array() });
    }
    next();
  }
];

module.exports = { validateLabelInput };