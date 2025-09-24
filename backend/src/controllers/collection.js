const collectionModel = require('../models/collection');
const wordModel = require('../models/word');
const cacheService = require('../services/cacheService')
const {checkC2ImageGetSignedUrl} = require('../utils/checkC2ImageGetSignedUrl')

const removeCollectionsCache = async (user_id) => {
  const collcionCacheKey = `userId:${user_id}:collections`;
  await cacheService.removeCache(collcionCacheKey);
};

// Function to create a new collection
const create = async (req, res) => {
  try {
    const { name, description, is_public } = req.body;
    const user_id = req.user_id;

    const collection = await collectionModel.create(user_id, name, description, is_public);

    if (!collection) {
      return res.status(500).json({ message: 'Failed to create collection' });
    }
    removeCollectionsCache(user_id)
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
    const user_id = req.user_id;
    const { collection_id } = req.params;

    const cacheKey = `collection:public:${collection_id}`;

   // Try to get from cache first
    let collection = await cacheService.getCache(cacheKey);
    if(collection == "NOT_FOUND") return res.status(404).json({ message: "Collection not found" });
    if (!collection) {
      collection = await collectionModel.getPublicById(collection_id);
      if (!collection) {
        await cacheService.setCache(cacheKeyPrefix+collection_id, "NOT_FOUND", 5*60);
        return res.status(404).json({ message: "Collection not found" });
      }
      // Store in cache
      await cacheService.setCache(cacheKey, JSON.stringify(collection), 2 * 24 * 60 * 60);
    }

    if(user_id && user_id != collection.userId){
      const collectionViewKey = `collection:view:${collection_id}`;
      cacheService.setPfadd(collectionViewKey, user_id)
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
    // This function fetches a private collection by user ID and collection ID.
    const user_id=req.user_id;
    const { collection_id } = req.params;

    // Cache key for user's private collection
    const collcionCacheKey = `userId:${user_id}:collection:private:${collection_id}`;

    let collection;
    // Cache-aside pattern: check Redis cache first
    const cachedcollection = await cacheService.getCache(collcionCacheKey);
    // If cache indicates not found, return 404 immediately
    if(cachedcollection == "__NOT_FOUND__") return res.status(404).json({ message: "User or collection not found" });
    if(cachedcollection) {
      // If found in cache, parse and use it
      collection = cachedcollection;
    } else {
      // Cache miss: fetch from database
      collection = await collectionModel.getPrivateById(user_id, collection_id );
      if (!collection) {
        // If not found in DB, cache the not found marker and return 404
        cacheService.setCache(collcionCacheKey, "__NOT_FOUND__", 5*60);
        return res.status(404).json({ message: "User or collection not found" });
      }
      // Store the fetched collection in cache for future requests
      cacheService.setCache(collcionCacheKey, JSON.stringify(collection), 2 * 60 * 60);
    }

    // Handling memorized words:
    // Cache key for memorized word IDs for this user and collection
    const memorizedIdCachekey = `user:${user_id}:collection:private:${collection_id}:memorized`;
    let memorizedCnt = 0;

    // Try to get memorized word IDs from Redis set cache
    const cachedMemorizedIds = await cacheService.getSetCache(memorizedIdCachekey);
    if (cachedMemorizedIds) {
      // If found in cache, calculate memorized count (excluding placeholder)
      memorizedCnt = cachedMemorizedIds.size - 1;
      // Overwrite DB’s is_memorized field with cache info for accuracy
      for (let word of Object.values(collection.words)) {
        word.is_memorized = cachedMemorizedIds.has(word.id.toString());
      }
    } else {
      // Cache miss: rebuild memorized IDs list from collection data
      const memorizedIds = Object.values(collection.words)
        .filter(w => w.is_memorized)
        .map(w => w.id);
      memorizedCnt = memorizedIds.length
      // Add a placeholder to avoid empty set issues
      memorizedIds.push("__EMPTY__")
      // Cache the memorized IDs set for 2 hours
      cacheService.setSetCache(memorizedIdCachekey, memorizedIds, 2 * 60 * 60);
    }

    // Calculate memorized count and not memorized count before responding
    collection.memorizedCnt = memorizedCnt;
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
    removeCollectionsCache(user_id)
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
    removeCollectionsCache(user_id)
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
    removeCollectionsCache(user_id)
    if (!isRemoveSuccess) {
      return res.status(404).json({ message: 'User or Collection not found' });
    }

    const collcionCacheKey = `userId:${user_id}collection:private:${collection_id}`;
    cacheService.removeCache(collcionCacheKey);

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

    const collcionsCacheKey = `userId:${user_id}:collections`;
    let isGetCollectionFromDB = false;
    let collections = await cacheService.getCache(collcionsCacheKey);
    if (!collections) {
      isGetCollectionFromDB = true;
      collections = await collectionModel.getPaginatedByUserIdSortedByLastViewedAt(user_id,offset,limit);
      cacheService.setCache(collcionsCacheKey, JSON.stringify(collections), 5 * 60 * 60);
    }


    // Use Redis pipeline to fetch stats hash for each collection
    const pipeline = cacheService.redis.pipeline();
    collections.forEach(c => {
      pipeline.hgetall(`user:${user_id}:collection:private:${c.id}:stats`);
    });
    const results = await pipeline.exec();

    const writePipeline = cacheService.redis.pipeline();

    for (let i = 0; i < collections.length; i++) {
      const stats = results[i][1];

      if (stats && Object.keys(stats).length > 0) {
        // We got stats from cache
        collections[i].word_cnt = parseInt(stats.word_cnt, 10);
        collections[i].memorized_cnt = parseInt(stats.memorized_cnt, 10);
      } else {
        // Cache miss → fall back to DB values and save them to Redis
        let word_cnt;
        let memorized_cnt;
        if(isGetCollectionFromDB){
          word_cnt = collections[i].word_cnt;
          memorized_cnt = collections[i].memorized_cnt;
        }
        else{
          const statsFromDB = await wordModel.getWordStats(collections[i].id);
          word_cnt = statsFromDB.word_cnt;
          memorized_cnt = statsFromDB.memorized_cnt;
        }

        collections[i].word_cnt = word_cnt;
        collections[i].memorized_cnt = memorized_cnt;

        writePipeline.hset(
          `user:${user_id}:collection:private:${collections[i].id}:stats`,
          'word_cnt', word_cnt,
          'memorized_cnt', memorized_cnt
        );
        writePipeline.expire(
          `user:${user_id}:collection:private:${collections[i].id}:stats`,
          1.5 * 60 * 60
        );
      }
    }

    await writePipeline.exec();
    
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

    const cacheKey = `searchPublicCollections:${query || ''}:${offset}:${limit}`;
    let cachedResult = await cacheService.getCache(cacheKey);
    if (cachedResult) {
      return res.status(200).json(cachedResult);
    }
    
    const collections = await collectionModel.searchPublicCollections(query, limit, offset);
    
    const updatedCollections = await Promise.all(
      collections.map(async (collection) => {
        collection.user_image = await checkC2ImageGetSignedUrl(collection.user_image);
        return collection;
      })
    );

    const responseData = { collections: updatedCollections };
    await cacheService.setCache(cacheKey, JSON.stringify(responseData), 3 * 60 * 60);

    res.status(200).json(responseData);
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