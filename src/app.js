const express = require('express');
const mongoose = require('mongoose');
const jobRoutes = require('./routes/job.routes');
require('dotenv').config();

const app = express();
app.use(express.json());

mongoose.connect(process.env.MONGODB_URI).then(() => {
  console.log('MongoDB connected');
});

app.use('/api', jobRoutes);

module.exports = app;
