import 'dotenv/config';
import connectDB from './db.js';
import app from './app.js';

// App
const PORT = process.env.PORT || 5000;

// Infrastructure
connectDB();

// Start
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
