export interface User {
  id: string
  email: string
  username: string
  role: UserRole
  profile?: Profile
  createdAt: string
  updatedAt: string
}

export interface Profile {
  id: string
  userId: string
  firstName?: string
  lastName?: string
  avatar?: string
  title?: string
  bio?: string
  skills: string[]
  githubUrl?: string
  linkedinUrl?: string
  websiteUrl?: string
  createdAt: string
  updatedAt: string
}

export type UserRole = 'USER' | 'ADMIN' | 'SUPER_ADMIN'

export interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export type AuthAction =
  | { type: 'AUTH_START' }
  | { type: 'AUTH_SUCCESS'; payload: { user: User; token: string } }
  | { type: 'AUTH_FAILURE'; payload: string }
  | { type: 'AUTH_LOGOUT' }
  | { type: 'UPDATE_PROFILE'; payload: Partial<Profile> }
  | { type: 'CLEAR_ERROR' }

export interface LoginCredentials {
  email: string
  password: string
}

export interface RegisterData {
  email: string
  username: string
  password: string
  firstName: string
  lastName: string
}

export interface ProfileData {
  firstName?: string
  lastName?: string
  title?: string
  bio?: string
  skills?: string[]
  githubUrl?: string
  linkedinUrl?: string
  websiteUrl?: string
}

export interface AuthResponse {
  user: User
  token: string
}

export interface Pagination {
  page: number
  limit: number
  total: number
  pages: number
}
