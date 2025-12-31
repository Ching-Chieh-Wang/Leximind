const wordLabelService = require('../services/wordLabelService');

// Add a word to a label with handling for collection mismatch and duplicate association
const addWordToLabel = async (req, res) => {
  const user_id = req.user_id;
  const { label_id, word_id, collection_id } = req.params;
  const { status, data, error } = await wordLabelService.addWordToLabel({
    user_id,
    label_id,
    word_id,
    collection_id,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

// Remove a word from a label with existence checks
const removeWordFromLabel = async (req, res) => {
  const user_id = req.user_id;
  const { label_id, word_id, collection_id } = req.params;
  const { status, data, error } = await wordLabelService.removeWordFromLabel({
    user_id,
    label_id,
    word_id,
    collection_id,
  });
  if (error) {
    return res.status(status).json(error);
  }
  return res.status(status).json(data);
};

module.exports = {
  addWordToLabel,
  removeWordFromLabel,
};
