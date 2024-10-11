const express = require('express');
const router = express.Router();
const {authorizeAdmin} = require('../../middlewares/auth/admin');
const { getPaginated, remove, update, getById, promoteToAdmin } = require('../../controllers/admin/user');
const { validateProfile } = require('../../middlewares/validateInput/user');
const {validatePagination}=require('../../middlewares/validatePagination')
const {validateUUID} = require('../../middlewares/validateUUID');
const {setUserInRequest} = require('../../middlewares/setUserInRequest'); // Middleware to set user by userId

// Route for fetching all users with pagination (admin only)
router.get('/', validatePagination,authorizeAdmin, getPaginated);

// Route for fetching a user by ID (admin only)
router.get('/:user_id', authorizeAdmin, validateUUID, setUserInRequest, getById);

// Route for deleting a user by ID (admin only)
router.delete('/:user_id', authorizeAdmin, validateUUID, setUserInRequest, remove);

// Route for updating a user by ID (admin only)
router.put('/:user_id', authorizeAdmin, validateUUID, validateProfile, setUserInRequest, update);

// Route for promoting a user to admin (admin only)
router.post('/:user_id/promote-to-admin', authorizeAdmin, validateUUID, setUserInRequest, promoteToAdmin);

module.exports = router;