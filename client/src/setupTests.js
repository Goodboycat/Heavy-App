import { expect, afterEach, vi } from 'vitest'
import { cleanup } from '@testing-library/react'
import * as matchers from '@testing-library/jest-dom/matchers'

// Mock all CSS and asset imports
vi.mock('*.css', () => ({}))
vi.mock('*.scss', () => ({}))
vi.mock('*.sass', () => ({}))
vi.mock('*.less', () => ({}))
vi.mock('*.png', () => ({}))
vi.mock('*.jpg', () => ({}))
vi.mock('*.jpeg', () => ({}))
vi.mock('*.gif', () => ({}))
vi.mock('*.svg', () => ({}))

expect.extend(matchers)

afterEach(() => {
  cleanup()
})
