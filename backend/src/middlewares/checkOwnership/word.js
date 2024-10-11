const wordModel = require('../../models/word'); // Import the Word model

// Middleware to check ownership of a word
const checkWordOwnership = async (req, res, next) => {
  try {
    const {word_id} = req.params;
    const user_id = req.user.id;

    if (isNaN(word_id) || parseInt(word_id) != word_id) {
      return res.status(400).json({ message: 'Invalid word ID' });
    }

    // Fetch the word from the database
    const word = await wordModel.getById(word_id);

    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    // Ensure that the user owns the word
    if (word.user_id !== user_id) {
      return res.status(403).json({ message: 'Forbidden' });
    }

    // If ownership check passes, proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Error checking word ownership:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {checkWordOwnership};
