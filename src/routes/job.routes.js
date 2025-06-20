const express = require('express');
const router = express.Router();
const jobController = require('../controllers/job.controller');


router.get('/jobs', jobController.getAllJobs);
router.get('/jobs/:id', jobController.getJobById);
router.post('/jobs', jobController.createJob);

module.exports = router;
