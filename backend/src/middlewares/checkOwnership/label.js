const labelModel = require('../../models/label');

const checkLabelOwnership = async (req, res, next) => {
  const { label_id } = req.params;
  const user_id = req.user.id;
  const collection_id = req.collection.id;

  try {
    // Check if label_id is provided
    if (!label_id) {
      return res.status(400).json({ message: 'Label ID is required' });
    }

    // Validate the label_id to ensure it's a positive integer
    if (isNaN(label_id) || parseInt(label_id) !== Number(label_id)) {
      return res.status(400).json({ message: 'Invalid label ID' });
    }

    // Find the label by ID
    const label = await labelModel.getById(label_id);

    if (!label) {
      return res.status(404).json({ message: 'Label not found' });
    }

    // Check if the label belongs to the current user
    if (label.user_id !== user_id) {
      return res.status(403).json({ message: 'You do not have permission to access this label' });
    }

    // Check if the label is associated with the specified collection
    if (label.collection_id !== collection_id) {
      return res.status(403).json({ message: 'Label does not belong to this collection' });
    }

    // Attach the label object to the request for further use in the next handler
    req.label = label;

    // Ownership and association confirmed, proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Error checking label ownership:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { checkLabelOwnership };