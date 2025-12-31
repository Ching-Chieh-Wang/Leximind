const cacheService = require('./cacheService');
const wordLabelRepo = require('../repositories/word_label');

const removeCollectionCache = async (user_id, collection_id) => {
  const collectionCacheKey = `userId:${user_id}:collection:private:${collection_id}`;
  await cacheService.removeCache(collectionCacheKey);
};

const addWordToLabel = async ({ user_id, label_id, word_id, collection_id }) => {
  try {
    const addSuccess = await wordLabelRepo.addWordToLabel(user_id, label_id, word_id, collection_id);
    removeCollectionCache(user_id, collection_id);
    if (!addSuccess) {
      return { status: 404, error: { message: 'Label or word not found' } };
    }
    return { status: 200, data: {} };
  } catch (err) {
    if (err.code === '23505') {
      return { status: 409, error: { message: 'This word is already associated with the label' } };
    }
    if (err.code === '23502') {
      return { status: 401, error: { message: 'User or collection not found' } };
    }
    if (err.code === '23503') {
      return { status: 401, error: { message: 'Label or word not found' } };
    }
    if (err.code === '23514') {
      return {
        status: 400,
        error: { message: 'Word and label must belong to the same collection' },
      };
    }
    console.error('Error adding word to label:', err);
    return { status: 500, error: { message: 'Server error' } };
  }
};

const removeWordFromLabel = async ({ user_id, label_id, word_id, collection_id }) => {
  try {
    const removeSuccess = await wordLabelRepo.removeWordFromLabel(
      user_id,
      label_id,
      word_id,
      collection_id
    );
    removeCollectionCache(user_id, collection_id);
    if (!removeSuccess) {
      return {
        status: 404,
        error: { message: 'User, word, label ,collection or Word-label association not found' },
      };
    }

    return { status: 200, data: {} };
  } catch (err) {
    console.error('Error removing word from label:', err);
    return { status: 500, error: { message: 'Server error' } };
  }
};

module.exports = {
  addWordToLabel,
  removeWordFromLabel,
};
