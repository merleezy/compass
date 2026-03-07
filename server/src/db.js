// Handles the MongoDB connection

const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI);
    console.log(`MongoDB connected: ${conn.connection.host}`)
  } catch (e) {
    console.error(`MongoDB connection error: ${e}`)
    process.exit(1); // Exit if we can't connect
  }
}

module.exports = connectDB