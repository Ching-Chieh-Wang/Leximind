const wordModel = require('../models/word');  // Import the Word model

// Function to create a new word
const create = async (req, res) => {
  try {
    const { title, definition, img_path, label_ids } = req.body;
    const user_id = req.user.id;

    // Check if a word with the same title already exists
    const word = await wordModel.getByTitleAndUserId(title,user_id);

    if (word) {
      return res.status(400).json({ message: 'A word with this title already exists' });
    }

    // Create the new word in the database, including label associations
    const newWord = await wordModel.create({ title, definition, img_path, user_id, label_ids });

    res.status(201).json({ message: 'Word created successfully', word: newWord });
  } catch (err) {
    console.error('Error creating word:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get all words for a specific user
const getByUserId = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Fetch all words for the user, including associated labels
    const words = await wordModel.getAllByUserId(user_id);

    res. status(200).json({ words });
  } catch (err) {
    console.error('Error fetching user words:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to update a specific word by ID
const update = async (req, res) => {
  try {
    const user_id = req.user.id;
    const word_id = req.params.id;
    const { title, description, label_ids } = req.body;

    // Check if the new title already exists (excluding the current word)
    if (title) {
      const wordWithNewTitle = await wordModel.findByTitleAndUserId(title,user_id);

      if (wordWithNewTitle && wordWithNewTitle.id !== word_id) {
        return res.status(400).json({ message: 'A word with this title already exists' });
      }
    }

    // Update the word in the database
    await wordModel.update(word_id, { title, description, label_ids });

    res.status(200).json({ message: 'Word updated successfully' });
  } catch (err) {
    console.error('Error updating word:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to delete a specific word by ID
const remove = async (req, res) => {
  try {
    const word_id = req.params.id;

    // Remove the word from the database
    await wordModel.remove(word_id);

    res.status(200).json({ message: 'Word deleted successfully' });
  } catch (err) {
    console.error('Error deleting word:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  create,
  update,
  getByUserId,
  remove,
};