import redis from '../config/cache.js'; // your Redis client

export const incrementCollectionView = async (collection_id, user_id) => {
  const key = `collection:view:${collection_id}`;
  await redis.pfadd(key, user_id);
};