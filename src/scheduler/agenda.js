const Agenda = require('agenda');
require('dotenv').config();

const agenda = new Agenda({
  db: {
    address: process.env.MONGODB_URI,
    collection: 'agendaJobs',
  },
});

// Define recurring jobs
agenda.define('DemoJob', async (job) => {
  const { to } = job.attrs.data;
  console.log('Hii.. I am inside a recurring job');
});



module.exports = agenda;