const wordModel = require('../models/word');  // Import the Word model
const labelModel = require('../models/label')

// Function to create a new word
const create = async (req, res) => {
  try {
    const { title, definition, img_path, label_ids } = req.body;
    const user_id = req.user.id; // Extract user ID from the authenticated user

    // Check if a word with the same title already exists for this user
    const existingWord = await wordModel.getByTitleAndUserId(title, user_id);

    if (existingWord) {
      return res.status(400).json({ message: 'A word with this title already exists' });
    }

    // Check if the label IDs belong to the user
    for (const label_id of label_ids) {
      const label = await labelModel.getById(label_id);
      
      if (!label) {
        return res.status(404).json({ message: `Label with ID ${label_id} not found` });
      }

      // Ensure the label belongs to the current user
      if (label.user_id.toString() !== user_id.toString()) {
        return res.status(403).json({ message: 'One or more labels do not belong to the user' });
      }
    }

    // Create the new word in the database, including label associations
    const newWord = await wordModel.create({ title, definition, img_path, user_id, label_ids });

    // Send a success response with the created word
    res.status(201).json({ message: 'Word created successfully', word: newWord });
  } catch (err) {
    console.error('Error creating word:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get all words for a specific user
const getAllByUserId = async (req, res) => {
  try {
    const user_id = req.user.id;

    // Fetch all words for the user, including associated labels
    const words = await wordModel.getAllByUserId(user_id);

    res.status(200).json({ words });
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
      const wordWithNewTitle = await wordModel.getByTitleAndUserId(title, user_id);

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

// Function to search words by prefix in title and description
const searchByPrefix = async (req, res) => {
  const { prefix } = req.query; // Get the search prefix from query parameters

  if (!prefix) {
    return res.status(400).json({ message: 'Search prefix is required.' });
  }

  try {
    // Fetch words matching the prefix in either title or description
    const words = await wordModel.searchByPrefix(prefix);
    res.status(200).json({ words });
  } catch (err) {
    console.error('Error searching words:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  create,
  update,
  getAllByUserId,
  remove,
  searchByPrefix
};