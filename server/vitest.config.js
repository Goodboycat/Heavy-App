import { defineConfig } from 'vitest/config'

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    include: ['src/tests/**/*.test.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/storage/**',
      '**/downloads/**',
      '**/shared/**',
      '**/documents/**'
    ],
    setupFiles: ['./src/tests/setup.ts']
  },
  resolve: {
    conditions: ['node']
  }
})
