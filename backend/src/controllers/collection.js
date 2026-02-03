const collectionService = require('../services/collectionService');

// Function to create a new collection
const create = async (req, res) => {
  const { name, description, is_public } = req.body;
  const user_id = req.user_id;
  const { status, data, error } = await collectionService.create({
    user_id,
    name,
    description,
    is_public,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

// Function to get private collection
const getPublicById = async (req, res) => {
  const user_id = req.user_id;
  const { collection_id } = req.params;
  const { status, data, error } = await collectionService.getPublicById({
    user_id,
    collection_id,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};



// Function to get private collection
const getPrivateById = async (req, res) => {
  const user_id = req.user_id;
  const { collection_id } = req.params;
  const { status, data, error } = await collectionService.getPrivateById({
    user_id,
    collection_id,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};






// Function to update a specific collection by ID
const update = async (req, res) => {
  const user_id = req.user_id;
  const { collection_id } = req.params;
  const { name, description, is_public } = req.body;
  const { status, data, error } = await collectionService.update({
    user_id,
    collection_id,
    name,
    description,
    is_public,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

// Function to update a specific collection by ID
const updateAuthorize = async (req, res) => {
  const user_id = req.user_id;
  const { collection_id } = req.params;
  const { is_public } = req.body;
  const { status, data, error } = await collectionService.updateAuthorize({
    user_id,
    collection_id,
    is_public,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

// Function to delete a collection by ID
const remove = async (req, res) => {
  const user_id = req.user_id;
  const { collection_id } = req.params;
  const { status, data, error } = await collectionService.remove({
    user_id,
    collection_id,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

// Function to get all collections for the authenticated user, sorted by last viewed time
const getPaginatedByUserIdSortedByLastViewedAt = async (req, res) => {
  const user_id = req.user_id;
  const offset = req.offset;
  const limit = req.limit;
  const { status, data, error } = await collectionService.getPaginatedByUserIdSortedByLastViewedAt({
    user_id,
    offset,
    limit,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

// Function to search public collections with pagination
const searchPublicCollections = async (req, res) => {
  const { query } = req.query;
  const offset = req.offset;
  const limit = req.limit;
  const { status, data, error } = await collectionService.searchPublicCollections({
    query,
    offset,
    limit,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

// Function to import a public collection to the authenticated user
const importPublicCollection = async (req, res) => {
  const user_id = req.user_id;
  const { collection_id } = req.params;
  const { status, data, error } = await collectionService.importPublicCollection({
    user_id,
    collection_id,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
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
  importPublicCollection,
};
