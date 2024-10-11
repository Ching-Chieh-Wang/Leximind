const db = require('../db/db');  // Import the database connection
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
const create = async ({ title, definition, img_path, user_id, label_ids }) => {
  try {
    // Begin a new transaction
    await db.query('BEGIN');

    // Insert the new word into the words table
    const result = await db.query(
      `INSERT INTO words (title, definition, img_path, user_id) 
       VALUES ($1, $2, $3, $4) RETURNING *`,
      [title, definition, img_path, user_id]
    );

    const newWord = result.rows[0];

    // If there are labels, associate the word with the provided labels using unnest
    if (label_ids && label_ids.length > 0) {
      const queryText = `
        INSERT INTO word_labels (word_id, label_id)
        SELECT $1, unnest($2::int[])
      `;

      // Execute bulk insert for word-label associations
      await db.query(queryText, [newWord.id, label_ids]);
    }

    // Commit the transaction
    await db.query('COMMIT');

    return newWord;
  } catch (err) {
    // Rollback the transaction in case of an error
    await db.query('ROLLBACK');
    console.error('Error creating word:', err);
    throw err;
  }
};

// Function to find a word by ID,
const getById = async (word_id) => {
  try {
    // Fetch the word from the words table
    const wordResult = await db.query('SELECT * FROM words WHERE id = $1', [word_id]);
    const word = wordResult.rows[0];

    if (!word) return null;

    return word;
  } catch (err) {
    console.error('Error fetching word by ID:', err);
    throw err;
  }
};

// Function to update a word by ID
const update = async (wordId, { title, description }) => {
  try {
    // Update the word in the words table and return the updated row
    const result = await db.query(
      `UPDATE words SET title = $1, definition = $2 WHERE id = $3 RETURNING *`,
      [title, description, wordId]
    );

    // Check if a word was updated
    if (result.rows.length === 0) {
      throw new Error('Word not found');
    }

    // Return the updated word
    return result.rows[0];
  } catch (err) {
    console.error('Error updating word:', err);
    throw err; // Rethrow the error for further handling
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

// Function to get all words and associated labels for a specific user
const getAllByUserId = async (user_id) => {
  const query = `
    SELECT w.id as word_id, w.title, w.definition, w.img_path,
           COALESCE(
             json_agg(
               json_build_object('label_id', l.id, 'label_name', l.name)
             ) FILTER (WHERE l.id IS NOT NULL), '[]') AS labels
    FROM words w
    LEFT JOIN word_labels wl ON w.id = wl.word_id
    LEFT JOIN labels l ON wl.label_id = l.id
    WHERE w.user_id = $1
    GROUP BY w.id
  `;
  try {
    const result = await db.query(query, [user_id]);
    return result.rows;
  } catch (err) {
    console.error('Error fetching words with labels:', err);
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

const getPaginated = async (page = 1, limit = 100) => {
  try {
    const offset = (page - 1) * limit;
    const result = await db.query(
      'SELECT * FROM words LIMIT $1 OFFSET $2', // Ensure LIMIT and OFFSET are used
      [limit, offset]
    );
    return result.rows;
  } catch (err) {
    console.error('Error fetching paginated words:', err);
    throw err;
  }
};

const searchByPrefix = async (prefix) => {
  const query = `
    SELECT * FROM words
    WHERE title ILIKE $1 OR definition ILIKE $1
  `;
  const values = [`${prefix}%`]; // Use ILIKE for case-insensitive matching

  try {
    const result = await db.query(query, values);
    return result.rows; // Return the matched rows
  } catch (err) {
    console.error('Error fetching words:', err);
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
  getByTitleAndUserId,
  getPaginated,
  searchByPrefix
};
