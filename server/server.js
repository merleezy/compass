const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/db");

// Load environment variables from .env
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Connect to MongoDB first, then start server
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Simple health route to check if the server is running
app.get("/api/health", (req, res) => {
  res.json({ status: "Compass API is running" });
});

// Start server
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
