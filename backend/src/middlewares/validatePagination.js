const validatePagination = (req, res, next) => {
  const { page, limit } = req.query;

  if (page === undefined && limit === undefined) {
    return next();
  }
  // Ensure both page and limit are provided or both not
  if (page === undefined || limit === undefined) {
    return res.status(400).json({ message: '"page" and "limit" togethered are required query parameters' });
  }

  // Ensure page is a positive integer
  if (!Number.isInteger(Number(page)) || Number(page) <= 0) {
    return res.status(400).json({ message: '"page" must be a positive integer' });
  }

  // Ensure limit is a positive integer
  if (!Number.isInteger(Number(limit)) || Number(limit) <= 0) {
    return res.status(400).json({ message: '"limit" must be a positive integer' });
  }

  // Calculate offset and attach pagination data to the request object
  const parsedPage = parseInt(page, 10);
  const parsedLimit = parseInt(limit, 10);
  req.limit = parsedLimit;
  req.offset = (parsedPage - 1) * parsedLimit;

  next(); // Pass validation, proceed to the next middleware or route handler
};

module.exports = { validatePagination };