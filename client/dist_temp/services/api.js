import axios from 'axios';
import toast from 'react-hot-toast';
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000/api/v1';
// Create axios instance with default config
export const api = axios.create({
    baseURL: API_BASE_URL,
    timeout: 10000,
    headers: {
        'Content-Type': 'application/json',
    },
});
// Request interceptor to add auth token
api.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});
// Response interceptor for error handling
api.interceptors.response.use((response) => response, (error) => {
    if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
    }
    const message = error.response?.data?.error || 'An error occurred';
    // Don't show toast for validation errors
    if (error.response?.status !== 400) {
        toast.error(message);
    }
    return Promise.reject(error);
});
// API methods with TypeScript generics
export const authAPI = {
    login: (credentials) => api.post('/auth/login', credentials),
    register: (userData) => api.post('/auth/register', userData),
    getCurrentUser: () => api.get('/auth/me'),
    updateProfile: (profileData) => api.put('/auth/profile', profileData),
};
export const usersAPI = {
    getUsers: (page = 1, limit = 10) => api.get(`/users?page=${page}&limit=${limit}`),
    getUser: (id) => api.get(`/users/${id}`),
    updateRole: (id, role) => api.patch(`/users/${id}/role`, { role }),
};
// React Query hooks
export { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
