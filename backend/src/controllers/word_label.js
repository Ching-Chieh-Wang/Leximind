const wordLabelModel = require('../models/word_label');
const db = require('../db/db'); // Assuming you use the shared db connection

// Get all words associated with a specific label
const getWordsByLabel = async (req, res) => {
  try {
    const label_id = req.label.id;
    const words = await wordLabelModel.getWordsByLabelId(label_id);
    res.status(200).json({ words });
  } catch (err) {
    console.error('Error fetching words by label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a word to a label (Combining label and word existence check)
const addWordToLabel = async (req, res) => {
  try {
    const label_id=req.label.id;
    const word_id=req.label.id;

    // Check if the association already exists
    const existingAssociation = await wordLabelModel.isAssociationExists(label_id, word_id);
    if (existingAssociation) {
      return res.status(409).json({ message: 'This word is already associated with the label' });
    }

    // Add the word to the label if the association does not exist
    const association = await wordLabelModel.addWordToLabel(label_id, word_id);
    res.status(201).json({ message: 'Word added to label successfully', association });
  } catch (err) {
    console.error('Error adding word to label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove a word from a label (Combining label and word existence check)
const removeWordFromLabel = async (req, res) => {
  try {
    const label_id=req.label.id;
    const word_id=req.label.id;
    await wordLabelModel.removeWordFromLabel(label_id, word_id);
    res.status(200).json({ message: 'Word removed from label successfully' });
  } catch (err) {
    console.error('Error removing word from label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getWordsByLabel,
  addWordToLabel,
  removeWordFromLabel,
};