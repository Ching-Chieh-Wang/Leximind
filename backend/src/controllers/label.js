const LabelModel = require('../models/label');

// Create a new label
const create = async (req, res) => {
  try {
    const { name } = req.body;
    const user_id = req.user.id;  // Get user ID from request object

    // Check if the label already exists for the user
    const label = await LabelModel.getByNameAndUserId(name, user_id);
    if (label) {
      return res.status(400).json({ message: 'Label with this name already exists' });
    }

    // Create the new label
    const newLabel = await LabelModel.create(name, user_id);
    res.status(201).json({ label: newLabel });
  } catch (err) {
    console.error('Error creating label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Update a specific label by ID
const update = async (req, res) => {
  try {
    const { label_id} = req.params;
    const { name } = req.body;

    // Check if the new label name already exists for the user
    const user_id = req.user.id;  // Get user ID from request object
    const label = await LabelModel.getByNameAndUserId(name, user_id);

    if (label && label.id !== parseInt(label_id)) { 
      return res.status(400).json({ message: 'Label exists' });
    }

    const updatedLabel = await LabelModel.update(label_id, name);

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
    const label_id = req.params.id;
    const label = await LabelModel.remove(label_id);

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
const getAllByUserId = async (req, res) => {
  try {
    const userId = req.user.id;
    const labels = await LabelModel.getAllByUserId(userId);
    res.status(200).json({ labels });
  } catch (err) {
    console.error('Error fetching user labels:', err);
    res.status(500).json({ message: 'Server error' });
  }
};


module.exports = {
  create,
  update,
  remove,
  getAllByUserId,
};