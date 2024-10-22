const wordModel = require('../../models/word');

// Middleware to check ownership of a word
const checkWordOwnership = async (req, res, next) => {
  try {
    const { word_id } = req.params;
    const user_id = req.user.id;
    const collection_id = req.collection.id; 

    // Check if collection_id is provided
    if (!word_id) {
      return res.status(400).json({ message: 'Word ID is required' });
    }

    // Validate the word_id to ensure it's a positive integer
    if (isNaN(word_id) || parseInt(word_id) !== Number(word_id)) {
      return res.status(400).json({ message: 'Invalid word ID' });
    }

    // Fetch the word from the database
    const word = await wordModel.getById(word_id);

    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    // Ensure that the user owns the word
    if (word.user_id !== user_id) {
      return res.status(403).json({ message: 'You do not have permission to access this word.' });
    }

    // Ensure that the word belongs to the specified collection
    if (word.collection_id !== collection_id) {
      return res.status(403).json({ message: 'Word does not belong to this collection.' });
    }

    // Attach the word object to the request for further use in the next handler
    req.word = word;

    // If all checks pass, proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Error checking word ownership:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { checkWordOwnership };