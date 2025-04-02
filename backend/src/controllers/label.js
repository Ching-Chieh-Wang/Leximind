const labelModel = require('../models/label');

// Function to create a new label within a specific collection
const create = async (req, res) => {
  try {
    const { name } = req.body;
    const user_id = req.user_id;
    const { collection_id } = req.params;

    const data = await labelModel.create({ user_id,collection_id, name  });

    if (!data) {
      return res.status(500).json({ message: 'Error creating label' });
    }
    return res.status(201).json({  id: data.id });
  } catch (err) {
    if (err.code === '23502') { // Foreign key violation
      return res.status(400).json({ message: 'Invalid user or collection ID provided' });
    }
    if (err.code === '23505') { // Handle unique constraint violation
      return res.status(400).json({ message:{invalidArguments: [{path: "name",msg:'A label with this name already exists in this collection.' }]}});
    }
    console.error('Error creating label:', err);
    res.status(500).json({ message: 'Failed to create label, please try again later!' });
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

    return res.status(200).json({});
  } catch (err) {
    if (err.code === '23505') { // Handle unique constraint violation
      return res.status(400).json({ message:{invalidArguments: [{path: "name",msg:'A label with this name already exists in this collection.' }]}});
    }
    console.error('Error updating label:', err);
    res.status(500).json({ message: 'Failed to updawte label, please try again later!' });
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

    return res.status(200).json({});
  } catch (err) {
    console.error('Error deleting label:', err);
    res.status(500).json({ message: 'Failed to remove label, please try again later!' });
  }
};


module.exports = {
  create,
  update,
  remove,
};