const WordModel = require('../../models/word');

const checkValidWordId = async (req, res, next) => {
  const { word_id } = req.params;

  // Check if word_id is a valid number, an integer, and a positive number
  if (isNaN(word_id) || !Number.isInteger(Number(word_id)) || Number(word_id) <= 0) {
    return res.status(400).json({ message: 'Invalid word ID. It must be a positive integer.' });
  }

  // Ensure the word_id is within the SERIAL range
  const MAX_ID_VALUE = 2147483647; // SERIAL max value in PostgreSQL
  if (Number(word_id) > MAX_ID_VALUE) {
    return res.status(400).json({ message: 'Invalid word ID. Exceeds maximum allowed value for SERIAL.' });
  }

  try {
    const word = await WordModel.getById(word_id);
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    // Word exists, proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Error checking word existence:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {checkValidWordId} ;