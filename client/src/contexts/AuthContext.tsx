import React, { createContext, useContext, useReducer, useEffect } from 'react'
import { authAPI } from '@/services/api'
import type { User, AuthState, AuthAction, RegisterData, ProfileData } from '@/types/auth'

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>
  register: (userData: RegisterData) => Promise<void>
  logout: () => void
  updateProfile: (profileData: ProfileData) => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Auth reducer for complex state management
const authReducer = (state: AuthState, action: AuthAction): AuthState => {
  switch (action.type) {
    case 'AUTH_START':
      return { ...state, isLoading: true, error: null }
    case 'AUTH_SUCCESS':
      return {
        ...state,
        isLoading: false,
        user: action.payload.user,
        token: action.payload.token,
        isAuthenticated: true,
        error: null,
      }
    case 'AUTH_FAILURE':
      return {
        ...state,
        isLoading: false,
        user: null,
        token: null,
        isAuthenticated: false,
        error: action.payload,
      }
    case 'AUTH_LOGOUT':
      return {
        isLoading: false,
        user: null,
        token: null,
        isAuthenticated: false,
        error: null,
      }
    case 'UPDATE_PROFILE':
      return {
        ...state,
        user: state.user ? {
          ...state.user,
          profile: { ...state.user.profile, ...action.payload }
        } : null,
      }
    case 'CLEAR_ERROR':
      return { ...state, error: null }
    default:
      return state
  }
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem('token'),
  isAuthenticated: false,
  isLoading: true,
  error: null,
}

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [state, dispatch] = useReducer(authReducer, initialState)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('token')
    if (!token) {
      dispatch({ type: 'AUTH_LOGOUT' })
      return
    }

    try {
      dispatch({ type: 'AUTH_START' })
      const response = await authAPI.getCurrentUser()
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: {
          user: response.data.user,
          token: token,
        },
      })
    } catch (error) {
      localStorage.removeItem('token')
      dispatch({ type: 'AUTH_FAILURE', payload: 'Authentication failed' })
    }
  }

  const login = async (email: string, password: string) => {
    try {
      dispatch({ type: 'AUTH_START' })
      const response = await authAPI.login({ email, password })
      const { user, token } = response.data

      localStorage.setItem('token', token)
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      })
    } catch (error: any) {
      const message = error.response?.data?.error || 'Login failed'
      dispatch({ type: 'AUTH_FAILURE', payload: message })
      throw error
    }
  }

  const register = async (userData: RegisterData) => {
    try {
      dispatch({ type: 'AUTH_START' })
      const response = await authAPI.register(userData)
      const { user, token } = response.data

      localStorage.setItem('token', token)
      dispatch({
        type: 'AUTH_SUCCESS',
        payload: { user, token },
      })
    } catch (error: any) {
      const message = error.response?.data?.error || 'Registration failed'
      dispatch({ type: 'AUTH_FAILURE', payload: message })
      throw error
    }
  }

  const logout = () => {
    localStorage.removeItem('token')
    dispatch({ type: 'AUTH_LOGOUT' })
  }

  const updateProfile = async (profileData: ProfileData) => {
    try {
      const response = await authAPI.updateProfile(profileData)
      dispatch({
        type: 'UPDATE_PROFILE',
        payload: response.data.profile,
      })
    } catch (error: any) {
      const message = error.response?.data?.error || 'Profile update failed'
      dispatch({ type: 'AUTH_FAILURE', payload: message })
      throw error
    }
  }

  const value: AuthContextType = {
    ...state,
    login,
    register,
    logout,
    updateProfile,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
