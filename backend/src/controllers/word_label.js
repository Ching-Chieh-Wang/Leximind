const wordLabelModel = require('../models/word_label');

// Get all words associated with a specific label
const getPaginatedWordsByLabelId = async (req, res) => {
  try {
    const label_id = req.label.id;
    const offset = parseInt(req.query.offset, 10) || 0;
    const limit = parseInt(req.query.limit, 10) || 50;
    const words = await wordLabelModel.getPaginatedWordsByLabelId(label_id,offset,limit);
    res.status(200).json({ words ,offset, limit});
  } catch (err) {
    console.error('Error fetching words by label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Add a word to a label (Handling duplicate association via unique constraint)
const addWordToLabel = async (req, res) => {
  try {
    const label_id = req.label.id;
    const word_id = req.word.id;

    // Add the word to the label
    const association = await wordLabelModel.addWordToLabel(label_id, word_id);
    if(!association){
      return res.status(404).json({ message: 'Word-label association not found' });
    }

    res.status(201).json({ message: 'Word added to label successfully', association });
  } catch (err) {
    // Check for unique constraint violation (PostgreSQL error code '23505')
    if (err.code === '23505') {
      return res.status(409).json({ message: 'This word is already associated with the label' });
    }
    console.error('Error adding word to label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Remove a word from a label (Combining label and word existence check)
const removeWordFromLabel = async (req, res) => {
  try {
    const label_id=req.label.id;
    const word_id=req.word.id;
    const association = await wordLabelModel.removeWordFromLabel(label_id, word_id);
    if(!association){
      return res.status(404).json({ message: 'Word-label association not found' });
    }
    res.status(200).json({ message: 'Word removed from label successfully' });
  } catch (err) {
    console.error('Error removing word from label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  getPaginatedWordsByLabelId,
  addWordToLabel,
  removeWordFromLabel,
};