const LabelModel = require('../../models/label');

const validateLabelId = async (req, res, next) => {
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
  next();
}

module.exports = { validateLabelId };