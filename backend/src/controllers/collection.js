const collectionModel = require('../models/collection');

// Function to create a new collection
const create = async (req, res) => {
  try {
    const { name, description, is_public } = req.body;
    const user_id = req.user.id;
    const author_id = req.user.id; // Assuming the authenticated user is the author

    // Create a new collection in the database
    const newCollection = await collectionModel.create(user_id, author_id, name, description, is_public);

    // If collection creation fails, return a 500 error
    if (!newCollection) {
      return res.status(500).json({ message: 'Error creating collection' });
    }

    // Respond with the newly created collection
    res.status(201).json({ message: 'Collection created successfully', collection: newCollection });
  } catch (err) {
    console.error('Error creating collection:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get a specific collection by ID
const getById = async (req, res) => {
  try {
    const { collection_id } = req.params;

    // Fetch the collection from the database
    const collection = await collectionModel.getById(collection_id);

    if (!collection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Respond with the collection data
    res.status(200).json({ collection });
  } catch (err) {
    console.error('Error fetching collection:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to update a specific collection by ID
const update = async (req, res) => {
  try {
    const collection = req.collection;
    const { name, description, is_public } = req.body;

    // Check if there are no changes to name or description
    if (
      (name === collection.name) &&
      (description === collection.description || description === null)
    ) {
      return res.status(204).json({ message: 'No changes made to the collection.' });
    }

    // Update the collection in the database
    const updatedCollection = await collectionModel.update(collection.id, name, description, is_public);
    if (!updatedCollection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Respond with the updated collection data
    res.status(200).json({ message: 'Collection updated successfully', collection: updatedCollection });
  } catch (err) {
    console.error('Error updating collection:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to delete a collection by ID
const remove = async (req, res) => {
  try {
    const collection_id = req.collection.id;

    // Delete the collection from the database
    const deletedCollection = await collectionModel.remove(collection_id);

    if (!deletedCollection) {
      return res.status(404).json({ message: 'Collection not found' });
    }

    // Respond with a success message
    res.status(200).json({ message: 'Collection deleted successfully', collection: deletedCollection });
  } catch (err) {
    console.error('Error deleting collection:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get all collections for the authenticated user, sorted by last viewed time
const getAllByUserIdSortedByLastViewTime = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Fetch all collections for the authenticated user, sorted by last viewed time
    const collections = await collectionModel.getAllByUserIdSortedByLastViewTime(user_id);

    // Respond with the list of collections
    res.status(200).json({ collections });
  } catch (err) {
    console.error('Error fetching collections:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  create,
  getById,
  update,
  remove,
  getAllByUserIdSortedByLastViewTime
};