import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'

function SimpleComponent() {
  return <div>Simple Test</div>
}

describe('Client Simple Tests', () => {
  it('should render simple component', () => {
    render(<SimpleComponent />)
    expect(screen.getByText('Simple Test')).toBeInTheDocument()
  })

  it('should pass basic test', () => {
    expect(1 + 1).toBe(2)
  })
})
