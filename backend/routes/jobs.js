// routes/jobs.js
import express from 'express';
import { jobs } from '../data/mockData.js';

const router = express.Router();

// GET all jobs
router.get('/', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: jobs.length,
      data: jobs
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch jobs',
      error: error.message
    });
  }
});

// GET a single job
router.get('/:id', (req, res) => {
  try {
    const job = jobs.find(job => job.id === req.params.id);
    
    if (!job) {
      return res.status(404).json({ 
        success: false, 
        message: `Job with ID ${req.params.id} not found` 
      });
    }
    
    res.status(200).json({
      success: true,
      data: job
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch job',
      error: error.message
    });
  }
});

export default router;