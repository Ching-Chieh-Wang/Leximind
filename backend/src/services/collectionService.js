const collectionRepo = require('../repositories/collection');
const wordRepo = require('../repositories/word');
const cacheService = require('./cacheService');

const removeCollectionsCache = async (user_id) => {
  const collectionCacheKey = `userId:${user_id}:collections`;
  await cacheService.removeCache(collectionCacheKey);
};

const create = async ({ user_id, name, description, is_public }) => {
  try {
    const collection = await collectionRepo.create(user_id, name, description, is_public);

    if (!collection) {
      return { status: 500, error: { message: 'Failed to create collection' } };
    }

    await removeCollectionsCache(user_id);
    const { id, created_at } = collection;

    return { status: 201, data: { id, created_at } };
  } catch (err) {
    if (err.code === '23503') {
      return { status: 400, error: { message: 'User not found' } };
    }
    console.error('Failed to create collection:', err);
    return { status: 500, error: { message: 'Failed to create collection' } };
  }
};

const getPublicById = async ({ user_id, collection_id }) => {
  try {
    const cacheKey = `collection:public:${collection_id}`;

    let collection = await cacheService.getCache(cacheKey);
    if (collection === 'NOT_FOUND') {
      return { status: 404, error: { message: 'Collection not found' } };
    }

    if (!collection) {
      collection = await collectionRepo.getPublicById(collection_id);
      if (!collection) {
        await cacheService.setCache(cacheKey, 'NOT_FOUND', 5 * 60);
        return { status: 404, error: { message: 'Collection not found' } };
      }
      await cacheService.setCache(cacheKey, JSON.stringify(collection), 2 * 24 * 60 * 60);
    }

    if (user_id && user_id !== collection.userId) {
      const collectionViewKey = `collection:view:${collection_id}`;
      cacheService.setPfadd(collectionViewKey, user_id);
    }

    return { status: 200, data: collection };
  } catch (err) {
    console.error('Error fetching collection:', err);
    return { status: 500, error: { message: 'Failed to load collection' } };
  }
};

const getPrivateById = async ({ user_id, collection_id }) => {
  try {
    const collectionCacheKey = `userId:${user_id}:collection:private:${collection_id}`;

    let collection;
    const cachedCollection = await cacheService.getCache(collectionCacheKey);
    if (cachedCollection === '__NOT_FOUND__') {
      return { status: 404, error: { message: 'User or collection not found' } };
    }

    if (cachedCollection) {
      collection = cachedCollection;
    } else {
      collection = await collectionRepo.getPrivateById(user_id, collection_id);
      if (!collection) {
        cacheService.setCache(collectionCacheKey, '__NOT_FOUND__', 5 * 60);
        return { status: 404, error: { message: 'User or collection not found' } };
      }
      cacheService.setCache(collectionCacheKey, JSON.stringify(collection), 2 * 60 * 60);
    }

    const memorizedIdCacheKey = `user:${user_id}:collection:private:${collection_id}:memorized`;
    let memorizedCnt = 0;

    const cachedMemorizedIds = await cacheService.getSetCache(memorizedIdCacheKey);
    if (cachedMemorizedIds) {
      memorizedCnt = cachedMemorizedIds.size - 1;
      for (const word of Object.values(collection.words)) {
        word.is_memorized = cachedMemorizedIds.has(word.id.toString());
      }
    } else {
      const memorizedIds = Object.values(collection.words)
        .filter((w) => w.is_memorized)
        .map((w) => w.id);
      memorizedCnt = memorizedIds.length;
      memorizedIds.push('__EMPTY__');
      cacheService.setSetCache(memorizedIdCacheKey, memorizedIds, 2 * 60 * 60);
    }

    collection.memorizedCnt = memorizedCnt;
    return { status: 200, data: collection };
  } catch (err) {
    console.error('Error fetching collection:', err);
    return { status: 500, error: { message: 'Failed to load collection' } };
  }
};

const update = async ({ user_id, collection_id, name, description, is_public }) => {
  try {
    const isUpdateSuccess = await collectionRepo.update(
      user_id,
      collection_id,
      name,
      description,
      is_public
    );
    await removeCollectionsCache(user_id);
    if (!isUpdateSuccess) {
      return { status: 404, error: { message: 'User or Collection not found' } };
    }

    return { status: 200, data: {} };
  } catch (err) {
    if (err.code === '23503') {
      return { status: 400, error: { message: 'User or collection not found' } };
    }
    console.error('Error updating collection:', err);
    return { status: 500, error: { message: 'Failed to update collection' } };
  }
};

const updateAuthorize = async ({ user_id, collection_id, is_public }) => {
  try {
    const isUpdateSuccess = await collectionRepo.update(user_id, collection_id, null, null, is_public);
    await removeCollectionsCache(user_id);
    if (!isUpdateSuccess) {
      return { status: 404, error: { message: 'User or Collection not found' } };
    }

    return { status: 200, data: {} };
  } catch (err) {
    if (err.code === '23503') {
      return { status: 400, error: { message: 'User or collection not found' } };
    }
    console.error('Error updating collection authorization:', err);
    return { status: 500, error: { message: 'Failed to update authority' } };
  }
};

const remove = async ({ user_id, collection_id }) => {
  try {
    const isRemoveSuccess = await collectionRepo.remove(user_id, collection_id);
    await removeCollectionsCache(user_id);
    if (!isRemoveSuccess) {
      return { status: 404, error: { message: 'User or Collection not found' } };
    }

    const collectionCacheKey = `userId:${user_id}collection:private:${collection_id}`;
    cacheService.removeCache(collectionCacheKey);

    return { status: 200, data: {} };
  } catch (err) {
    if (err.code === '23503') {
      return { status: 400, error: { message: 'User or collection not found' } };
    }
    console.error('Error deleting collection:', err);
    return { status: 500, error: { message: 'Error deleting collection:' } };
  }
};

const getPaginatedByUserIdSortedByLastViewedAt = async ({ user_id, offset, limit }) => {
  try {
    const collectionsCacheKey = `userId:${user_id}:collections`;
    let isGetCollectionFromDB = false;
    let collections = await cacheService.getCache(collectionsCacheKey);
    if (!collections) {
      isGetCollectionFromDB = true;
      collections = await collectionRepo.getPaginatedByUserIdSortedByLastViewedAt(user_id, offset, limit);
      cacheService.setCache(collectionsCacheKey, JSON.stringify(collections), 5 * 60 * 60);
    }

    const pipeline = cacheService.redis.pipeline();
    collections.forEach((c) => {
      pipeline.hgetall(`user:${user_id}:collection:private:${c.id}:stats`);
    });
    const results = await pipeline.exec();

    const writePipeline = cacheService.redis.pipeline();

    for (let i = 0; i < collections.length; i++) {
      const stats = results[i][1];

      if (stats && Object.keys(stats).length > 0) {
        collections[i].word_cnt = parseInt(stats.word_cnt, 10);
        collections[i].memorized_cnt = parseInt(stats.memorized_cnt, 10);
      } else {
        let word_cnt;
        let memorized_cnt;
        if (isGetCollectionFromDB) {
          word_cnt = collections[i].word_cnt;
          memorized_cnt = collections[i].memorized_cnt;
        } else {
          const statsFromDB = await wordRepo.getWordStats(collections[i].id);
          word_cnt = statsFromDB.word_cnt;
          memorized_cnt = statsFromDB.memorized_cnt;
        }

        collections[i].word_cnt = word_cnt;
        collections[i].memorized_cnt = memorized_cnt;

        writePipeline.hset(
          `user:${user_id}:collection:private:${collections[i].id}:stats`,
          'word_cnt',
          word_cnt,
          'memorized_cnt',
          memorized_cnt
        );
        writePipeline.expire(
          `user:${user_id}:collection:private:${collections[i].id}:stats`,
          1.5 * 60 * 60
        );
      }
    }

    await writePipeline.exec();

    return { status: 200, data: collections };
  } catch (err) {
    console.error('Error loading collections:', err);
    return { status: 500, error: { message: 'Error loading collections:' } };
  }
};

const searchPublicCollections = async ({ query, offset, limit }) => {
  try {
    const cacheKey = `searchPublicCollections:${query || ''}:${offset}:${limit}`;
    const cachedResult = await cacheService.getCache(cacheKey);
    if (cachedResult) {
      return { status: 200, data: cachedResult };
    }

    const collections = await collectionRepo.searchPublicCollections(query, limit, offset);
    await cacheService.setCache(cacheKey, JSON.stringify(collections), 3 * 60 * 60);
    return { status: 200, data: collections };
  } catch (err) {
    console.error('Error searching public collections:', err);
    return { status: 500, error: { message: 'Server error' } };
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
