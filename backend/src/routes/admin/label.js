const express = require('express');
const router = express.Router();
const {authorizeAdmin} = require('../../middlewares/auth/admin');
const {validatePagination} = require('../../middlewares/validatePagination');
const { create, getById, getPaginated, getAllByUserId, update, remove } = require('../../controllers/admin/label');
const {validateUUID} = require('../../middlewares/validateUUID');
const {setUserInRequest} = require('../../middlewares/setUserInRequest'); 
const {checkValidLabelId} = require('../../middlewares/checkValidId/label'); 

// Route for creating a new label for a specific user (admin only)
router.post('/user/:user_id', authorizeAdmin, validateUUID, setUserInRequest, create);

// Route for fetching a label by ID (admin only)
router.get('/:id', authorizeAdmin, checkValidLabelId, getById); 

// Route for fetching all labels by a user ID (admin only)
router.get('/user/:user_id', authorizeAdmin, validateUUID, setUserInRequest, getAllByUserId);

// Route for fetching all labels with pagination (admin only)
router.get('/', authorizeAdmin,validatePagination, getPaginated);

// Route for updating a label by ID (admin only)
router.put('/:id', authorizeAdmin, checkValidLabelId, update); 

// Route for deleting a label by ID (admin only)
router.delete('/:id', authorizeAdmin, checkValidLabelId, remove); 

module.exports = router;