const collectionModel = require('../models/collection');
const cacheService = require('../services/cacheService')
const {checkC2ImageGetSignedUrl} = require('../utils/checkC2ImageGetSignedUrl')

// Function to create a new collection
const create = async (req, res) => {
  try {
    const { name, description, is_public } = req.body;
    const user_id = req.user_id;

    const collection = await collectionModel.create(user_id, name, description, is_public);

    if (!collection) {
      return res.status(500).json({ message: 'Failed to create collection' });
    }

    const {id,created_at} = collection

    res.status(201).json({ id,created_at });
  } catch (err) {
    if (err.code === '23503') { // Foreign key violation
      return res.status(400).json({ message: 'User not found' });
    }
    console.error('Failed to create collection:', err);
    res.status(500).json({ message: 'Failed to create collection' });
  }
};

// Function to get private collection
const getPublicById = async (req, res) => {
  try {
    const cacheKeyPrefix = "collection:public:";

    const user_id = req.user_id;
    const { collection_id } = req.params;

   // Try to get from cache first
    let collection = await cacheService.getCache(cacheKeyPrefix+collection_id);
    if(collection == "NOT_FOUND") return res.status(404).json({ message: "Collection not found" });
    if (!collection) {
      collection = await collectionModel.getPublicById(collection_id);
      if (!collection) {
        await cacheService.setCache(cacheKeyPrefix+collection_id, "NOT_FOUND");
        return res.status(404).json({ message: "Collection not found" });
      }
      // Store in cache
      await cacheService.setCache(cacheKeyPrefix+collection_id, collection);
    }

    // Convert label_ids and words to records
    collection.words = Object.fromEntries(
      collection.words.map(word => [
        word.id,
        {
          ...word,
        }
      ])
    );

    collection.labels = Object.fromEntries(
      collection.labels.map(label => [
        label.id,
        {
          ...label,
        }
      ])
    );
    if(user_id && user_id != collection.userId){
      cacheService.incrementCollectionView(collection_id, user_id)
    }
    res.status(200).json(collection);
  } catch (err) {
    console.error('Error fetching all words:', err);
    res.status(500).json({ message: 'Failed to load collection' });
  }
};



// Function to get private collection
const getPrivateById = async (req, res) => {
  try {
    const user_id=req.user_id;
    const { collection_id } = req.params;

    let collection = await collectionModel.getPrivateById(user_id, collection_id );

    if (!collection) {
      return res.status(404).json({ message: "User or collection not found" });
    }

    // Convert label_ids and words to records
    collection.words = Object.fromEntries(
      collection.words.map(word => [
        word.id,
        {
          ...word,
        }
      ])
    );

    collection.labels = Object.fromEntries(
      collection.labels.map(label => [
        label.id,
        {
          ...label,
        }
      ])
    );

    collection.memorizedCnt = Object.keys(collection.words).length - collection.not_memorized_cnt;
    res.status(200).json(collection);
  } catch (err) {
    console.error('Error fetching all words:', err);
    res.status(500).json({ message: 'Failed to load collection' });
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

    return res.status(200).json({});
  } catch (err) {
    if (err.code === '23503') { // Foreign key violation
      return res.status(400).json({ message: 'User or collection not found' });
    }
    console.error('Error updating collection:', err);
    res.status(500).json({ message: 'Failed to update collection' });
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

    return res.status(200).json({});
  } catch (err) {
    if (err.code === '23503') { // Foreign key violation
      return res.status(400).json({ message: 'User or collection not found' });
    }
    console.error('Error updating collection authorization:', err);
    res.status(500).json({ message: 'Failed to update authority' });
  }
};

// Function to delete a collection by ID
const remove = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { collection_id } = req.params;

    const isRemoveSuccess = await collectionModel.remove(user_id, collection_id);

    if (!isRemoveSuccess) {
      return res.status(404).json({ message: 'User or Collection not found' });
    }

    return res.sendStatus(200);
  } catch (err) {
    if (err.code === '23503') { // Foreign key violation
      return res.status(400).json({ message: 'User or collection not found' });
    }
    console.error('Error deleting collection:', err);
    res.status(500).json({ message: 'Error deleting collection:' });
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
    console.error('Error loading collections:', err);
    res.status(500).json({ message: 'Error loading collections:' });
  }
};

// Function to search public collections with pagination
const searchPublicCollections = async (req, res) => {
  try {
    const { query } = req.query;
    const offset = req.offset;
    const limit = req.limit;
    
    const collections = await collectionModel.searchPublicCollections(query, limit, offset);
    
    const updatedCollections = await Promise.all(
      collections.map(async (collection) => {
        collection.user_image = await checkC2ImageGetSignedUrl(collection.user_image);
        return collection;
      })
    );
    res.status(200).json({collections:updatedCollections});
  } catch (err) {
    console.error('Error searching public collections:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  create,
  getPublicById,
  getPrivateById,
  update,
  updateAuthorize,
  remove,
  getPaginatedByUserIdSortedByLastViewedAt,
  searchPublicCollections,
};