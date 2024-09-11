const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/auth/user');
const {
  register,
  login,
  getProfile,
  update,
  remove,
} = require('../controllers/user');
const {validateLogin,validateProfile}= require('../middleware/validateInput/user')

// Route for user registration with validation
router.post('/register', validateProfile, register);

// Route for user login with validation
router.post('/login', validateLogin, login);

// Route for fetching user profile (requires authentication)
router.get('/', protect, getProfile);

// Route for updating user profile with validation (requires authentication)
router.put('/', protect, validateProfile, update);

// Route for deleting user profile (requires authentication)
router.delete('/', protect, remove);



module.exports = router;






