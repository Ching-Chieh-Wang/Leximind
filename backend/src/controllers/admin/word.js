const wordModel = require('../../models/word');

// Create a new word
const createWord = async (req, res) => {
  const { title, description, imgPath, user_id, label_ids } = req.body;
  try {
    const newWord = await wordModel.create({ title, description, imgPath, user_id, label_ids });
    res.status(201).json(newWord);
  } catch (error) {
    console.error('Error creating word:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get a word by ID
const getWordById = async (req, res) => {
  const word_id = req.params.id;
  try {
    const word = await wordModel.getById(word_id);
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }
    res.status(200).json(word);
  } catch (error) {
    console.error('Error fetching word by ID:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a word by ID
const updateWord = async (req, res) => {
  const word_id = req.params.id;
  const { title, description, label_ids } = req.body;
  try {
    const updatedWord = await wordModel.update(word_id, { title, description, label_ids });
    if (!updatedWord) {
      return res.status(404).json({ message: 'Word not found' });
    }
    res.status(200).json(updatedWord);
  } catch (error) {
    console.error('Error updating word:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a word by ID
const deleteWord = async (req, res) => {
  const word_id = req.params.id;
  try {
    await wordModel.remove(word_id);
    res.status(200).json({ message: 'Word deleted successfully' });
  } catch (error) {
    console.error('Error deleting word:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all words with pagination
const getAllWords = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  try {
    const words = await wordModel.getPaginatedWords(limit, (page - 1) * limit);
    res.status(200).json(words);
  } catch (error) {
    console.error('Error fetching words:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  createWord,
  getWordById,
  updateWord,
  deleteWord,
  getAllWords,
};
