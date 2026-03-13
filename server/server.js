const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./src/db");
const habitRoutes = require("./src/routes/habits");

// Config
dotenv.config();

// App
const app = express();
const PORT = process.env.PORT || 5000;

// Infrastructure
connectDB();

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use("/api/habits", habitRoutes);
app.get("/api/health", (req, res) => {
  res.json({ status: "Compass API is running" });
});

// Start
app.listen(PORT, () => {
  console.log(`Listening on port ${PORT}`);
});
