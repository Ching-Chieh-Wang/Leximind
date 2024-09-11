const WordLabel = require('../models/word_label');
const Word = require('../models/word');
const Label = require('../models/label');

// Get all words associated with a specific label
const getWordsByLabel = async (req, res) => {
  try {
    const label_id = req.params.labelId;
    const words = await WordLabel.getWordsByLabelId(label_id);

    if (!words.length) {
      return res.status(404).json({ message: 'No words found for this label' });
    }

    res.status(200).json({ words });
  } catch (err) {
    console.error('Error fetching words by label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a word to a label
const addWordToLabel = async (req, res) => {
  try {
    const { labelId, word_id } = req.params;

    const label = await Label.findLabelById(labelId);
    if (!label) {
      return res.status(404).json({ message: 'Label not found' });
    }

    const word = await Word.findById(word_id);
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    const association = await WordLabel.addWordToLabel(labelId, word_id);
    res.status(201).json({ message: 'Word added to label successfully', association });
  } catch (err) {
    console.error('Error adding word to label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove a word from a label
const removeWordFromLabel = async (req, res) => {
  try {
    const { label_id, word_id } = req.params;

    const label = await Label.findLabelById(label_id);
    if (!label) {
      return res.status(404).json({ message: 'Label not found' });
    }

    const word = await Word.findById(word_id);
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }

    await WordLabel.removeWordFromLabel(label_id, word_id);
    res.status(200).json({ message: 'Word removed from label successfully' });
  } catch (err) {
    console.error('Error removing word from label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getWordsByLabel,
  addWordToLabel,
  removeWordFromLabel
};

