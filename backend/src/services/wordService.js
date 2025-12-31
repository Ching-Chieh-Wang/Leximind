const crypto = require('crypto');
const wordRepo = require('../repositories/word');
const cacheService = require('./cacheService');
const { generateSignedUrl, exists, uploadAudio } = require('./c2Service');
const { text2SpeechServce } = require('./text2SpeechService');

const removeCollectionCache = (user_id, collection_id) => {
  const collectionCacheKey = `userId:${user_id}:collection:private:${collection_id}`;
  cacheService.removeCache(collectionCacheKey);
};

const removeCollectionStatsCache = (user_id, collection_id) => {
  const statsCacheKey = `user:${user_id}:collection:private:${collection_id}:stats`;
  cacheService.removeCache(statsCacheKey);
};

const removeWordCache = (word_id) => {
  cacheService.removeCache(`word:${word_id}`);
};

const create = async ({ user_id, collection_id, name, description, img_path, label_ids }) => {
  try {
    const result = await wordRepo.create({ user_id, collection_id, name, description, img_path, label_ids });
    if (!result) {
      return { status: 404, error: { message: 'User or Collection not found' } };
    }

    removeCollectionCache(user_id, collection_id);
    removeCollectionStatsCache(user_id, collection_id);

    return { status: 201, data: { id: result.id } };
  } catch (err) {
    if (err.code === '23502') {
      return { status: 400, error: { message: 'Invalid collection or label ID provided' } };
    }
    console.error('Error creating word:', err);
    return { status: 500, error: { message: 'Failed to create word, please try again later.' } };
  }
};

const remove = async ({ user_id, collection_id, word_id }) => {
  try {
    const result = await wordRepo.remove(user_id, collection_id, word_id);
    removeCollectionCache(user_id, collection_id);
    removeCollectionStatsCache(user_id, collection_id);
    if (!result) {
      return { status: 404, error: { message: 'Word not found' } };
    }
    removeWordCache(word_id);

    return { status: 200, data: {} };
  } catch (err) {
    console.error('Error deleting word:', err);
    return { status: 500, error: { message: 'Failed to remove word, please try again later.' } };
  }
};

const update = async ({ user_id, collection_id, word_id, name, description, img_path }) => {
  try {
    const updateSuccess = await wordRepo.update(
      user_id,
      collection_id,
      word_id,
      name,
      description,
      img_path
    );
    removeCollectionCache(user_id, collection_id);
    if (!updateSuccess) {
      return { status: 404, error: { message: 'Word not found or unauthorized' } };
    }
    removeWordCache(word_id);

    return { status: 200, data: {} };
  } catch (err) {
    console.error('Error updating word:', err);
    return { status: 500, error: { message: 'Failed to update word, please try again later.' } };
  }
};

const getByLabelId = async ({ user_id, collection_id, label_id }) => {
  try {
    const data = await wordRepo.getByLabelId(user_id, collection_id, label_id);
    return { status: 200, data };
  } catch (err) {
    console.error('Error fetching words by label ID:', err);
    return { status: 500, error: { message: 'Server error' } };
  }
};

const getUnmemorized = async ({ user_id, collection_id }) => {
  try {
    const data = await wordRepo.getUnmemorized(user_id, collection_id);
    return { status: 200, data: { word_ids: data.word_ids } };
  } catch (err) {
    console.error('Error updating memorization status:', err);
    return { status: 500, error: { message: 'Server error' } };
  }
};

const searchByPrefix = async ({ user_id, collection_id, prefix }) => {
  try {
    if (!prefix) {
      return { status: 400, error: { message: 'prefix parameter is required' } };
    }

    const data = await wordRepo.searchByPrefix(user_id, collection_id, prefix);
    return { status: 200, data };
  } catch (err) {
    console.error('Error searching words by prefix :', err);
    return { status: 500, error: { message: 'Server error' } };
  }
};

const changeIsMemorizedStatus = async ({ user_id, collection_id, word_id, is_memorized }) => {
  try {
    const redisKey = `user:${user_id}:collection:private:${collection_id}:memorized`;

    const cacheExists = await cacheService.existsCache(redisKey);
    if (!cacheExists) {
      let memorizedWordIds = await wordRepo.getMemorizedWordIds(user_id, collection_id);
      if (!memorizedWordIds) {
        return { status: 404, error: { message: 'Words not found or unauthorized' } };
      }

      memorizedWordIds = [...memorizedWordIds, '__EMPTY__'];
      await cacheService.setSetCache(redisKey, memorizedWordIds);
    }

    if (is_memorized) {
      await cacheService.saddCache(redisKey, word_id);
    } else {
      await cacheService.sremCache(redisKey, word_id);
    }

    cacheService.xaddCache('word_memorized_events', {
      user_id,
      collection_id,
      word_id,
      is_memorized,
    });

    removeCollectionStatsCache(user_id, collection_id);

    return { status: 200, data: {} };
  } catch (err) {
    console.error('Error updating memorization status:', err);
    return {
      status: 500,
      error: { message: 'Failed to toggle memorization status, please try again later.' },
    };
  }
};

const textToSpeech = async ({ user_id, word_id }) => {
  const cacheKey = `word:${word_id}`;
  let word = await cacheService.getCache(cacheKey);

  if (!word) {
    word = await wordRepo.getById(user_id, word_id);
    if (!word) {
      return { status: 404, data: {} };
    }
    await cacheService.setCache(cacheKey, JSON.stringify(word), 3600);
  }

  const hash = crypto.createHash('sha256').update(word.name.toLowerCase()).digest('hex');
  const objectKey = `${word_id}/${hash}.mp3`;

  if (!(await exists(process.env.C2_BUCKET_TEXT_TO_SPEECH_BUCKET_NAME, objectKey))) {
    const audioBuffer = await text2SpeechServce.generate(word.name.toLowerCase());
    await uploadAudio(audioBuffer, objectKey);
  }

  return {
    status: 200,
    data: { url: await generateSignedUrl(process.env.C2_BUCKET_TEXT_TO_SPEECH_BUCKET_NAME, objectKey) },
  };
};

module.exports = {
  create,
  remove,
  update,
  getByLabelId,
  searchByPrefix,
  getUnmemorized,
  changeIsMemorizedStatus,
  textToSpeech,
};
