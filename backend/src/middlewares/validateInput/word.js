const { body, validationResult } = require('express-validator');

// Middleware to validate word input
const validateWordInput = [
  body('name')
    .notEmpty().withMessage('name is required')
    .isLength({ max: 100 }).withMessage('name cannot be more than 100 characters long'),
  
  body('description')
    .notEmpty().withMessage('description is required')
    .isLength({ max: 500 }).withMessage('description cannot be more than 500 characters long'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateWordInput };