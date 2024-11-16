const labelModel = require('../models/label');

// Function to create a new label within a specific collection
const create = async (req, res) => {
  try {
    const { name } = req.body;
    const user_id = req.user_id;
    const { collection_id } = req.params;

    const newLabel_id = await labelModel.create({ user_id,collection_id, name  });

    if (!newLabel_id) {
      return res.status(500).json({ message: 'Error creating label' });
    }

    res.status(201).json({ message: 'Label created successfully', label_id: newLabel_id });
  } catch (err) {
    if (err.code === '23502') { // Foreign key violation
      return res.status(400).json({ message: 'Invalid user or collection ID provided' });
    }
    if (err.code === '23505') { // Handle unique constraint violation
      return res.status(400).json({ message: 'A label with this name already exists in this collection.' });
    }
    console.error('Error creating label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to update a specific label by ID
const update = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { collection_id, label_id } = req.params;
    const { name } = req.body;

    const isUpdateSucess = await labelModel.update(user_id,collection_id, label_id, name);

    if (!isUpdateSucess) {
      return res.status(404).json({ message: 'Label not found' });
    }

    res.status(200).json({ message: 'Label updated successfully' });
  } catch (err) {
    if (err.code === '23505') { // Handle unique constraint violation
      return res.status(400).json({ message: 'A label with this name already exists in this collection.' });
    }
    console.error('Error updating label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to delete a specific label by ID
const remove = async (req, res) => {
  try {
    const user_id = req.user_id;
    const { collection_id, label_id } = req.params;

    const isRemoved = await labelModel.remove(user_id,collection_id, label_id);

    if (!isRemoved) {
      return res.status(404).json({ message: 'Label not found' });
    }

    res.status(200).json({ message: 'Label deleted successfully' });
  } catch (err) {
    console.error('Error deleting label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get all labels by collection ID
const getAllByCollectionId = async (req, res) => {
  try {
    const user_id=req.user_id;
    const {collection_id} = req.params; // Get the collection ID from request parameters

    // Fetch all labels associated with the collection
    const labels = await labelModel.getAllByCollectionId(user_id, collection_id);
    if(!labels){
      return res.status(404).json({ message: 'Label not found' });
    }

    res.status(200).json({ labels });
  } catch (err) {
    console.error('Error fetching labels:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = {
  create,
  update,
  remove,
  getAllByCollectionId,
};