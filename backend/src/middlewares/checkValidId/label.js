const LabelModel = require('../../models/label');

const checkValidLabelId = async (req, res, next) => {
  const { label_id } = req.params;

  // Check if label_id is a valid number, an integer, and a positive number
  if (isNaN(label_id) || !Number.isInteger(Number(label_id)) || Number(label_id) <= 0) {
    return res.status(400).json({ message: 'Invalid label ID. It must be a positive integer.' });
  }

  // Ensure the label_id is within the SERIAL range
  const MAX_ID_VALUE = 2147483647; // SERIAL max value in PostgreSQL
  if (Number(label_id) > MAX_ID_VALUE) {
    return res.status(400).json({ message: 'Invalid label ID. Exceeds maximum allowed value for SERIAL.' });
  }

  try {
    const label = await LabelModel.getById(label_id);
    if (!label) {
      return res.status(404).json({ message: 'Label not found' });
    }

    // Label exists, proceed to the next middleware or route handler
    next();
  } catch (err) {
    console.error('Error checking label existence:', err);
    res.status(500).json({ message: 'Server error' });
  }
};

module.exports = { checkValidLabelId };