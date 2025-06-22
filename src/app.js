const express = require('express');
const mongoose = require('mongoose');
const Redis = require('ioredis');
const jobRoutes = require('./routes/job.routes');
require('dotenv').config(); // Load environment variables from .env file

const app = express();

// Create a new Redis client instance (connects to localhost:6379 by default)
const redis = new Redis();

// Middleware to parse JSON request bodies
app.use(express.json());

// Middleware to attach the Redis client to every request
// This makes Redis accessible via req.redis in routes/controllers
app.use((req, res, next) => {
  req.redis = redis;
  next();
});

// All job-related API routes will start with /jobs
app.use('/jobs', jobRoutes);

// Choose port from environment or use default 3000
const PORT = process.env.PORT || 3000;

// Connect to MongoDB using the connection string from .env
mongoose.connect(process.env.MONGODB_URI)
  .then(() => {
    console.log('✅ MongoDB connected successfully');
  })
  .catch((err) => {
    console.error('❌ MongoDB connection error:', err);
  });

// Export the app instance (used by server.js to start listening)
module.exports = app;
