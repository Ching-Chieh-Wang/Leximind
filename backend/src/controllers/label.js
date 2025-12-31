const labelService = require('../services/labelService');

// Function to create a new label within a specific collection
const create = async (req, res) => {
  const { name } = req.body;
  const user_id = req.user_id;
  const { collection_id } = req.params;
  const { status, data, error } = await labelService.create({ user_id, collection_id, name });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

// Function to update a specific label by ID
const update = async (req, res) => {
  const user_id = req.user_id;
  const { collection_id, label_id } = req.params;
  const { name } = req.body;
  const { status, data, error } = await labelService.update({
    user_id,
    collection_id,
    label_id,
    name,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

// Function to delete a specific label by ID
const remove = async (req, res) => {
  const user_id = req.user_id;
  const { collection_id, label_id } = req.params;
  const { status, data, error } = await labelService.remove({ user_id, collection_id, label_id });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};


module.exports = {
  create,
  update,
  remove,
};
