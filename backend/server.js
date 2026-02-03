/**
 * CampusHub Backend Server
 * Express.js REST API server for Student Activity & Resource Management
 */

const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use('/api/events', require('./routes/eventRoutes'));
app.use('/api/students', require('./routes/studentRoutes'));
app.use('/api/resources', require('./routes/resourceRoutes'));

app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'OK',
    message: 'CampusHub API is running',
    timestamp: new Date().toISOString()
  });
});

app.use((req, res) => {
  res.status(404).json({
    error: 'Route not found',
    path: req.originalUrl
  });
});

app.use((err, req, res, next) => {
  console.error('Server error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message
  });
});

async function startServer() {
  try {
    const mongoUri = process.env.MONGODB_URI || 'mongodb://localhost:27017/campushub';
    await mongoose.connect(mongoUri);
    console.log('MongoDB connected successfully');

    app.listen(PORT, () => {
      console.log(`Server running on http://localhost:${PORT}`);
      console.log(`API endpoints available at http://localhost:${PORT}/api`);
    });
  } catch (error) {
    console.error('MongoDB connection failed:', error.message);
    process.exit(1);
  }
}

startServer();
