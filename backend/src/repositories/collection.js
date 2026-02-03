const db = require('../config/db');

/**
 * Create the collections table
 */
const createTable = async () => {
  const query = `
    CREATE TABLE IF NOT EXISTS collections (
      id SERIAL PRIMARY KEY,
      user_id UUID REFERENCES users(id) ON DELETE CASCADE,
      name VARCHAR(100) NOT NULL,
      description TEXT,
      is_public BOOLEAN DEFAULT FALSE,
      view_cnt INT DEFAULT 0,
      save_cnt INT DEFAULT 0,    
      created_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP,
      last_viewed_at TIMESTAMPTZ DEFAULT NULL
    );
    CREATE INDEX IF NOT EXISTS idx_collections_id_user_id ON collections (id, user_id);
    CREATE INDEX IF NOT EXISTS idx_collections_user_id_last_viewed_at ON collections (user_id, last_viewed_at DESC);
  `;
  await db.query(query);
  console.log('Collections table and collection_word_stats view created successfully');
};


/**
 * Create a new collection
 */
const create = async (user_id, name, description, is_public) => {
  const query = `
    INSERT INTO collections (user_id, name, description, is_public) 
    VALUES ($1, $2, $3, $4) RETURNING id, created_at;
  `;
  const result = await db.query(query, [user_id, name, description, is_public]);
  return result.rows[0] || null;
};

/**
 * Update a collection by ID and user ID
 */
const update = async (user_id, collection_id, name, description, is_public) => {
  const query = `
    UPDATE collections 
    SET name = COALESCE($1, name), 
        description = COALESCE($2, description), 
        is_public = COALESCE($3, is_public)
    WHERE id = $4 AND user_id = $5
    RETURNING id;
  `;
  const result = await db.query(query, [name, description, is_public, collection_id, user_id]);
  return result.rows[0] || null;
};

/**
 * Delete a collection by ID and user ID
 */
const remove = async (user_id, collection_id) => {
  const query = `DELETE FROM collections WHERE id = $1 AND user_id = $2 RETURNING id;`;
  const result = await db.query(query, [collection_id, user_id]);
  return result.rowCount>0;
};

/**
 * Get a collection by ID and user ID, including words and labels
 */
const getPrivateById = async (user_id, collection_id) => {
    const query = `
      SELECT 
        c.name,
        COALESCE(cw.words, '{}'::json) AS words,
        COALESCE(cl.labels, '{}'::json) AS labels
      FROM collections c
      LEFT JOIN collection_with_words cw ON c.id = cw.collection_id
      LEFT JOIN collection_with_labels cl ON c.id = cl.collection_id
      WHERE c.id = $1 AND c.user_id = $2
      LIMIT 1;
    `;


  const result = await db.query(query, [collection_id, user_id]);
  return result.rows[0];
  
};

/**
 * Get a collection by ID and user ID, including words and labels
 */
const getPublicById = async (collection_id) => {
  const query = `
    SELECT 
      c.user_id,
      c.name,
      COALESCE(cw.words, '{}'::json) AS words,
      COALESCE(cl.labels, '{}'::json) AS labels
    FROM collections c
    LEFT JOIN collection_with_words cw ON c.id = cw.collection_id
    LEFT JOIN collection_with_labels cl ON c.id = cl.collection_id
    WHERE c.id = $1 AND c.is_public = TRUE
    LIMIT 1;
  `;


const result = await db.query(query, [collection_id]);
return result.rows[0];

};



/**
 * Get all collections for a user sorted by last viewed time, including word and memorized counts
 */
const getPaginatedByUserIdSortedByLastViewedAt = async (user_id, offset = null, limit = null) => {
  let query = `
    SELECT 
      collections.id,
      collections.name,
      collections.description,
      collections.last_viewed_at AS last_viewed_at,
      collections.is_public AS is_public,
      collections.view_cnt AS view_cnt,
      collections.save_cnt AS save_cnt,
      collections.created_at AS created_at,
      COALESCE(collection_word_stats.word_cnt, 0) AS word_cnt,
      COALESCE(collection_word_stats.word_cnt, 0) - COALESCE(collection_word_stats.not_memorized_cnt, 0) AS memorized_cnt
    FROM 
      collections
    LEFT JOIN 
      collection_word_stats ON collections.id = collection_word_stats.collection_id
    WHERE 
      collections.user_id = $1
    ORDER BY 
      collections.last_viewed_at DESC
  `;

  // Append LIMIT and OFFSET only if they are provided
  const params = [user_id];
  if (limit !== null) {
    query += ` LIMIT $2`;
    params.push(limit);
  }
  if (offset !== null) {
    query += ` OFFSET $3`;
    params.push(offset);
  }

  const result = await db.query(query, params);
  return result.rows;
};

/**
 * Search for public collections with pagination, returning specific fields along with counts
 */
const searchPublicCollections = async (searchQuery, limit, offset) => {
  const formattedQuery = `%${searchQuery}%`;
  const sqlQuery = `
    SELECT 
      collections.id,
      collections.name,
      collections.description,
      collections.view_cnt AS view_cnt,
      collections.save_cnt AS save_cnt,
      COALESCE(collection_word_stats.word_cnt, 0) AS word_cnt,
      users.id AS user_id,
      users.username AS username,
      users.image AS user_image
    FROM 
      collections
    LEFT JOIN 
      collection_word_stats ON collections.id = collection_word_stats.collection_id
    LEFT JOIN 
      users ON collections.user_id = users.id
    WHERE 
      collections.is_public = true 
      ${formattedQuery ? `AND collections.name ILIKE $1` : ''}
    ORDER BY 
      collections.view_cnt DESC
    LIMIT $2 OFFSET $3;
  `;
  const result = await db.query(sqlQuery, [formattedQuery, limit, offset]);
  return result.rows;
};

/**
 * Batch update view counts for collections using a transaction and CASE WHEN
 * @param {Array<{collectionId: number, count: number}>} updates
 */
const updateViewCountsBatch = async (updates) => {
  if (!updates || updates.length === 0) return;

  return db.executeTransaction(async (client) => {
    const cases = [];
    const ids = [];
    const values = [];

    updates.forEach(({ collectionId, count }, index) => {
      cases.push(`WHEN id = $${index * 2 + 1} THEN view_cnt + $${index * 2 + 2}`);
      ids.push(collectionId);
      values.push(collectionId, count);
    });

    const query = `
      UPDATE collections
      SET view_cnt = CASE
        ${cases.join(' ')}
        ELSE view_cnt
      END
      WHERE id IN (${ids.map((_, i) => `$${i * 2 + 1}`).join(', ')});
    `;

    await client.query(query, values);
  });
};

/**
 * Import a public collection and all its words/labels into a new private collection for a user.
 */
const importPublicCollection = async (user_id, source_collection_id) => {
  return db.executeTransaction(async (client) => {
    const insertCollectionQuery = `
      WITH source AS (
        SELECT name, description
        FROM collections
        WHERE id = $2 AND is_public = TRUE
        LIMIT 1
      ),
      inserted AS (
        INSERT INTO collections (user_id, name, description, is_public)
        SELECT $1, source.name, source.description, FALSE
        FROM source
        RETURNING id, created_at
      )
      SELECT id, created_at FROM inserted;
    `;
    const insertCollectionResult = await client.query(insertCollectionQuery, [
      user_id,
      source_collection_id,
    ]);
    const newCollection = insertCollectionResult.rows[0];
    if (!newCollection) {
      return null;
    }

    const sourceLabelsResult = await client.query(
      `SELECT id, name FROM labels WHERE collection_id = $1 ORDER BY id;`,
      [source_collection_id]
    );
    const insertedLabelsResult = await client.query(
      `
      INSERT INTO labels (name, collection_id)
      SELECT name, $2
      FROM labels
      WHERE collection_id = $1
      ORDER BY id
      RETURNING id;
      `,
      [source_collection_id, newCollection.id]
    );
    const labelIdMap = new Map();
    for (let i = 0; i < sourceLabelsResult.rows.length; i++) {
      const oldId = sourceLabelsResult.rows[i].id;
      const newId = insertedLabelsResult.rows[i]?.id;
      if (newId) {
        labelIdMap.set(oldId, newId);
      }
    }

    const sourceWordsResult = await client.query(
      `SELECT id FROM words WHERE collection_id = $1 ORDER BY id;`,
      [source_collection_id]
    );
    const insertedWordsResult = await client.query(
      `
      INSERT INTO words (collection_id, name, description, img_path, is_memorized)
      SELECT $2, name, description, img_path, FALSE
      FROM words
      WHERE collection_id = $1
      ORDER BY id
      RETURNING id;
      `,
      [source_collection_id, newCollection.id]
    );
    const wordIdMap = new Map();
    for (let i = 0; i < sourceWordsResult.rows.length; i++) {
      const oldId = sourceWordsResult.rows[i].id;
      const newId = insertedWordsResult.rows[i]?.id;
      if (newId) {
        wordIdMap.set(oldId, newId);
      }
    }

    const wordLabelsResult = await client.query(
      `SELECT word_id, label_id FROM word_labels WHERE collection_id = $1;`,
      [source_collection_id]
    );
    if (wordLabelsResult.rows.length > 0) {
      const values = [];
      const placeholders = [];
      let idx = 1;
      for (const row of wordLabelsResult.rows) {
        const newWordId = wordIdMap.get(row.word_id);
        const newLabelId = labelIdMap.get(row.label_id);
        if (!newWordId || !newLabelId) {
          continue;
        }
        placeholders.push(`($${idx}, $${idx + 1}, $${idx + 2})`);
        values.push(newWordId, newLabelId, newCollection.id);
        idx += 3;
      }
      if (placeholders.length > 0) {
        const insertWordLabelsQuery = `
          INSERT INTO word_labels (word_id, label_id, collection_id)
          VALUES ${placeholders.join(', ')};
        `;
        await client.query(insertWordLabelsQuery, values);
      }
    }

    return { id: newCollection.id, created_at: newCollection.created_at };
  });
};

module.exports = {
  createTable,
  create,
  getPrivateById,
  getPublicById,
  update,
  remove,
  getPaginatedByUserIdSortedByLastViewedAt,
  searchPublicCollections,
  updateViewCountsBatch,
  importPublicCollection
};
