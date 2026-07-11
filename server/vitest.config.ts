import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    setupFiles: ['./tests/setup.ts'],
    // All test files share the compass_test database, and setup.ts clears every
    // collection between tests — parallel files would wipe each other's data.
    fileParallelism: false,
  },
});
