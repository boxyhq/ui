import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // Tests live outside src/ because mitosis compiles everything under
    // src/** into each framework package (see `files` in mitosis.config.cjs).
    include: ['test/**/*.test.ts'],
    environment: 'node',
  },
});
