const labelModel = require('../models/label'); // Import the Label model

// Function to create a new label within a specific collection
const create = async (req, res) => {
  try {
    const { name } = req.body;
    const user_id = req.user.id; // Extract user ID from the authenticated user
    const collection_id = req.collection.id; // Get collection ID from request

    // Create the new label in the database
    const newLabel = await labelModel.create({ name, user_id, collection_id });

    // Send a success response with the created label
    res.status(201).json({ message: 'Label created successfully', label: newLabel });
  } catch (err) {
    // Check for unique constraint violation (PostgreSQL code '23505')
    if (err.code === '23505') {
      return res.status(400).json({ message: 'A label with this name already exists in this collection.' });
    }
    console.error('Error creating label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to update a specific label by ID
const update = async (req, res) => {
  try {
    const label = req.label; // The label object is already attached by the middleware
    const { name } = req.body; // Extract the new name from the request body

    // Update the label's name in the database if it has changed
    if (label.name !== name) {
      const updatedLabel = await labelModel.update(label.id, { name });

      // Respond with a success message and the updated label
      return res.status(200).json({ message: 'Label updated successfully', label: updatedLabel });
    }

    // If the name is the same, return a 204 No Content status, indicating no changes were made
    return res.status(204).json({ message: 'No changes made to the label.' });
  } catch (err) {
    // Check for unique constraint violation (PostgreSQL code '23505')
    if (err.code === '23505') {
      return res.status(400).json({ message: 'A label with this name already exists in this collection.' });
    }
    else{
      console.error('Error updating label:', err);
      res.status(500).json({ message: 'Server error' });    console.error('Error updating label:', err);
    }
  }
};

// Function to delete a specific label by ID
const remove = async (req, res) => {
  try {
    const label_id = req.label.id; // Get the label ID from request parameters

    // Remove the label from the database
    await labelModel.remove(label_id);

    res.status(200).json({ message: 'Label deleted successfully' });
  } catch (err) {
    console.error('Error deleting label:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

// Function to get all labels by collection ID
const getAllByCollectionId = async (req, res) => {
  try {
    const collection_id = req.collection.id; // Get the collection ID from request parameters

    // Fetch all labels associated with the collection
    const labels = await labelModel.getAllByCollectionId(collection_id);

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