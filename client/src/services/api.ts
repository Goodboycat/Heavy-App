import axios from 'axios'
import type { AxiosResponse, AxiosError } from 'axios'
import toast from 'react-hot-toast'
import type { 
  LoginCredentials, 
  RegisterData, 
  AuthResponse, 
  User, 
  ProfileData, 
  Profile,
  UserRole,
  Pagination 
} from '@/types/auth'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1'

// Create axios instance with default config
export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  (error: AxiosError) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }

    const message = (error.response?.data as any)?.error || 'An error occurred'
    
    // Don't show toast for validation errors
    if (error.response?.status !== 400) {
      toast.error(message)
    }

    return Promise.reject(error)
  }
)

// API methods with TypeScript generics
export const authAPI = {
  login: (credentials: LoginCredentials) =>
    api.post<AuthResponse>('/auth/login', credentials),
  
  register: (userData: RegisterData) =>
    api.post<AuthResponse>('/auth/register', userData),
  
  getCurrentUser: () =>
    api.get<{ user: User }>('/auth/me'),
  
  updateProfile: (profileData: ProfileData) =>
    api.put<{ profile: Profile }>('/auth/profile', profileData),
}

export const usersAPI = {
  getUsers: (page: number = 1, limit: number = 10) =>
    api.get<{ users: User[]; pagination: Pagination }>(
      `/users?page=${page}&limit=${limit}`
    ),
  
  getUser: (id: string) =>
    api.get<{ user: User }>(`/users/${id}`),
  
  updateRole: (id: string, role: UserRole) =>
    api.patch<{ user: User }>(`/users/${id}/role`, { role }),
}

// Export React Query hooks
export { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
