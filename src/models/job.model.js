const mongoose = require('mongoose');

// Define the structure of a Job document in MongoDB
const jobSchema = new mongoose.Schema({
  // Name or title of the job (required)
  jobName: { type: String, required: true },

  // Cron expression that defines when the job should run (required)
  schedule: { type: String, required: true },

  // Any custom data related to the job (can be anything, required)
  data: { type: Object, required: true },

  // Whether this job should repeat or run just once
  repeat: { type: Boolean, default: false },

  // Timestamp of when the job was last executed
  lastRun: { type: Date },

  // Estimated time of the next scheduled run
  nextRun: { type: Date },
}, {
  // Automatically adds createdAt and updatedAt timestamps
  timestamps: true
});

// Export the model so it can be used in controllers or services
module.exports = mongoose.model('Job', jobSchema);
