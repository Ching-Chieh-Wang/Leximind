const wordService = require('../services/wordService');

// Function to create a new word
const create = async (req, res) => {
  const user_id = req.user_id;
  const { collection_id } = req.params;
  const { name, description, img_path, label_ids } = req.body;
  const { status, data, error } = await wordService.create({
    user_id,
    collection_id,
    name,
    description,
    img_path,
    label_ids,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

// Function to remove a word
const remove = async (req, res) => {
  const user_id = req.user_id;
  const { word_id, collection_id } = req.params;
  const { status, data, error } = await wordService.remove({ user_id, collection_id, word_id });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

// Function to update a word
const update = async (req, res) => {
  const user_id = req.user_id;
  const { word_id, collection_id } = req.params;
  const { name, description, img_path } = req.body;
  const { status, data, error } = await wordService.update({
    user_id,
    collection_id,
    word_id,
    name,
    description,
    img_path,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

// Controller to get paginated words by label ID
const getByLabelId = async (req, res) => {
  const user_id = req.user_id;
  const { label_id, collection_id } = req.params;
  const { status, data, error } = await wordService.getByLabelId({
    user_id,
    collection_id,
    label_id,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};


// Controller to get all unmemorized words
const getUnmemorized = async (req, res) => {
  const user_id = req.user_id;
  const { collection_id } = req.params;
  const { status, data, error } = await wordService.getUnmemorized({ user_id, collection_id });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

// Controller to get paginated words by searching prefix within a collection
const searchByPrefix = async (req, res) => {
  const user_id = req.user_id;
  const { collection_id } = req.params;
  const { prefix } = req.query;
  const { status, data, error } = await wordService.searchByPrefix({
    user_id,
    collection_id,
    prefix,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

// Controller to toggle the is_memorized status of a word
const changeIsMemorizedStatus = async (req, res) => {
  const user_id = req.user_id;
  const { collection_id, word_id } = req.params;
  const { is_memorized } = req.body;
  const { status, data, error } = await wordService.changeIsMemorizedStatus({
    user_id,
    collection_id,
    word_id,
    is_memorized,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};


const textToSpeech = async (req, res) => {
  const { word_id } = req.params;
  const { status, data, error } = await wordService.textToSpeech({
    user_id: req.user_id,
    word_id,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};


module.exports = {
  create,
  remove,
  update,
  getByLabelId,
  searchByPrefix,
  getUnmemorized,
  changeIsMemorizedStatus,
  textToSpeech
};
