import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { QueryClient, QueryClientProvider } from '@tanstack/react-query'
import Dashboard from '../pages/Dashboard'

// Mock the auth context
vi.mock('../contexts/AuthContext', () => ({
  useAuth: () => ({
    user: {
      id: '1',
      email: 'test@example.com',
      username: 'testuser',
      profile: {
        firstName: 'Test',
        lastName: 'User'
      }
    }
  })
}))

// Mock the useProfile hook
vi.mock('../hooks/useUsers', () => ({
  useProfile: () => ({
    data: {
      data: {
        user: {
          id: '1',
          email: 'test@example.com',
          username: 'testuser',
          profile: {
            firstName: 'Test',
            lastName: 'User',
            title: 'Senior Developer'
          }
        }
      }
    }
  })
}))

const createTestQueryClient = () => new QueryClient({
  defaultOptions: {
    queries: { retry: false },
    mutations: { retry: false },
  },
})

const renderWithProviders = (ui: React.ReactElement) => {
  const testQueryClient = createTestQueryClient()
  return render(
    <BrowserRouter>
      <QueryClientProvider client={testQueryClient}>
        {ui}
      </QueryClientProvider>
    </BrowserRouter>
  )
}

describe('Dashboard', () => {
  beforeEach(() => {
    vi.clearAllMocks()
  })

  it('renders welcome message with user name', () => {
    renderWithProviders(<Dashboard />)
    
    expect(screen.getByText(/Welcome back, Test!/)).toBeInTheDocument()
    expect(screen.getByText('Senior Full Stack Developer')).toBeInTheDocument()
  })

  it('displays stats cards', () => {
    renderWithProviders(<Dashboard />)
    
    expect(screen.getByText('Projects Completed')).toBeInTheDocument()
    expect(screen.getByText('Team Members')).toBeInTheDocument()
    expect(screen.getByText('Code Reviews')).toBeInTheDocument()
    expect(screen.getByText('Uptime')).toBeInTheDocument()
  })

  it('shows senior developer skills', () => {
    renderWithProviders(<Dashboard />)
    
    expect(screen.getByText('Senior Developer Skills')).toBeInTheDocument()
    expect(screen.getByText('TypeScript')).toBeInTheDocument()
    expect(screen.getByText('System Design')).toBeInTheDocument()
    expect(screen.getByText('Microservices')).toBeInTheDocument()
  })

  it('displays activity feed', () => {
    renderWithProviders(<Dashboard />)
    
    expect(screen.getByText('Recent Activity')).toBeInTheDocument()
    expect(screen.getByText('Deployed new feature')).toBeInTheDocument()
    expect(screen.getByText('Code review completed')).toBeInTheDocument()
  })
})