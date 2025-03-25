require('dotenv').config(); // Load environment variables
const express = require('express');
const cors = require('cors');
require('./db'); // Ensure this connects to the database

const authRoutes = require('./routes/authroutes');
const taskRoutes = require('./routes/taskroutes');

const app = express();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);

// Start the server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
