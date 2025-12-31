const labelRepo = require('../repositories/label');
const cacheService = require('./cacheService');

const removeCollectionCache = (user_id, collection_id) => {
  const collectionCacheKey = `userId:${user_id}:collection:private:${collection_id}`;
  cacheService.removeCache(collectionCacheKey);
};

const create = async ({ user_id, collection_id, name }) => {
  try {
    const data = await labelRepo.create({ user_id, collection_id, name });

    if (!data) {
      return { status: 500, error: { message: 'Error creating label' } };
    }
    removeCollectionCache(user_id, collection_id);
    return { status: 201, data: { id: data.id } };
  } catch (err) {
    if (err.code === '23502') {
      return { status: 400, error: { message: 'Invalid user or collection ID provided' } };
    }
    if (err.code === '23505') {
      return {
        status: 400,
        error: {
          message: {
            invalidArguments: [
              { path: 'name', msg: 'A label with this name already exists in this collection.' },
            ],
          },
        },
      };
    }
    console.error('Error creating label:', err);
    return { status: 500, error: { message: 'Failed to create label, please try again later!' } };
  }
};

const update = async ({ user_id, collection_id, label_id, name }) => {
  try {
    const isUpdateSuccess = await labelRepo.update(user_id, collection_id, label_id, name);
    removeCollectionCache(user_id, collection_id);
    if (!isUpdateSuccess) {
      return { status: 404, error: { message: 'Label not found' } };
    }
    return { status: 200, data: {} };
  } catch (err) {
    if (err.code === '23505') {
      return {
        status: 400,
        error: {
          message: {
            invalidArguments: [
              { path: 'name', msg: 'A label with this name already exists in this collection.' },
            ],
          },
        },
      };
    }
    console.error('Error updating label:', err);
    return { status: 500, error: { message: 'Failed to updawte label, please try again later!' } };
  }
};

const remove = async ({ user_id, collection_id, label_id }) => {
  try {
    const isRemoved = await labelRepo.remove(user_id, collection_id, label_id);
    removeCollectionCache(user_id, collection_id);
    if (!isRemoved) {
      return { status: 404, error: { message: 'Label not found' } };
    }
    return { status: 200, data: {} };
  } catch (err) {
    console.error('Error deleting label:', err);
    return { status: 500, error: { message: 'Failed to remove label, please try again later!' } };
  }
};

module.exports = {
  create,
  update,
  remove,
};
