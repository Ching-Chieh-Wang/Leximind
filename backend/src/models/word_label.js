const db = require('../db/db');

// Create the word_labels table to store relationships between words and labels
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS word_labels (
      word_id INT NOT NULL,
      label_id INT NOT NULL,
      collection_id INT NOT NULL,
      PRIMARY KEY (word_id, label_id),
      FOREIGN KEY (word_id, collection_id) REFERENCES words(id, collection_id) ON DELETE CASCADE,
      FOREIGN KEY (label_id, collection_id) REFERENCES labels(id, collection_id) ON DELETE CASCADE
    );
  `;
  await db.query(query);
  console.log('word_labels table created successfully');
};

// Add a word to a label
const addWordToLabel = async (user_id, label_id, word_id, collection_id) => {
  const query = `
    INSERT INTO word_labels (label_id, word_id, collection_id)
    VALUES (
      $2, 
      $3, 
      (SELECT id FROM collections WHERE id = $4 AND user_id = $1)
    )
    RETURNING label_id;
  `;

  const result = await db.query(query, [user_id, label_id, word_id, collection_id]);

  // Check if the result is empty
  return result.rowCount !== 0
};

// Remove a word from a label
const removeWordFromLabel = async (user_id, label_id, word_id, collection_id) => {
  const query = `
    DELETE FROM word_labels
    WHERE label_id = $2 AND word_id = $3 AND collection_id = (
      SELECT id FROM collections WHERE id = $4 AND user_id = $1
    )
    RETURNING label_id;
  `;

  const result = await db.query(query, [user_id, label_id, word_id, collection_id]);

  // Check if the result is empty
  return result.rowCount !== 0
};


module.exports = {
  createTable,
  addWordToLabel,
  removeWordFromLabel,
};