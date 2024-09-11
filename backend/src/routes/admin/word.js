const express = require('express');
const router = express.Router();
const wordModel = require('../../models/word');

// Create a new word (for any user)
router.post('/', async (req, res) => {
  try {
    const { title,  definition, imgPath, userId, labelIds } = req.body;
    const newWord = await wordModel.create({ title, definition, imgPath, userId, labelIds });
    res.status(201).json(newWord);
  } catch (err) {
    console.error('Error creating word:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Get a word by ID
router.get('/:id', async (req, res) => {
  try {
    const word_id = req.params.id;
    const word = await wordModel.getById(word_id);
    if (!word) {
      return res.status(404).json({ message: 'Word not found' });
    }
    res.status(200).json(word);
  } catch (err) {
    console.error('Error fetching word:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Search words (by title, user, or label)
router.get('/search', async (req, res) => {
  try {
    const { title, user_id, label_id } = req.query;
    let words;

    if (title && user_id) {
      words = await wordModel.findByTitleAndUserId(title, user_id);
    } else if (label_id) {
      words = await wordModel.getWordsByLabelId(label_id);
    } else if (user_id) {
      words = await wordModel.getAllByUserId(user_id);
    }

    if (!words || words.length === 0) {
      return res.status(404).json({ message: 'No words found' });
    }

    res.status(200).json(words);
  } catch (err) {
    console.error('Error searching words:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Update a word (for any user)
router.put('/:id', async (req, res) => {
  try {
    const wordId = req.params.id;
    const { title, definition, labelIds: label_ids } = req.body;
    const updatedWord = await wordModel.update(wordId, { title, definition, label_ids });
    res.status(200).json(updatedWord);
  } catch (err) {
    console.error('Error updating word:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Delete a word (with optional bulk deletion)
router.delete('/:id', async (req, res) => {
  try {
    const word_id = req.params.id;
    await wordModel.remove(word_id);
    res.status(200).json({ message: 'Word deleted successfully' });
  } catch (err) {
    console.error('Error deleting word:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

// Bulk delete words (by userId or labelId)
router.delete('/bulk', async (req, res) => {
  try {
    const { user_id,  label_id } = req.body;

    if (user_id) {
      await wordModel.removeByUserId(user_id);
    } else if (label_id) {
      await wordModel.removeByLabelId(label_id);
    }

    res.status(200).json({ message: 'Words deleted successfully' });
  } catch (err) {
    console.error('Error deleting words:', err);
    res.status(500).json({ message: 'Server error' });
  }
});

router.get('/', async (req, res) => {
    try {
      const { page = 1, limit = 100 } = req.query; // Default to page 1 and 100 words per page
      const words = await wordModel.getPaginatedWords(page, limit);
      res.status(200).json(words);
    } catch (err) {
      console.error('Error fetching paginated words:', err);
      res.status(500).json({ message: 'Server error' });
    }
  });

module.exports = router;
