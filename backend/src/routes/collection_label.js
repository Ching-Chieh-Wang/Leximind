const express = require('express');
const router = express.Router();
const { authorizedUser } = require('../middlewares/auth/user'); // Authentication middleware
const { checkCollectionOwnership } = require('../middlewares/checkOwnership/collection'); // Ownership check middleware
const { validateLabelInput } = require('../middlewares/validateInput/collection'); // Label validation middleware
const {
  addLabelToCollection,
  removeLabelFromCollection,
  getLabelsByCollection
} = require('../controllers/collection_label');

// Route for adding a label to a collection (requires authentication, ownership check, and input validation)
router.post('/collection/:collection_id/label/:label_id', authorizedUser, checkCollectionOwnership, validateLabelInput, addLabelToCollection);

// Route for removing a label from a collection (requires authentication and ownership check)
router.delete('/collection/:collection_id/label/:label_id', authorizedUser, checkCollectionOwnership, removeLabelFromCollection);

// Route for getting all labels under a specific collection (requires authentication and ownership check)
router.get('/collection/:collection_id/labels', authorizedUser, checkCollectionOwnership, getLabelsByCollection);

module.exports = router;