const wordController = require('../word'); // Reuse existing user word controller
const WordModel = require('../../models/word');

// Admin: Get all words with pagination
const getPaginated = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;

  try {
    const words = await WordModel.getPaginated(page, limit);
    res.status(200).json(words);
  } catch (error) {
    console.error('Error fetching paginated words:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reuse the create function from controllers/word.js
const create = async (req, res) => {
  return wordController.create(req, res);
};

// Reuse the getAllByUserId function from controllers/word.js
const getAllByUserId = async (req, res) => {
  return wordController.getAllByUserId(req, res);
};

// Reuse the getById function from controllers/word.js
const getById = async (req, res) => {
  return wordController.getById(req, res);
};

// Reuse the update function from controllers/word.js
const update = async (req, res) => {
  return wordController.update(req, res);
};

// Reuse the remove function from controllers/word.js
const remove = async (req, res) => {
  return wordController.remove(req, res);
};

module.exports = {
  create,
  getAllByUserId,
  getById,
  update,
  remove,
  getPaginated,
};