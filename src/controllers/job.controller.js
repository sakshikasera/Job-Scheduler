// Import the Job model and the job scheduler function
const Job = require('../models/job.model');
const scheduleJob = require('../scheduler/scheduler');

// Get and return all jobs (cached in Redis if available)
exports.getAllJobs = async (req, res) => {
  const redisKey = 'jobs:list';

  // Check if jobs are already cached in Redis
  const cached = await req.redis.get(redisKey);
  if (cached) return res.json(JSON.parse(cached)); // Return cached data if available

  try {
    // Fetch all jobs from MongoDB
    const jobs = await Job.find();

    // Store the result in Redis for future requests (expires in 10 mins)
    await req.redis.set(redisKey, JSON.stringify(jobs), 'EX', 600);

    // Send response to client
    res.json(jobs);
  } catch (err) {
    // Handle errors if DB query fails
    res.status(500).json({ error: 'Error fetching jobs' });
  }
};

// Get and return a single job by ID (cached in Redis if available)
exports.getJobById = async (req, res) => {
  const { id } = req.params;
  const redisKey = `job:${id}`;

  // Check if the job is already cached in Redis
  const cached = await req.redis.get(redisKey);
  if (cached) return res.json(JSON.parse(cached)); // Return cached version if found

  try {
    // Fetch the job from MongoDB
    const job = await Job.findById(id);
    if (!job) return res.status(404).json({ error: 'Job not found' });

    // Cache the job in Redis for future requests
    await req.redis.set(redisKey, JSON.stringify(job), 'EX', 600);

    // Send job to client
    res.json(job);
  } catch (err) {
    // Handle database or lookup errors
    res.status(500).json({ error: 'Error fetching job' });
  }
};

// Create a new job and schedule it
exports.createJob = async (req, res) => {
  try {
    const { jobName, schedule, data, repeat = false } = req.body;

    // Validate required fields
    if (!jobName || !schedule || typeof data !== 'object') {
      return res.status(400).json({
        error: 'jobName, schedule, and data (object) are required',
      });
    }

    // Create and store new job in MongoDB
    const jobRecord = await Job.create({
      jobName,
      schedule,
      data,
      repeat,
      nextRun: new Date(Date.now() + 60000) // Placeholder: next run in 1 min
    });

    // Immediately schedule the job using node-cron
    scheduleJob(jobRecord);

    // Clear the cached job list so it gets updated next time
    await req.redis.del('jobs:list');

    // Send confirmation back to the client
    res.status(201).json({ message: 'Job created and scheduled', job: jobRecord });
  } catch (err) {
    // Log and handle any errors during job creation
    console.error('Job creation failed:', err.message);
    res.status(500).json({ error: 'Internal server error' });
  }
};
