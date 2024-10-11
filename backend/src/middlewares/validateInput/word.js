const { body, validationResult } = require('express-validator');

// Middleware to validate word input
const validateWordInput = [
  body('word')
    .notEmpty().withMessage('Word is required')
    .isLength({ max: 100 }).withMessage('Word cannot be more than 100 characters long'),
  
  body('definition')
    .notEmpty().withMessage('Definition is required')
    .isLength({ max: 500 }).withMessage('Definition cannot be more than 500 characters long'),
  
  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }
    next();
  }
];

module.exports = { validateWordInput };