import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js',
    include: ['src/tests/**/*.test.{js,jsx,ts,tsx}'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/dist_temp/**',
      '**/storage/**',
      '**/downloads/**',
      '**/shared/**',
      '**/documents/**'
    ],
    // Mock CSS and other static assets
    server: {
      deps: {
        inline: ['vitest']
      }
    }
  },
  // Mock CSS imports in tests
  css: {
    modules: {
      classNameStrategy: 'non-scoped'
    }
  }
})
