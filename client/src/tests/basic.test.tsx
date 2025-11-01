import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

function TestComponent() {
  return <div>Test Content</div>
}

describe('Client Basic Tests', () => {
  it('should render component', () => {
    render(<TestComponent />)
    expect(screen.getByText('Test Content')).toBeInTheDocument()
  })

  it('should pass basic test', () => {
    expect(1 + 1).toBe(2)
  })
})
