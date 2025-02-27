const { Pool } = require('pg');
require('dotenv').config(); // Load environment variables

// Create a new Pool instance
const pool = new Pool({
  user: process.env.DB_USER,
  host: process.env.DB_HOST,
  database: process.env.DB_NAME,
  password: process.env.DB_PASSWORD,
  port: process.env.DB_PORT,
  ssl: { rejectUnauthorized: false }, // Adjust SSL settings if needed
});

// Function to connect to the database and initialize tables
const connectToDatabase = async () => {
  try {
    await pool.connect(); // Ensure proper connection

    // Import models after connecting to avoid dependency issues
    const userModel = require('../models/user');
    const collectionModel = require('../models/collection');
    const labelModel = require('../models/label');
    const wordModel = require('../models/word');
    const wordLabelModel = require('../models/word_label');
    

    await userModel.createTable(),
    await collectionModel.createTable(),
    await labelModel.createTable(),
    await wordModel.createTable(),
    await wordLabelModel.createTable()
  } catch (error) {
    console.error('Error connecting to the database:', error);
    throw error;
  }
};

// Function to execute a simple query
const query = async (text, params) => {
  const res = await pool.query(text, params);
  return res;
};

// Function to start a transaction
const beginTransaction = async (client) => {
  await client.query('BEGIN');
};

// Function to commit a transaction
const commitTransaction = async (client) => {
  await client.query('COMMIT');
};

// Function to rollback a transaction
const rollbackTransaction = async (client) => {
  await client.query('ROLLBACK');
};

// Function to perform queries within a transaction
const executeTransaction = async (transactionCallback) => {
  const client = await pool.connect(); // Get a new client from the pool
  try {
    await beginTransaction(client);
    const result = await transactionCallback(client);
    await commitTransaction(client);
    return result;
  } catch (err) {
    await rollbackTransaction(client);
    throw err; // Re-throw the error after rollback so that calling code can handle it
  } finally {
    client.release(); // Release the client back to the pool
  }
};

module.exports = {
  connectToDatabase,
  query,
  beginTransaction,
  commitTransaction,
  rollbackTransaction,
  executeTransaction,
};