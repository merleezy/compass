const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// 1. Connect to the isolated database before starting tests
beforeAll(async () => {
  await mongoose.connect(process.env.DB_TEST_URI);
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
