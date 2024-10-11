const express = require('express');
const router = express.Router();
const {authorizeUser}  = require('../middlewares/auth/user');
const {
  register,
  login,
  getProfile,
  update,
  remove,
} = require('../controllers/user');
const {validateLogin,validateRegister,validateProfile}= require('../middlewares/validateInput/user')

// Route for user registration with validation
router.post('/register', validateRegister, register);

// Route for user login with validation
router.post('/login', validateLogin, login);

// Route for fetching user profile (requires authentication)
router.get('/', authorizeUser, getProfile);

// Route for updating user profile with validation (requires authentication)
router.put('/', authorizeUser, validateProfile, update);

// Route for deleting user profile (requires authentication)
router.delete('/', authorizeUser, remove);



module.exports = router;






