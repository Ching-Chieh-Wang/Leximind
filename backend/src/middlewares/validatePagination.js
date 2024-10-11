const validatePagination = (req, res, next) => {
    const { page, limit } = req.query;
  
    // If page is provided, ensure it is a valid number and greater than 0
    if (page && (!Number.isInteger(Number(page)) || Number(page) <= 0)) {
      return res.status(400).json({ message: '"page" must be a positive integer' });
    }
  
    // If limit is provided, ensure it is a valid number and greater than 0
    if (limit && (!Number.isInteger(Number(limit)) || Number(limit) <= 0)) {
      return res.status(400).json({ message: '"limit" must be a positive integer' });
    }
  
    next(); // Pass validation, proceed to the next middleware or route handler
  };
  
  module.exports = {validatePagination};