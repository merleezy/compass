const dotenv = require('dotenv');
const connectDB = require('./src/db');
const app = require('./src/app');

// Config
dotenv.config();

// App
const PORT = process.env.PORT || 5000;

// Infrastructure
connectDB();

// Start
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
