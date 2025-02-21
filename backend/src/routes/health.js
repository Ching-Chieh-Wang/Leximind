const express = require('express');
const router = express.Router();

router.post('/', (req, res) => {
  res.sendStatus(200); // Responds with HTTP 200 and no content
});

module.exports = router;