const wordModel = require('../models/word');

// Function to create a new word
const create = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { collection_id } = req.params;
    const { name, description, img_path, label_ids } = req.body;

    // Create the new word
    const result = await wordModel.create({ user_id,collection_id, name, description, img_path, label_ids });
    if (!result) {
      return res.status(404).json({ message: 'User or Collection not found' });
    }

    res.status(201).json({
      message: 'Word created successfully',
      word_id: result.id,
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
    const updateSuccess = await wordModel.update(user_id, collection_id, word_id, name, description, img_path);
    if (!updateSuccess) {
      return res.status(404).json({ message: 'Word not found or unauthorized' });
    }
    res.status(200).json({ message: 'Word updated successfully'});
  } catch (err) {
    console.error('Error updating word:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to get paginated words by label ID
const getByLabelId = async (req, res) => {
  try {
    const user_id=req.user_id;
    const { label_id,collection_id } = req.params;
    const data = await wordModel.getByLabelId(user_id,collection_id, label_id,);
    res.status(200).json(data);
  } catch (err) {
    console.error('Error fetching words by label ID:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


// Controller to get all unmemorized words
const getUnmemorized = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { collection_id } = req.params;

    const data = await wordModel.getUnmemorized(user_id,collection_id);

    res.status(200).json({word_ids:data.word_ids});
  } catch (err) {
    console.error('Error updating memorization status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to get paginated words by searching prefix within a collection
const searchByPrefix = async (req, res) => {
  try {
    const user_id=req.user_id;
    const { collection_id } = req.params;
    const { prefix } = req.query;

    if (!prefix) {
      return res.status(400).json({ message: 'prefix parameter is required' });
    }

    const data = await wordModel.searchByPrefix(user_id, collection_id, prefix);
    res.status(200).json(data);
  } catch (err) {
    console.error('Error searching words by prefix :', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller to toggle the is_memorized status of a word
const changeIsMemorizedStatus = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { collection_id, word_id } = req.params;
    const {is_memorized}=req.body;

    const changeSuccess = await wordModel.changeIsMemorizedStatus(user_id,collection_id, word_id,is_memorized);
    if (!changeSuccess) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.status(200).json({message: 'Word memorization status updated successfully'});
  } catch (err) {
    console.error('Error updating memorization status:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  create,
  remove,
  update,
  getByLabelId,
  searchByPrefix,
  getUnmemorized,
  changeIsMemorizedStatus
};