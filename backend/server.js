// server.js
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

// mock data store
let jobs = [
  { 
    id: '1', 
    title: 'Government Cybersecurity Consultant', 
    company: 'Department of Defense', 
    description: 'Looking for an experienced cybersecurity expert',
    location: 'Washington DC',
    remote: true,
    postedAt: '2025-04-10'
  },
  { 
    id: '2', 
    title: 'Healthcare Policy Advisor', 
    company: 'Health & Human Services', 
    description: 'Expert in healthcare policy needed for advisory role',
    location: 'Atlanta, GA',
    remote: false,
    postedAt: '2025-04-12'
  }
];

// mock data business profiles
let businesses = [
  {
    id: '1',
    name: 'Tech Solutions Inc.',
    description: 'Government technology solutions provider',
    industry: 'Technology',
    location: 'Boston, MA',
    contactEmail: 'contact@techsolutions.com'
  },
  {
    id: '2',
    name: 'Policy Advisors Group',
    description: 'Expert consultancy for government policy',
    industry: 'Consulting',
    location: 'Washington DC',
    contactEmail: 'info@policyadvisors.com'
  }
];

// Route for listing jobs
app.get('/api/jobs', (req, res) => {
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

// Route for getting a single job
app.get('/api/jobs/:id', (req, res) => {
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

// Route for listing businesses
app.get('/api/businesses', (req, res) => {
  try {
    res.status(200).json({
      success: true,
      count: businesses.length,
      data: businesses
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch businesses',
      error: error.message
    });
  }
});

// Route for getting a single business
app.get('/api/businesses/:id', (req, res) => {
  try {
    const business = businesses.find(business => business.id === req.params.id);
    
    if (!business) {
      return res.status(404).json({ 
        success: false, 
        message: `Business with ID ${req.params.id} not found` 
      });
    }
    
    res.status(200).json({
      success: true,
      data: business
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to fetch business',
      error: error.message
    });
  }
});

// Route for updating a business
app.put('/api/businesses/:id', (req, res) => {
  try {
    const { id } = req.params;
    const businessIndex = businesses.findIndex(business => business.id === id);
    
    if (businessIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: `Business with ID ${id} not found`
      });
    }
    
    // Validate required fields
    if (req.body.name && req.body.name.trim() === '') {
      return res.status(400).json({
        success: false,
        message: 'Business name cannot be empty'
      });
    }
    
    if (req.body.contactEmail && !req.body.contactEmail.includes('@')) {
      return res.status(400).json({
        success: false,
        message: 'Invalid email format'
      });
    }
    
    // Update business
    businesses[businessIndex] = {
      ...businesses[businessIndex],
      ...req.body,
      id // Ensure ID is not changed
    };
    
    res.status(200).json({
      success: true,
      message: 'Business updated successfully',
      data: businesses[businessIndex]
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: 'Failed to update business',
      error: error.message
    });
  }
});

// Error handling for invalid routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'API endpoint not found'
  });
});

// Error handling middleware
app.use((err, req, res) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Server error',
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;