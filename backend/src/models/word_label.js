const db = require('../config/db');

// Create the word_labels table to store relationships between words and labels
const createTable = async () => {
  try {
    const result = await db.query(`
      CREATE TABLE IF NOT EXISTS word_labels (
        word_id INT REFERENCES words(id) ON DELETE CASCADE,
        label_id INT REFERENCES labels(id) ON DELETE CASCADE,
        UNIQUE(word_id, label_id)
      );
    `);
    console.log('word_labels table created successfully');
    return result;
  } catch (error) {
    console.error('Error creating word_labels table:', error);
    throw error;
  }
};

// Add a word to a label
const addWordToLabel = async (labelId, wordId) => {
  const result = await db.query(
    'INSERT INTO word_labels (label_id, word_id) VALUES ($1, $2) RETURNING *',
    [labelId, wordId]
  );
  return result.rows[0];
};

// Remove a word from a label
const removeWordFromLabel = async (labelId, wordId) => {
  await db.query('DELETE FROM word_labels WHERE label_id = $1 AND word_id = $2', [labelId, wordId]);
};

// Get all words associated with a specific label
const getWordsByLabelId = async (labelId) => {
  const result = await db.query(
    `SELECT words.* FROM words 
     JOIN word_labels ON words.id = word_labels.word_id 
     WHERE word_labels.label_id = $1`,
    [labelId]
  );
  return result.rows;
};

// Get all labels associated with a specific word
const getLabelsByWordId = async (wordId) => {
  const result = await db.query(
    `SELECT labels.* FROM labels
     JOIN word_labels ON labels.id = word_labels.label_id
     WHERE word_labels.word_id = $1`,
    [wordId]
  );
  return result.rows;
};

module.exports = {
  createTable,
  addWordToLabel,
  removeWordFromLabel,
  getWordsByLabelId,
  getLabelsByWordId
};
