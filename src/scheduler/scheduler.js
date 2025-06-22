const cron = require('node-cron');                // To schedule jobs using cron syntax
const Job = require('../models/job.model');       // MongoDB Job model
const cronParser = require('cron-parser');        // To calculate the next run time based on cron expression

// Function to schedule a job using its cron expression
function scheduleJob(jobRecord) {
  // Validate the cron expression before scheduling
  if (!cron.validate(jobRecord.schedule)) throw new Error('Invalid cron expression');

  // Schedule the job using node-cron
  cron.schedule(jobRecord.schedule, async () => {
    console.log(`Running job: ${jobRecord.jobName}`);

    // Example logic (can be replaced with actual task execution)
    console.log('Data:', jobRecord.data);

    // Update timestamps after job runs
    jobRecord.lastRun = new Date(); // When job last executed
    jobRecord.nextRun = getNextRunDate(jobRecord.schedule); // When it will run next

    // Save updates to database
    await jobRecord.save();
  });
}

// Function to calculate the next run time from a cron expression
function getNextRunDate(cronExp) {
  try {
    // Parse the cron expression to get the upcoming schedule
    const interval = cronParser.parseExpression(cronExp);
    const nextDate = interval.next().toDate(); // Get next valid run date

    return nextDate;
  } catch (err) {
    // Handle cases where cron expression is invalid
    console.error('Error parsing cron expression:', err.message);
    return null;
  }
}

// Export the scheduleJob function so it can be used in other parts of the app
module.exports = scheduleJob;
