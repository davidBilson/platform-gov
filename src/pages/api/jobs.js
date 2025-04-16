import axios from 'axios';

export default async function handler(req, res) {
  try {
    const response = await axios.get('http://localhost:5050/api/jobs');
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ 
      success: false, 
      message: 'Failed to fetch jobs',
      error: error.message 
    });
  }
}