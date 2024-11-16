const wordModel = require('../models/word');
const wordLabelModel = require('../models/word_label');
const collectionModel = require('../models/collection');

// Function to create a new word
const create = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { collection_id } = req.params;
    const { name, description, img_path, label_ids } = req.body;

    // Create the new word
    const word_id = await wordModel.create({ user_id,collection_id, name, description, img_path, label_ids });
    if (!word_id) {
      return res.status(404).json({ message: 'User or Collection not found' });
    }

    res.status(201).json({
      message: 'Word created successfully',
      word_id: word_id,
    });
  } catch (err) {
    if (err.code === '23502') { // Foreign key violation
      return res.status(400).json({ message: 'Invalid collection or label ID provided' });
    }
    console.error('Error creating word:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to remove a word
const remove = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { word_id, collection_id } = req.params;

    // Remove the word
    const result = await wordModel.remove(user_id,collection_id, word_id);
    if (!result) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.status(200).json({ message: 'Word deleted successfully' });
  } catch (err) {
    console.error('Error deleting word:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to update a word
const update = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { word_id, collection_id } = req.params;
    const { name, description, img_path } = req.body;

    // Update the word details
    const updated_word_id = await wordModel.update(user_id, collection_id, word_id, name, description, img_path);
    if (updated_word_id!=word_id) {
      return res.status(404).json({ message: 'Word not found or unauthorized' });
    }
    res.status(200).json({ message: 'Word updated successfully', word_id: updated_word_id });
  } catch (err) {
    console.error('Error updating word:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get paginated words
const getPaginated = async (req, res) => {
  try {
    const user_id=req.user_id;
    const { collection_id } = req.params;
    const offset=req.offset;
    const limit=req.limit;

    // Fetch the paginated words
    const words = await wordModel.getPaginated(user_id, collection_id,limit, offset );
    res.status(200).json({ words });
  } catch (err) {
    console.error('Error fetching paginated words:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to get paginated words by label ID
const getPaginatedByLabelId = async (req, res) => {
  try {
    const user_id=req.user_id;
    const { label_id,collection_id } = req.params;
    const { limit, offset } = req;
    const words = await wordModel.getPaginatedByLabelId(user_id,collection_id, label_id, limit, offset);
    res.status(200).json({ words });
  } catch (err) {
    console.error('Error fetching paginated words by label ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to get paginated words by searching prefix within a collection
const getPaginatedBySearchingPrefix = async (req, res) => {
  try {
    const user_id=req.user_id;
    const { collection_id } = req.params;
    const { prefix } = req.query;
    const { limit, offset } = req;

    if (!prefix) {
      return res.status(400).json({ message: 'prefix parameter is required' });
    }

    const words = await wordModel.getPaginatedBySearchingPrefix(user_id, collection_id, prefix, limit, offset);
    res.status(200).json({ words });
  } catch (err) {
    console.error('Error fetching paginated search results:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to toggle the is_memorized status of a word
const changeIsMemorizedStatus = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { collection_id, word_id } = req.params;

    const is_memorized = await wordModel.changeIsMemorizedStatus(user_id,collection_id, word_id);
    if (is_memorized === null) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.status(200).json({
      message: 'Word memorization status updated successfully',
      is_memorized
    });
  } catch (err) {
    console.error('Error updating memorization status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  create,
  remove,
  update,
  getPaginated,
  getPaginatedByLabelId,
  getPaginatedBySearchingPrefix,
  changeIsMemorizedStatus
};