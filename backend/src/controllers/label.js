const LabelModel = require('../models/label');
const WordModel = require('../models/word');

// Create a new label
const create = async (req, res) => {
  try {
    const { name } = req.body;
    const userId = req.user.id;  // Get user ID from request object

    // Check if the label already exists for the user
    const label = await LabelModel.findByNameAndUserId(name, userId);
    if (label) {
      return res.status(400).json({ message: 'Label with this name already exists' });
    }

    // Create the new label
    const newLabel = await LabelModel.createLabel(name, userId);
    res.status(201).json({ label: newLabel });
  } catch (err) {
    console.error('Error creating label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a specific label by ID
const update = async (req, res) => {
  try {
    const labelId = req.params.id;
    const { name } = req.body;

    // Check if the new label name already exists for the user
    const userId = req.user.id;  // Get user ID from request object
    const label = await LabelModel.findByNameAndUserId(name, userId);

    if (label && label.id !== parseInt(labelId)) { 
      return res.status(400).json({ message: 'Label exists' });
    }

    const updatedLabel = await LabelModel.updateLabel(labelId, name);

    if (!updatedLabel) {
      return res.status(404).json({ message: 'Label not found' });
    }

    res.status(200).json({ label: updatedLabel });
  } catch (err) {
    console.error('Error updating label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Delete a specific label by ID
const remove = async (req, res) => {
  try {
    const labelId = req.params.id;
    const label = await LabelModel.deleteLabel(labelId);

    if (!label) {
      return res.status(404).json({ message: 'Label not found' });
    }

    res.status(200).json({ message: 'Label deleted' });
  } catch (err) {
    console.error('Error deleting label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all labels for the authenticated user
const getAllFromUser = async (req, res) => {
  try {
    const userId = req.user.id;
    const labels = await LabelModel.getByUserId(userId);
    res.status(200).json({ labels });
  } catch (err) {
    console.error('Error fetching user labels:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Get all words associated with a specific label
const getWordsByLabel = async (req, res) => {
  try {
    const labelId = req.params.id;
    const words = await WordModel.getWordsByLabel(labelId);

    if (!words) {
      return res.status(404).json({ message: 'No words found for this label' });
    }

    res.status(200).json({ words });
  } catch (err) {
    console.error('Error fetching words by label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  create,
  update,
  remove,
  getAllFromUser,
  getWordsByLabel
};