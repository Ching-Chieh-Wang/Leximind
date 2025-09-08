// src/services/cacheService.js
const redis = require('../config/cache.js');

const incrementCollectionView = async (collection_id, user_id) => {
  const key = `collection:view:${collection_id}`;
  await redis.pfadd(key, user_id);
};

module.exports = { incrementCollectionView };