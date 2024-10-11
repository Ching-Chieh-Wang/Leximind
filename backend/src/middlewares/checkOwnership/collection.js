const Collection = require('../../models/collection');

const checkCollectionOwnership = async (req, res, next) => {
  const { collection_id } = req.params; // Extract collection ID from the request parameters
  const user_id = req.user.id; // Get the current authenticated user's ID from the request

  try {
    // Find the collection by ID
    const collection = await Collection.getById(collection_id);

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Check if the collection belongs to the current user
    if (collection.user_id.toString() !== user_id.toString()) {
      return res.status(403).json({ message: 'You do not have permission to perform this action' });
    }

    next(); // Ownership confirmed, proceed to the next middleware or route handler
  } catch (err) {
    console.error('Error checking collection ownership:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { checkCollectionOwnership };