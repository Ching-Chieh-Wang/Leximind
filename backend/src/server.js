const express = require('express');
const app = express();
const cors = require('cors');
const { connectToDatabase } = require('./db/db'); // Import the database connection

// Import routes
const userRoutes = require('./routes/user');
const collectionRoutes = require('./routes/collection');
const labelRoutes = require('./routes/label');
const wordRoutes = require('./routes/word');
const wordLabelRoutes = require('./routes/word_label');
const adminRoutes = require('./routes/admin/admin');

// Start the server after a successful database connection
connectToDatabase()
  .then(() => {
    // Middleware
    app.use(cors()); // Enable Cross-Origin Resource Sharing
    app.use(express.json()); // For parsing application/json

    // API Routes
    app.use('/adminApi', adminRoutes); // Admin routes
    app.use('/api/collections/:collection_id/words', wordRoutes); // Words related to a specific collection
    app.use('/api/collections/:collection_id/labels', labelRoutes); // Labels related to a specific collection
    app.use('/api/collections', collectionRoutes); // Collection-related routes
    app.use('/api/word-labels', wordLabelRoutes); // Word-label relationships
    app.use('/api/users', userRoutes); // User-related routes
    
    // Start the server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
    process.exit(1); // Exit the process if there's a database connection error
  });