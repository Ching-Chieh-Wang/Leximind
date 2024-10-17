const wordModel = require('../models/word');

// Function to create a new word
const create = async (req, res) => {
  try {
    const { name, description, img_path, label_ids } = req.body;
    const user_id = req.user.id;
    const collection_id = req.collection.id;

    const newWord = await wordModel.create({
      name,
      description,
      img_path,
      user_id,
      collection_id,
      label_ids,
    });

    res.status(201).json({ message: 'Word created successfully', word: newWord });
  } catch (err) {
    if (err.message.startsWith('Labels not owned by the user or not in the collection:')) {
      return res.status(400).json({ message: err.message });
    }
    console.error('Error creating word:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get a specific word by ID
const getById = async (req, res) => {
  try {
    const word_id = req.params.word_id;
    const word = await wordModel.getById(word_id);

    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    res.status(200).json({ word });
  } catch (err) {
    console.error('Error fetching word:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller function to get paginated words by collection ID
const getPaginated = async (req, res) => {
  try {
    const { collection_id } = req.params;
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 50;

    // Fetch the paginated words
    const words = await wordModel.getPaginated(collection_id, offset, limit);

    res.status(200).json({ words, offset, limit });
  } catch (error) {
    console.error('Error fetching paginated words:', error);
    res.status(500).json({ message: 'Server error' });
  }
};


// Function to update a word by ID
const update = async (req, res) => {
  try {
    const word = req.word;
    const { name, description, img_path, order_index } = req.body;
    const collection_id = word.collection_id;


    // Update the word
    const updatedWord = await wordModel.update(word.id, {
      name,
      description,
      img_path,
      order_index,
    });

    res.status(200).json({ message: 'Word updated successfully', word: updatedWord });
  } catch (err) {
    console.error('Error updating word:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to delete a word by ID
const remove = async (req, res) => {
  try {
    const word = req.word;

    // Remove the word
    await wordModel.remove(word.id);

    res.status(200).json({ message: 'Word deleted successfully' });
  } catch (err) {
    console.error('Error deleting word:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to search words by prefix in a specific collection
const searchByPrefix = async (req, res) => {
  try {
    const  collection_id  = req.collection.id; // Extract collection ID from request parameters
    const { prefix } = req.query; // Extract the search prefix from query parameters

    if (!prefix) {
      return res.status(400).json({ message: 'Search prefix is required.' });
    }

    // Call the model function to search for words with the specified prefix
    const words = await wordModel.searchByPrefix(collection_id, prefix);

    res.status(200).json({ words });
  } catch (err) {
    console.error('Error searching words by prefix:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Controller function to get paginated words by collection ID and label ID
const getPaginatedByLabelId = async (req, res) => {
  try {
    const { collection_id, label_id } = req.params;
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 50;

    // Fetch the paginated words associated with the label
    const words = await wordModel.getPaginatedByLabelId(collection_id, label_id, offset, limit);

    res.status(200).json({ words, offset, limit });
  } catch (error) {
    console.error('Error fetching paginated words by label:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  create,
  getById,
  getPaginated,
  update,
  remove,
  searchByPrefix,
  getPaginatedByLabelId
};