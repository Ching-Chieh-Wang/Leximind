// src/services/cacheService.js
const redis = require('../config/cache.js');

const incrementCollectionView = async (collection_id, user_id) => {
  const key = `collection:view:${collection_id}`;
  await redis.pfadd(key, user_id);
};

const getCache = async (key) => {
  const data = await redis.get(key);
  return data ? JSON.parse(data) : null;
};

const setCache = async (key, value, ttl = 3600) => { // default 1 hour
  await redis.set(key, JSON.stringify(value), 'EX', ttl);
};


module.exports = { incrementCollectionView, getCache, setCache };