const db = require('../db/db');

const createTable = async () => {
  const result = await db.query(`
    CREATE TABLE IF NOT EXISTS users (
      id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
      username VARCHAR(50) NOT NULL,
      email VARCHAR(60) NOT NULL UNIQUE,
      password VARCHAR(255),
      role VARCHAR(20),
      image TEXT DEFAULT NULL,
      login_provider VARCHAR(20),
      created_at TIMESTAMPTZ DEFAULT NOW()
    );
  `);
  console.log('Users table created successfully');
  return result;
};

// Create a new user
const create = async (username, email, login_provider, role, hashedPassword = '', image = '') => {
  const query = `
    INSERT INTO users (username, email, password, role, login_provider, image)
    VALUES ($1, $2, $3, $4, $5, $6)
    ON CONFLICT (email)
    DO UPDATE SET email = EXCLUDED.email
    RETURNING id, username, email, role, login_provider, image;
  `;

  const result = await db.query(query, [username, email, hashedPassword, role, login_provider, image]);
  return result.rows[0];
};

// Get user by email without password
const getByEmail = async (email) => {
  const result = await db.query('SELECT id, username, email, role, image, login_provider, created_at FROM users WHERE email = $1;', [email]);
  return result.rows[0]||null;
};


// Get user with password by email (for login validation)
const getUserWithPasswordByEmail = async (email) => {
  const result = await db.query('SELECT id,username,email,password, role,image,login_provider FROM users WHERE email = $1;', [email]);
  return result.rows[0];
};

// Update user's username, email, and image
const update = async (user_id, username, email, image) => {
  const query = `
      UPDATE users
      SET 
        username = $1,
        email = CASE WHEN login_provider = 'credential' THEN $2 ELSE email END,
        image = $3
      WHERE id = $4
      RETURNING id;
    `;
  const result = await db.query(query, [username, email, image, user_id]);
  return result.rows[0]||0; // Return updated data, or null if no rows updated
};

// Remove user by ID
const remove = async (id) => {
  const result = await db.query(
    'DELETE FROM users WHERE id = $1 RETURNING id;',
    [id]
  );

  return result.rowCount > 0; // Return true if deletion was successful, false otherwise
};

// Get user by ID without password
const getById = async (id) => {
  const result = await db.query('SELECT id, username, email, role, image, login_provider, created_at FROM users WHERE id = $1;', [id]);
  return result.rows[0];
};

module.exports = { createTable, create, getByEmail, getUserWithPasswordByEmail, update, remove, getById };