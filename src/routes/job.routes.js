const express = require('express');
const router = express.Router();

const Job = require('../models/job.model'); // Job model for MongoDB
const scheduleJob = require('../scheduler/scheduler'); // Function to schedule jobs using cron

// ------------------------------------
// GET /api/jobs/
// Returns a list of all jobs
// ------------------------------------
router.get('/', async (req, res) => {
  const redisKey = 'jobs:list';

  // Check if job list is cached in Redis
  const cached = await req.redis.get(redisKey);
  if (cached) return res.json(JSON.parse(cached)); // Return cached list if available

  try {
    // Fetch all jobs from MongoDB
    const jobs = await Job.find();

    // Store the list in Redis cache for future requests (expires in 60 seconds)
    await req.redis.set(redisKey, JSON.stringify(jobs), 'EX', 600);

    // Return the list of jobs
    res.json(jobs);
  } catch (err) {
    // Handle errors (e.g., DB connection issues)
    res.status(500).json({ error: 'Error fetching jobs' });
  }
});

// ------------------------------------
// GET /api/jobs/:id
// Returns a single job by its ID
// ------------------------------------
router.get('/:id', async (req, res) => {
  const { id } = req.params;
  const redisKey = `job:${id}`;

  // Check if this job is cached in Redis
  const cached = await req.redis.get(redisKey);
  if (cached) return res.json(JSON.parse(cached)); // Return cached job if available

  try {
    // Fetch job from MongoDB using ID
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Store job in Redis cache
    await req.redis.set(redisKey, JSON.stringify(job), 'EX', 600);

    // Return the job
    res.json(job);
  } catch (err) {
    // Handle errors (e.g., invalid ID or DB issues)
    res.status(500).json({ error: 'Error fetching job' });
  }
});

// ------------------------------------
// POST /api/jobs/
// Creates a new job and schedules it
// ------------------------------------
router.post('/', async (req, res) => {
  try {
    const { jobName, schedule, data, repeat = false } = req.body;

    // Basic validation for required fields
    if (!jobName || !schedule || typeof data !== 'object') {
      return res.status(400).json({
        error: 'jobName, schedule, and data (object) are required',
      });
    }

    // Create and store the job in MongoDB
    const jobRecord = await Job.create({
      jobName,
      schedule,
      data,
      repeat,
      nextRun: new Date(Date.now() + 60000) // Set nextRun as 1 minute from now (placeholder)
    });

    // Schedule the job using cron
    scheduleJob(jobRecord);

    // Clear the Redis job list cache so it will refresh on next GET
    await req.redis.del('jobs:list');

    // Respond with success and job details
    res.status(201).json({ message: 'Job created and scheduled', job: jobRecord });
  } catch (err) {
    // Handle unexpected errors
    console.error('Job creation failed:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Export the router so it can be used in the main app
module.exports = router;
