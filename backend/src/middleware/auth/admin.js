const authorizeDeveloper = (req, res, next) => {
    const developerApiKey = process.env.DEVELOPER_API_KEY;
    const apiKey = req.headers['x-api-key'];
  
    if (apiKey === developerApiKey) {
      next(); // Proceed to the next middleware or route handler
    } else {
      res.status(403).json({ message: 'Forbidden: You do not have access to this resource' });
    }
  };
  
  module.exports = authorizeDeveloper;
  