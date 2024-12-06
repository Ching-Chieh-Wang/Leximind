// models/collection.js
const db = require('../db/db');

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
  return result.rows[0]||null;
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
      COALESCE(collection_word_stats.not_memorized_cnt, 0) AS not_memorized_cnt
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
      AND collections.name ILIKE $1
    ORDER BY 
      collections.view_cnt DESC
    LIMIT $2 OFFSET $3;
  `;
  const result = await db.query(sqlQuery, [formattedQuery, limit, offset]);
  return result.rows;
};



module.exports = {
  createTable,
  create,
  update,
  remove,
  getPaginatedByUserIdSortedByLastViewedAt,
  searchPublicCollections,
};