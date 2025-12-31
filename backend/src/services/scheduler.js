const {redis} = require('../config/cache.js');
const { updateViewCountsBatch } = require('../repositories/collection.js');

/**
 * Sync Redis view counts to Postgres
 */
const syncViewCounts = async () => {
  try {
    let cursor = '0';
    const updates = [];

    do {
      const [nextCursor, keys] = await redis.scan(cursor, 'MATCH', 'collection:view:*', 'COUNT', 100);
      cursor = nextCursor;

      for (const key of keys) {
        const collectionId = parseInt(key.split(':')[2]);
        const count = await redis.pfcount(key);
        if (count > 0) {
          updates.push({ collectionId, count });
        }
      }

      // Delete the processed keys
      if (keys.length > 0) {
        await redis.del(...keys);
      }
    } while (cursor !== '0');

    if (updates.length > 0) {
      try {
        await updateViewCountsBatch(updates);
      } catch (err) {
        console.error('Error during batch update of view counts:', err);
      }
    }

  } catch (err) {
    console.error('Error syncing view counts:', err);
  }
};

// Run sync every 5 minutes
// setInterval(syncViewCounts, 5 * 60 * 1000);
setInterval(syncViewCounts, 5 * 60 * 1000);

// Export function for manual trigger if needed
module.exports = {
  syncViewCounts
};
