import { beforeAll, beforeEach, afterAll } from 'vitest';
import mongoose from 'mongoose';
import 'dotenv/config';

// 1. Connect to the isolated database before starting tests
beforeAll(async () => {
  const uri = process.env.DB_TEST_URI;
  if (!uri) throw new Error('DB_TEST_URI is not set');
  await mongoose.connect(uri);
});

// 2. Clear the database after each test
beforeEach(async () => {
  const collections = mongoose.connection.collections;
  for (const key in collections) {
    await collections[key].deleteMany({});
  }
});

// 3. Disconnect gracefully after all tests run
afterAll(async () => {
  await mongoose.connection.close();
});
