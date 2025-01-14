const collectionModel = require('../models/collection');

// Function to create a new collection
const create = async (req, res) => {
  try {
    const { name, description, is_public } = req.body;
    const user_id = req.user_id;

    const newCollectionData = await collectionModel.create(user_id, name, description, is_public);

    if (!newCollectionData) {
      return res.status(500).json({ message: 'Error creating collection' });
    }

    res.status(201).json({ message: 'Collection created successfully', id: newCollectionData.id, created_at: newCollectionData.created_at });
  } catch (err) {
    if (err.code === '23503') { // Foreign key violation
      return res.status(400).json({ message: 'User or collection not found' });
    }
    console.error('Error creating collection:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get paginated words
const getById = async (req, res) => {
  try {
    const user_id=req.user_id;
    const { collection_id } = req.params;

    // Fetch the paginated words
    const collection = await collectionModel.getById(user_id, collection_id );
    if(!collection)return res.status(404).json({ message:"Collection not found" });
    res.status(200).json({ message:"Collection get successfully" ,collection });
  } catch (err) {
    console.error('Error fetching all words:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to update a specific collection by ID
const update = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { collection_id } = req.params;
    const { name, description, is_public } = req.body;

    const isUpdateSucess = await collectionModel.update(user_id, collection_id, name, description, is_public);

    if (!isUpdateSucess) {
      return res.status(404).json({ message: 'User or Collection not found' });
    }

    res.status(200).json({ message: 'Collection updated successfully' });
  } catch (err) {
    if (err.code === '23503') { // Foreign key violation
      return res.status(400).json({ message: 'Invalid user ID provided' });
    }
    console.error('Error updating collection:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to update a specific collection by ID
const updateAuthorize = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { collection_id } = req.params;
    const {  is_public } = req.body;

    const isUpdateSucess = await collectionModel.update(user_id, collection_id, null,null,is_public);

    if (!isUpdateSucess) {
      return res.status(404).json({ message: 'User or Collection not found' });
    }

    res.status(200).json({ message: 'Collection updated successfully' });
  } catch (err) {
    if (err.code === '23503') { // Foreign key violation
      return res.status(400).json({ message: 'Invalid user ID provided' });
    }
    console.error('Error updating collection authorization:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to delete a collection by ID
const remove = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { collection_id } = req.params;

    if (!collection_id || !user_id) {
      return res.status(400).json({ message: 'Collection ID and user ID are required' });
    }

    const isRemoveSuccess = await collectionModel.remove(user_id, collection_id);

    if (!isRemoveSuccess) {
      return res.status(404).json({ message: 'User or Collection not found' });
    }

    res.status(200).json({ message: 'Collection deleted successfully' });
  } catch (err) {
    if (err.code === '23503') { // Foreign key violation
      return res.status(400).json({ message: 'Invalid user ID provided' });
    }
    console.error('Error deleting collection:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get all collections for the authenticated user, sorted by last viewed time
const getPaginatedByUserIdSortedByLastViewedAt = async (req, res) => {
  try {
    const user_id = req.user_id;
    const offset = req.offset;
    const limit = req.limit;

    const collections = await collectionModel.getPaginatedByUserIdSortedByLastViewedAt(user_id,offset,limit);
    
    res.status(200).json({ collections });
  } catch (err) {
    if (err.code === '23503') { // Foreign key violation
      return res.status(400).json({ message: 'Invalid user ID provided' });
    }
    console.error('Error fetching collections:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to search public collections with pagination
const searchPublicCollections = async (req, res) => {
  try {
    const { query } = req.query;
    const offset = req.offset;
    const limit = req.limit;
    
    const collections = await collectionModel.searchPublicCollections(query, limit, offset);

    res.status(200).json({ collections });
  } catch (err) {
    console.error('Error searching public collections:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  create,
  getById,
  update,
  updateAuthorize,
  remove,
  getPaginatedByUserIdSortedByLastViewedAt,
  searchPublicCollections,
};