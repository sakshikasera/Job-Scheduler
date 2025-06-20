const mongoose = require('mongoose');

const jobSchema = new mongoose.Schema({
  jobName: { type: String, required: true },
  schedule: { type: String, required: true },
  data: { type: Object },
  lastRunAt: { type: Date },
  nextRunAt: { type: Date },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Job', jobSchema);