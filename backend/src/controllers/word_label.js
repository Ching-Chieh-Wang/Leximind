const cacheService = require('../services/cacheService');
const wordLabelModel = require('../models/word_label');

const removeCollectionCache = async (user_id, collection_id) => {
  const collcionCacheKey = `userId:${user_id}:collection:private:${collection_id}`;
  await cacheService.removeCache(collcionCacheKey);
};

// Add a word to a label with handling for collection mismatch and duplicate association
const addWordToLabel = async (req, res) => {
  try {
    const user_id=req.user_id;
    const {label_id, word_id, collection_id} = req.params;

    // Attempt to add the word to the label
    const addCuccess = await wordLabelModel.addWordToLabel(user_id, label_id, word_id,collection_id);
    if(!addCuccess){
      // If no result is returned, respond with a 404 indicating the label or word was not found
      return res.status(404).json({ message: 'Label or word not found' });
    }
    removeCollectionCache(user_id, collection_id);
    return res.status(200).json({});
  } catch (err) {
    if (err.code === '23505') {
      // Unique constraint violation for duplicate association
      return res.status(409).json({ message: 'This word is already associated with the label' });
    }
    if (err.code === '23502') {
      // User not authorized to operato other's words and labels
      return res.status(401).json({ message: 'User or collection not found' });
    }
    if (err.code === '23503') {
      // User not authorized to operato other's words and labels
      return res.status(401).json({ message: 'Label or word not found' });
    }
    if (err.code === '23514') {
      // Collection mismatch violation
      return res.status(400).json({ message: 'Word and label must belong to the same collection' });
    }
    console.error('Error adding word to label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove a word from a label with existence checks
const removeWordFromLabel = async (req, res) => {
  try {
    const user_id=req.user_id;
    const {label_id, word_id, collection_id} = req.params;

    // Attempt to remove the word from the label
    const removeSuccess = await wordLabelModel.removeWordFromLabel(user_id, label_id, word_id, collection_id);

    if (!removeSuccess) {
      return res.status(404).json({ message: 'User, word, label ,collection or Word-label association not found' });
    }
    removeCollectionCache(user_id, collection_id);
    return res.status(200).json({});
  } catch (err) {
    console.error('Error removing word from label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  addWordToLabel,
  removeWordFromLabel,
};