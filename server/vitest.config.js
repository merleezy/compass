const { defineConfig } = require('vitest/config');

module.exports = defineConfig({
  test: {
    setupFiles: ['./tests/setup.js'],
    globals: true,
    // All test files share the compass_test database, and setup.js clears every
    // collection between tests — parallel files would wipe each other's data.
    fileParallelism: false,
  },
});
