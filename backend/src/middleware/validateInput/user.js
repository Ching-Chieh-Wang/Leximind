const { body, validationResult } = require('express-validator');

const validateLogin = async (req, res, next) => {
  // Validation rules
  await Promise.all([
    body('email')
      .isEmail().withMessage('Invalid email address')
      .isLength({ max: 60 }).withMessage('Username cannot be more than 60 characters long')
      .run(req),

    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .isLength({ max: 60 }).withMessage('Password must be less than 60 characters long')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/\d/).withMessage('Password must contain at least one digit')
      .matches(/[@$!%*?&#]/).withMessage('Password must contain at least one special character')
      .run(req),
  ]);

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

const validateProfile = async (req, res, next) => {
  // Validation rules
  await Promise.all([
    body('username')
      .notEmpty().withMessage('Username is required')
      .isAlphanumeric().withMessage('Username must be alphanumeric')
      .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
      .isLength({ max: 30 }).withMessage('Username cannot be more than 50 characters long')
      .run(req),
      
    body('email')
      .isEmail().withMessage('Invalid email address')
      .isLength({ max: 60 }).withMessage('Username cannot be more than 60 characters long')
      .run(req),

    body('password')
      .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
      .isLength({ max: 60 }).withMessage('Password must be less than 60 characters long')
      .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
      .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
      .matches(/\d/).withMessage('Password must contain at least one digit')
      .matches(/[@$!%*?&#]/).withMessage('Password must contain at least one special character')
      .run(req),
  ]);

  // Check for validation errors
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  next();
};

module.exports = {validateLogin,validateProfile};

