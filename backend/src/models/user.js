const db = require('../config/db');

const createTable = async () => {
  try {
    const result = await db.query(`
      CREATE EXTENSION IF NOT EXISTS "uuid-ossp";
      CREATE TABLE IF NOT EXISTS users (
        id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
        username VARCHAR(50) NOT NULL,
        email VARCHAR(60) NOT NULL UNIQUE,
        password VARCHAR(255) NOT NULL
      );
    `);
    console.log('Users table created successfully');
    return result;
  } catch (error) {
    console.error('Error creating users table:', error);
    throw error;
  }
};

const getAll = async () => {
  const result = await db.query('SELECT * FROM users');
  return result.rows;
};

const getById = async (id) => {
  const result = await db.query('SELECT * FROM users WHERE id = $1', [id]);
  return result.rows[0];
};

const getByEmail = async (email) => {
  const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
  return result.rows[0];
};

const create = async (username, email, hashedPassword) => {
  const result = await db.query(
    'INSERT INTO users (username, email, password) VALUES ($1, $2, $3) RETURNING *',
    [username, email, hashedPassword]
  );
  return result.rows[0];
};

const update = async (id, username, email, hashedPassword) => {
  const result = await db.query(
    'UPDATE users SET username = $1, email = $2, password = $3 WHERE id = $4 RETURNING *',
    [username, email, hashedPassword, id]
  );
  return result.rows[0];
};

const remove = async (id) => {
  await db.query('DELETE FROM users WHERE id = $1', [id]);
};




module.exports = { createTable, getAll,getById, getByEmail, create, update, remove };
