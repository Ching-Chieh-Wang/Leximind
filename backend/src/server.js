const express = require('express');
const app = express();
const cors = require('cors');
const { connectToDatabase } = require('./db/db'); // Import the database connection

// Import routes
const userRoutes = require('./routes/user');
const labelRoutes = require('./routes/label');
const wordRoutes = require('./routes/word');
const wordLabelRoutes=require('./routes/word_label.js')
const adminRoutes=require('./routes/admin/admin.js')

// Start the server after successful database connection
connectToDatabase()
  .then(() => {
    // Middleware
    app.use(cors());
    app.use(express.json()); // For parsing application/json

    // API Routes
    app.use('/adminApi',adminRoutes);
    app.use('/api/word_label',wordLabelRoutes)
    app.use('/api/user', userRoutes);
    app.use('/api/label', labelRoutes);
    app.use('/api/word', wordRoutes);

    // Start the server
    const PORT = process.env.PORT || 4000;
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch(err => {
    console.error('Error connecting to the database:', err);
    process.exit(1);
  });
