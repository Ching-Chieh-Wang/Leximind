const wordLabelController = require('../word_label'); // Reuse functions from the existing word_label controller

// Admin: Get all words associated with a specific label
const getWordsByLabelId = async (req, res) => {
  return wordLabelController.getWordsByLabel(req, res); // Reuse the getWordsByLabel function from word_label controller
};

// Admin: Add a word to a label
const addWordToLabel = async (req, res) => {
  return wordLabelController.addWordToLabel(req, res); // Reuse the addWordToLabel function from word_label controller
};

// Admin: Remove a word from a label
const removeWordFromLabel = async (req, res) => {
  return wordLabelController.removeWordFromLabel(req, res); // Reuse the removeWordFromLabel function from word_label controller
};

module.exports = {
  addWordToLabel,
  removeWordFromLabel,
  getWordsByLabelId,
};