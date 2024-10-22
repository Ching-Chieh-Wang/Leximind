const db = require('../db/db');

// Create the word_labels table to store relationships between words and labels
const createTable = async () => {
  const result = await db.query(`
    CREATE TABLE IF NOT EXISTS word_labels (
      word_id INT REFERENCES words(id) ON DELETE CASCADE NOT NULL,
      label_id INT REFERENCES labels(id) ON DELETE CASCADE NOT NULL,
      UNIQUE(word_id, label_id)
    );
  `);
  console.log('word_labels table created successfully');
  return result;
};


// Add a word to a label
const addWordToLabel = async (label_id, word_id) => {
  const result = await db.query(
    'INSERT INTO word_labels (label_id, word_id) VALUES ($1, $2) RETURNING *;',
    [label_id, word_id]
  );
  return result.rows[0];
};

// Remove a word from a label
const removeWordFromLabel = async (label_id, word_id) => {
  const result= await db.query(
    'DELETE FROM word_labels WHERE label_id = $1 AND word_id = $2;',
    [label_id, word_id]
  );
  return result.rows[0];
};

// Function to get paginated words by collection ID and label ID
const getPaginatedWordsByLabelId = async (collection_id, label_id, offset = 0, limit = 50) => {
  const result = await db.query(
    `SELECT words.*,
      COALESCE(
        json_agg(
          DISTINCT jsonb_build_object(
            'id', labels.id,
            'name', labels.name
          )
        ) FILTER (WHERE labels.id IS NOT NULL), '[]'
      ) AS labels
      FROM words
      JOIN word_labels ON words.id = word_labels.word_id
      LEFT JOIN labels ON word_labels.label_id = labels.id
      WHERE words.collection_id = $1 AND word_labels.label_id = $2
      GROUP BY words.id
      ORDER BY words.created_at
      LIMIT $3 OFFSET $4;`,
    [collection_id, label_id, limit, offset]
  );
  return result.rows;
};


module.exports = {
  createTable,
  addWordToLabel,
  removeWordFromLabel,
  getPaginatedWordsByLabelId
};
