const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

// Load environment variables from .env
dotenv.config();

const app = express()
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

app.get('/api/health', (req,res) => {
  res.json({ status: 'Compass API is running'});
});

app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`)
})