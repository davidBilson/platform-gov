// server.js
import express from 'express';
import cors from 'cors';
import jobRoutes from './routes/jobs.js';
import businessRoutes from './routes/business.js';
import { notFoundHandler, errorHandler } from './middleware/errorHandlers.js';

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/jobs', jobRoutes);
app.use('/api/businesses', businessRoutes);

// Error handling
app.use('*', notFoundHandler);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

export default app;