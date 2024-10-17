const collectionModel = require('../models/collection');

// Function to create a new collection
const create = async (req, res) => {
  try {
    const { name, description } = req.body;
    const user_id = req.user.id;

    // Create a new collection in the database
    const newCollection = await collectionModel.create(user_id, name, description);

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
    let collection = req.collection;
    let { name, description } = req.body;

    // Update the collection in the database
    if(name!==collection.name||description!==(collection.description||null)){
      const updatedCollection = await collectionModel.update(collection.id, name, description);
      if (!updatedCollection) {
        return res.status(404).json({ message: 'Collection not found' });
      }
      // Respond with the updated collection data
      res.status(200).json({ message: 'Collection updated successfully', collection: updatedCollection });
    }
    else{
      // If the name and description are the same, return a 204 No Content status, indicating no changes were made
      return res.status(204).json({ message: 'No changes made to the collection.' });
    }
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

// Function to get all collections for the authenticated user
const getPaginatedByUserId = async (req, res) => {
  try {
    const user_id = req.user.id;
    const limit = parseInt(req.query.limit, 10) || 10;  // Default limit to 10 if not provided
    const offset = parseInt(req.query.offset, 10) || 0; // Default offset to 0 if not provided

    // Fetch paginated collections for the authenticated user
    const collections = await collectionModel.getPaginatedByUserId(user_id, limit, offset);

    // Respond with the paginated list of collections
    res.status(200).json({ collections });
  } catch (err) {
    console.error('Error fetching paginated collections:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  create,
  getById,
  update,
  remove,
  getPaginatedByUserId
};