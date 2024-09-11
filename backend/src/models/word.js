const db = require('../config/db');  // Import the database connection
const wordLabelModel = require('./word_label');  // Import the WordLabel model

// Function to create the words table
const createTable = async () => {
  try {
    const result = await db.query(`
      CREATE TABLE IF NOT EXISTS words (
        id SERIAL PRIMARY KEY,
        user_id UUID REFERENCES users(id) ON DELETE CASCADE,
        title VARCHAR(50) NOT NULL,
        definition TEXT NOT NULL,
        img_path TEXT,
        created_at TIMESTAMPTZ DEFAULT NOW()
      );
    `);
    console.log('Words table created successfully');
    return result;
  } catch (error) {
    console.error('Error creating words table:', error);
    throw error;
  }
};

// Function to create a new word
const create = async ({ title, definition,  img_path,  user_id, labelIds }) => {
  try {
    // Insert the new word into the words table
    const result = await db.query(
      `INSERT INTO words (title, definition, img_path, user_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, definition, img_path, user_id]
    );

    const newWord = result.rows[0];

    // Associate the word with the provided labels
    if (labelIds && labelIds.length > 0) {
      await Promise.all(labelIds.map(labelId => wordLabelModel.addWordToLabel(labelId, newWord.id)));
    }

    return newWord;
  } catch (err) {
    console.error('Error creating word:', err);
    throw err;
  }
};

// Function to find a word by ID, including its associated labels
const getById = async (word_id) => {
  try {
    // Fetch the word from the words table
    const wordResult = await db.query('SELECT * FROM words WHERE id = $1', [word_id]);
    const word = wordResult.rows[0];

    if (!word) return null;

    // Fetch the associated labels using WordLabel model
    word.labels = await wordLabelModel.getLabelsByWordId(word_id);

    return word;
  } catch (err) {
    console.error('Error fetching word by ID:', err);
    throw err;
  }
};

// Function to update a word by ID, including label associations
const update = async (wordId, { title, description, labelIds }) => {
  try {
    // Update the word in the words table
    await db.query(
      `UPDATE words SET title = $1, definition = $2 WHERE id = $3`,
      [title, description, wordId]
    );

    // Update label associations
    if (labelIds && labelIds.length > 0) {
      // Remove existing label associations
      await wordLabelModel.removeLabelsFromWord(wordId);

      // Add new label associations
      await Promise.all(labelIds.map(labelId => wordLabelModel.addWordToLabel(labelId, wordId)));
    }

    // Return the updated word with labels
    return getByIdWithLabels(wordId);
  } catch (err) {
    console.error('Error updating word:', err);
    throw err;
  }
};

// Function to remove a word by ID, including label associations
const remove = async (wordId) => {
  try {
    // Remove label associations
    await wordLabelModel.removeWordFromLabel(wordId);

    // Delete the word from the words table
    await db.query('DELETE FROM words WHERE id = $1', [wordId]);
  } catch (err) {
    console.error('Error removing word:', err);
    throw err;
  }
};

// Function to get all words for a specific user, including associated labels
const getAllByUserId = async (userId) => {
  try {
    // Fetch all words for the user
    const wordsResult = await db.query('SELECT * FROM words WHERE user_id = $1', [userId]);
    const words = wordsResult.rows;

    // Fetch associated labels for each word
    for (let word of words) {
      word.labels = await wordLabelModel.getLabelsByWordId(word.id);
    }

    return words;
  } catch (err) {
    console.error('Error fetching words by user ID:', err);
    throw err;
  }
};

const getByTitleAndUserId = async (title, userId) => {
  try {
    // Query the words table where both title and user_id match the provided values
    const result = await db.query(
      'SELECT * FROM words WHERE title = $1 AND user_id = $2',
      [title, userId]
    );

    // If no word is found, return null
    if (result.rows.length === 0) {
      return null;
    }

    // Return the found word
    return result.rows[0];
  } catch (err) {
    console.error('Error fetching word by title and user ID:', err);
    throw err;
  }
};



module.exports = {
  createTable,
  create,
  getById,
  update,
  remove,
  getAllByUserId,
  getByTitleAndUserId
};
