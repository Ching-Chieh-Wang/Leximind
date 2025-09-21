const removeCache = async (key) => {
  await redis.del(key);
};
// src/services/cacheService.js
const {redis} = require('../config/cache.js');

const existsCache = async (key) => {
  const exists = await redis.exists(key);
  return exists === 1;
};


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

const getSetCache = async (key) => {
  const pipeline = redis.multi(); // or redis.pipeline();
  pipeline.exists(key);
  pipeline.smembers(key);

  const [existsResult, smembersResult] = await pipeline.exec();
  const exists = existsResult[1];
  const data = smembersResult[1];

  if (exists === 0) {
    return null; // true cache miss
  }

  return new Set(data);
};

const setSetCache = async (key, values, ttl = 3600) => {
  const multi = redis.multi();

  multi.sadd(key, ...values);
  multi.expire(key, ttl);

  await multi.exec();
};

const saddCache = async (key, value) => {
  await redis.sadd(key, value);
};

const sremCache = async (key, value) => {
  await redis.srem(key, value);
};

const xaddCache = async (stream, message) => {
  await redis.xadd(stream, 'MAXLEN', '~', 10000, '*', ...Object.entries(message).flat());
};

const xreadCache = async (stream, count = 1, block = 0, lastId = '$') => {
  return await redis.xread('COUNT', count, 'BLOCK', block, 'STREAMS', stream, lastId);
};

module.exports = {
  incrementCollectionView,
  getCache,
  setCache,
  getSetCache,
  setSetCache,
  saddCache,
  sremCache,
  existsCache,
  xaddCache,
  xreadCache,
  removeCache
};