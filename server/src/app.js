const express = require('express');
const cors = require('cors');

const app = express();

// Infrastructure
app.use(express.json());
app.use(cors());

// Routes
const habitRoutes = require('./routes/habits');
const taskRoutes = require('./routes/tasks');

app.use('/api/habits', habitRoutes);
app.use('/api/tasks', taskRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Compass API is running' });
});

module.exports = app;
