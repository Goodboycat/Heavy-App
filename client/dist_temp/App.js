import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Layout from './components/Layout/Layout';
import ProtectedRoute from './components/Auth/ProtectedRoute';
import { useAuth } from './contexts/AuthContext';
// Lazy load pages for code splitting
const Home = React.lazy(() => import('./pages/Home'));
const Login = React.lazy(() => import('./pages/Login'));
const Register = React.lazy(() => import('./pages/Register'));
const Dashboard = React.lazy(() => import('./pages/Dashboard'));
const Profile = React.lazy(() => import('./pages/Profile'));
const Admin = React.lazy(() => import('./pages/Admin'));
const NotFound = React.lazy(() => import('./pages/NotFound'));
function App() {
    const { user, isLoading } = useAuth();
    if (isLoading) {
        return (_jsx("div", { className: "min-h-screen flex items-center justify-center", children: _jsx("div", { className: "animate-spin rounded-full h-32 w-32 border-b-2 border-primary-600" }) }));
    }
    return (_jsxs(_Fragment, { children: [_jsx(Routes, { children: _jsxs(Route, { path: "/", element: _jsx(Layout, {}), children: [_jsx(Route, { index: true, element: _jsx(Home, {}) }), _jsx(Route, { path: "login", element: _jsx(Login, {}) }), _jsx(Route, { path: "register", element: _jsx(Register, {}) }), _jsx(Route, { path: "dashboard", element: _jsx(ProtectedRoute, { children: _jsx(Dashboard, {}) }) }), _jsx(Route, { path: "profile", element: _jsx(ProtectedRoute, { children: _jsx(Profile, {}) }) }), _jsx(Route, { path: "admin", element: _jsx(ProtectedRoute, { requireAdmin: true, children: _jsx(Admin, {}) }) }), _jsx(Route, { path: "*", element: _jsx(NotFound, {}) })] }) }), _jsx(Toaster, { position: "top-right", toastOptions: {
                    duration: 5000,
                    style: {
                        background: '#363636',
                        color: '#fff',
                    },
                    success: {
                        duration: 3000,
                        iconTheme: {
                            primary: '#10B981',
                            secondary: '#fff',
                        },
                    },
                    error: {
                        duration: 5000,
                        iconTheme: {
                            primary: '#EF4444',
                            secondary: '#fff',
                        },
                    },
                } })] }));
}
export default App;
