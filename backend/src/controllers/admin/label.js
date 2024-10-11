const labelController = require('../label'); // Reuse existing user label controller
const LabelModel = require('../../models/label');

// Admin: Get all labels with pagination
const getPaginated = async (req, res) => {
  const { page = 1, limit = 10 } = req.query;
  const offset = (page - 1) * limit;

  try {
    const labels = await LabelModel.getPaginated(limit, offset);
    res.status(200).json(labels);
  } catch (error) {
    console.error('Error fetching paginated labels:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Reuse the create function from controllers/label.js
const create = async (req, res) => {
  return labelController.create(req, res);
};

// Reuse the getAllByUserId function from controllers/label.js
const getAllByUserId = async (req, res) => {
  return labelController.getAllByUserId(req, res);
};

// Reuse the getById function from controllers/label.js
const getById = async (req, res) => {
  return labelController.getById(req, res);
};

// Reuse the update function from controllers/label.js
const update = async (req, res) => {
  return labelController.update(req, res);
};

// Reuse the remove function from controllers/label.js
const remove = async (req, res) => {
  return labelController.remove(req, res);
};

module.exports = {
  create,
  getAllByUserId,
  getById,
  update,
  remove,
  getPaginated,
};