import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    // The crypto module relies on Web Crypto + WASM, both available in Node 20+.
    environment: 'node',
    include: ['lib/**/*.test.ts'],
  },
});
