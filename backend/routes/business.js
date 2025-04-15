// routes/businesses.js
import express from 'express';
import { businesses } from '../data/mockData.js';

const router = express.Router();

// GET all businesses
router.get('/', (req, res) => {
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

// GET a single business
router.get('/:id', (req, res) => {
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

// UPDATE/PUT a business
router.put('/:id', (req, res) => {
  try {
    const { id } = req.params;
    const businessIndex = businesses.findIndex(business => business.id === id);
    
    if (businessIndex === -1) {
      return res.status(404).json({ 
        success: false, 
        message: `Business with ID ${id} not found`
      });
    }
    
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

export default router;