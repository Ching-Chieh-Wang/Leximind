const { body, validationResult } = require('express-validator');

// Reusable validation rules for username
const usernameValidation = body('username')
.trim() // Remove leading and trailing spaces
  .notEmpty().withMessage('Username is required')
  .isAlphanumeric().withMessage('Username must be alphanumeric')
  .isLength({ min: 3 }).withMessage('Username must be at least 3 characters long')
  .isLength({ max: 50 }).withMessage('Username cannot be more than 50 characters long');

// Reusable validation rules for email
const emailValidation = body('email')
  .trim()
  .isEmail().withMessage('Invalid email address')
  .isLength({ max: 60 }).withMessage('Email cannot be more than 60 characters long');

// Reusable validation rules for password (only used in registration)
const passwordValidation = body('password')
  .isLength({ min: 8 }).withMessage('Password must be at least 8 characters long')
  .isLength({ max: 60 }).withMessage('Password must be less than 60 characters long')
  .matches(/[A-Z]/).withMessage('Password must contain at least one uppercase letter')
  .matches(/[a-z]/).withMessage('Password must contain at least one lowercase letter')
  .matches(/\d/).withMessage('Password must contain at least one digit')
  .matches(/[@$!%*?&#]/).withMessage('Password must contain at least one special character');

// Common error handling middleware
const handleValidationErrors = (req, res, next) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ message: errors.array() });
  }
  next();
};

// Middleware to validate registration input (username, email, password)
const validateRegister = [
  usernameValidation,
  emailValidation,
  passwordValidation,
  handleValidationErrors
];


// Middleware to validate profile update input (username, email only)
const validateProfile = [
  usernameValidation,
  emailValidation,
  handleValidationErrors
];

module.exports = {  validateRegister, validateProfile };