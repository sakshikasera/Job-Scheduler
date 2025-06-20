const Job = require('../models/job.model');
const agenda = require('../scheduler/agenda');

exports.getAllJobs = async (req, res) => {
  const jobs = await Job.find();
  res.json(jobs);
};

exports.getJobById = async (req, res) => {
  const job = await Job.findById(req.params.id);
  if (!job) return res.status(404).json({
     error: 'Job not found' 
    });
  res.json(job);
};

exports.createJob = async (req, res) => {
  try {
    const { jobName, schedule, data, repeat = false } = req.body;
    if (!jobName || !schedule) 
     return res.status(404).json({
     error: 'All fields are mandatory...' 
    });

   const jobRecord = await Job.create({ jobName, schedule, data });

    await agenda.start();
    if (repeat) {
      await agenda.every(schedule, jobName, data);
    } else {
      await agenda.schedule(schedule, jobName, data);
    }

    res.status(201).json({ message: 'Job scheduled', job: jobRecord });
  } catch (err) {
    console.error('[Error]', err);
    res.status(500).json({ error: 'Failed to schedule job' });
  }
};
