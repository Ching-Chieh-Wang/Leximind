const express = require('express');
const router = express.Router({ mergeParams: true });
const { authorizeUser } = require('../middlewares/auth/user');
const { validateLabelInput } = require('../middlewares/validateInput/label');
const {validateCollectionId} =require('../middlewares/validateId/collection')
const {validateLabelId} =require('../middlewares/validateId/label')
const {
  create,
  update,
  remove,
} = require('../controllers/label');

// Apply middlewares that are common to all routes in this router
router.use(authorizeUser);
router.use(validateCollectionId);

// Route for creating a new label within a specific collection
// This route is nested under /api/collections/:collection_id/labels
router.post('/', validateLabelInput, create);

// Route for updating a specific label by ID (requires authentication and ownership check)
router.put('/:label_id', validateLabelId, validateLabelInput, update);

// Route for deleting a specific label by ID
router.delete('/:label_id', validateLabelId, remove);



module.exports = router;