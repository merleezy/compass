// Handles the MongoDB connection

import mongoose from 'mongoose';

const connectDB = async (): Promise<void> => {
  // Narrow `string | undefined` to `string` before handing it to Mongoose —
  // failing loudly here beats a cryptic connection error later.
  const uri = process.env.MONGODB_URI;
  if (!uri) {
    console.error('MONGODB_URI is not set');
    process.exit(1);
  }

  try {
    const conn = await mongoose.connect(uri);
    console.log(`MongoDB connected: ${conn.connection.host}`);
  } catch (e) {
    console.error(`MongoDB connection error: ${e}`);
    process.exit(1); // Exit if we can't connect
  }
};

export default connectDB;
