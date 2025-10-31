import { jsx as _jsx } from "react/jsx-runtime";
import { createContext, useContext, useReducer, useEffect } from 'react';
import { authAPI } from '@/services/api';
const AuthContext = createContext(undefined);
// Auth reducer for complex state management
const authReducer = (state, action) => {
    switch (action.type) {
        case 'AUTH_START':
            return { ...state, isLoading: true, error: null };
        case 'AUTH_SUCCESS':
            return {
                ...state,
                isLoading: false,
                user: action.payload.user,
                token: action.payload.token,
                isAuthenticated: true,
                error: null,
            };
        case 'AUTH_FAILURE':
            return {
                ...state,
                isLoading: false,
                user: null,
                token: null,
                isAuthenticated: false,
                error: action.payload,
            };
        case 'AUTH_LOGOUT':
            return {
                isLoading: false,
                user: null,
                token: null,
                isAuthenticated: false,
                error: null,
            };
        case 'UPDATE_PROFILE':
            return {
                ...state,
                user: state.user ? {
                    ...state.user,
                    profile: { ...state.user.profile, ...action.payload }
                } : null,
            };
        case 'CLEAR_ERROR':
            return { ...state, error: null };
        default:
            return state;
    }
};
const initialState = {
    user: null,
    token: localStorage.getItem('token'),
    isAuthenticated: false,
    isLoading: true,
    error: null,
};
export const AuthProvider = ({ children }) => {
    const [state, dispatch] = useReducer(authReducer, initialState);
    useEffect(() => {
        checkAuth();
    }, []);
    const checkAuth = async () => {
        const token = localStorage.getItem('token');
        if (!token) {
            dispatch({ type: 'AUTH_LOGOUT' });
            return;
        }
        try {
            dispatch({ type: 'AUTH_START' });
            const response = await authAPI.getCurrentUser();
            dispatch({
                type: 'AUTH_SUCCESS',
                payload: {
                    user: response.data.user,
                    token: token,
                },
            });
        }
        catch (error) {
            localStorage.removeItem('token');
            dispatch({ type: 'AUTH_FAILURE', payload: 'Authentication failed' });
        }
    };
    const login = async (email, password) => {
        try {
            dispatch({ type: 'AUTH_START' });
            const response = await authAPI.login({ email, password });
            const { user, token } = response.data;
            localStorage.setItem('token', token);
            dispatch({
                type: 'AUTH_SUCCESS',
                payload: { user, token },
            });
        }
        catch (error) {
            const message = error.response?.data?.error || 'Login failed';
            dispatch({ type: 'AUTH_FAILURE', payload: message });
            throw error;
        }
    };
    const register = async (userData) => {
        try {
            dispatch({ type: 'AUTH_START' });
            const response = await authAPI.register(userData);
            const { user, token } = response.data;
            localStorage.setItem('token', token);
            dispatch({
                type: 'AUTH_SUCCESS',
                payload: { user, token },
            });
        }
        catch (error) {
            const message = error.response?.data?.error || 'Registration failed';
            dispatch({ type: 'AUTH_FAILURE', payload: message });
            throw error;
        }
    };
    const logout = () => {
        localStorage.removeItem('token');
        dispatch({ type: 'AUTH_LOGOUT' });
    };
    const updateProfile = async (profileData) => {
        try {
            const response = await authAPI.updateProfile(profileData);
            dispatch({
                type: 'UPDATE_PROFILE',
                payload: response.data.profile,
            });
        }
        catch (error) {
            const message = error.response?.data?.error || 'Profile update failed';
            dispatch({ type: 'AUTH_FAILURE', payload: message });
            throw error;
        }
    };
    const value = {
        ...state,
        login,
        register,
        logout,
        updateProfile,
    };
    return _jsx(AuthContext.Provider, { value: value, children: children });
};
export const useAuth = () => {
    const context = useContext(AuthContext);
    if (context === undefined) {
        throw new Error('useAuth must be used within an AuthProvider');
    }
    return context;
};
