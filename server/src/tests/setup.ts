// Test setup that doesn't import the main server
import { beforeAll, afterAll } from 'vitest'

beforeAll(() => {
  // Setup test database or other test dependencies
  process.env.NODE_ENV = 'test'
})

afterAll(() => {
  // Cleanup after tests
})
