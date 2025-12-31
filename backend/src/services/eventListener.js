const {redisStream} = require('../config/cache');
const { updateMemorizedWordsBatch } = require('../repositories/word');

const STREAM_KEY = 'word_memorized_events';
const GROUP_NAME = 'word_memorize_group';
const CONSUMER_NAME = 'worker-1';

async function processMessages(messages) {
  // Group updates by collection_id
  const updatesByCollection = {};

  const messageIds = [];

  for (const [id, fields] of messages) {
    messageIds.push(id);

    // Fields is an array like [key1, value1, key2, value2, ...]
    // Convert to object
    const data = {};
    for (let i = 0; i < fields.length; i += 2) {
      data[fields[i]] = fields[i + 1];
    }

    const userId = data.user_id;
    const collectionId = data.collection_id;
    const wordId = data.word_id;
    const isMemorized = data.is_memorized === 'true';

    if (!updatesByCollection[collectionId]) {
      updatesByCollection[collectionId] = [];
    }
    updatesByCollection[collectionId].push({ wordId, userId, isMemorized });
  }

  // Flatten updates into a single array and update in batch
  const updates = Object.entries(updatesByCollection).map(([collectionId, updatesArr]) => ({
    collectionId,
    updates: updatesArr
  }));
  if (updates.length > 0) {
    await updateMemorizedWordsBatch(updates);
  }

  // Acknowledge processed messages
  if (messageIds.length > 0) {
    await redisStream.xack(STREAM_KEY, GROUP_NAME, ...messageIds);
  }
}

async function consumeMemorizedEvents() {
  // Create the consumer group if it doesn't exist
  try {
    await redisStream.xgroup('CREATE', STREAM_KEY, GROUP_NAME, '0', 'MKSTREAM');
  } catch (err) {
    if (!err.message.includes('BUSYGROUP')) {
      throw err;
    }
  }

  // Process pending messages (id = '0') before processing new messages
  while (true) {
    try {
      const streams = await redisStream.xreadgroup(
        'GROUP',
        GROUP_NAME,
        CONSUMER_NAME,
        'COUNT',
        100,
        'STREAMS',
        STREAM_KEY,
        '0'
      );

      if (!streams) {
        break;
      }

      const [stream, messages] = streams[0];
      if (messages.length === 0) break;
      await processMessages(messages);
    } catch (err) {
      console.error('Error consuming pending memorized events:', err);
      await new Promise(resolve => setTimeout(resolve, 1000));
    }
  }

  // First process new and backlog messages (id = '>') indefinitely
  while (true) {
    try {
      const streams = await redisStream.xreadgroup(
        'GROUP',
        GROUP_NAME,
        CONSUMER_NAME,
        'COUNT',
        100,
        'BLOCK',
        5000,
        'STREAMS',
        STREAM_KEY,
        '>'
      );

      if (!streams) {
        continue;
      }

      const [stream, messages] = streams[0];
      await processMessages(messages);
    } catch (err) {
      console.error('Error consuming new memorized events:', err);
      if (err.message.includes('NOGROUP') || err.message.includes('no such key')) {
        try {
          await redis.xgroup('CREATE', STREAM_KEY, GROUP_NAME, '0', 'MKSTREAM');
          console.log('Recreated stream and consumer group after NOGROUP/no such key error.');
        } catch (createErr) {
          if (!createErr.message.includes('BUSYGROUP')) {
            console.error('Error recreating group:', createErr);
            await new Promise(resolve => setTimeout(resolve, 1000));
          }
        }
      } else {
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  }
}

module.exports = {
  consumeMemorizedEvents
}; 
