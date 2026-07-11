import express from 'express';
import cors from 'cors';
import habitRoutes from './routes/habits.js';
import taskRoutes from './routes/tasks.js';

const app = express();

// Infrastructure
app.use(express.json());
app.use(cors());

// Routes
app.use('/api/habits', habitRoutes);
app.use('/api/tasks', taskRoutes);

// Health Check
app.get('/api/health', (req, res) => {
  res.status(200).json({ status: 'Compass API is running' });
});

export default app;
