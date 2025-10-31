import { jsx as _jsx, jsxs as _jsxs, Fragment as _Fragment } from "react/jsx-runtime";
import { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Code2, Menu, X, User, LogOut, Shield } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/utils/cn';
const Header = () => {
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
    const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false);
    const { user, logout, isAuthenticated } = useAuth();
    const location = useLocation();
    const navigation = [
        { name: 'Home', href: '/', current: location.pathname === '/' },
        { name: 'Dashboard', href: '/dashboard', current: location.pathname === '/dashboard', protected: true },
        { name: 'Admin', href: '/admin', current: location.pathname === '/admin', protected: true, admin: true },
    ];
    const filteredNavigation = navigation.filter(item => {
        if (!isAuthenticated && item.protected)
            return false;
        if (item.admin && user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN')
            return false;
        return true;
    });
    const handleLogout = () => {
        logout();
        setIsProfileMenuOpen(false);
    };
    return (_jsx("header", { className: "bg-white shadow-sm border-b border-gray-200", children: _jsxs("nav", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: [_jsxs("div", { className: "flex justify-between h-16", children: [_jsx("div", { className: "flex items-center", children: _jsxs(Link, { to: "/", className: "flex items-center space-x-2", children: [_jsx(Code2, { className: "h-8 w-8 text-primary-600" }), _jsx("span", { className: "text-xl font-bold text-gray-900", children: "HaevyApp" })] }) }), _jsx("div", { className: "hidden md:flex items-center space-x-8", children: filteredNavigation.map((item) => (_jsxs(Link, { to: item.href, className: cn('relative px-3 py-2 text-sm font-medium transition-colors duration-200', item.current
                                    ? 'text-primary-600'
                                    : 'text-gray-500 hover:text-gray-900'), children: [item.name, item.current && (_jsx(motion.div, { layoutId: "activeTab", className: "absolute inset-x-0 bottom-0 h-0.5 bg-primary-600", transition: { type: 'spring', stiffness: 300, damping: 30 } }))] }, item.name))) }), _jsx("div", { className: "hidden md:flex items-center space-x-4", children: isAuthenticated ? (_jsxs("div", { className: "relative", children: [_jsxs("button", { onClick: () => setIsProfileMenuOpen(!isProfileMenuOpen), className: "flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200", children: [_jsx("div", { className: "w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center", children: _jsx(User, { className: "h-4 w-4 text-primary-600" }) }), _jsx("span", { className: "text-sm font-medium text-gray-700", children: user?.profile?.firstName || user?.username })] }), _jsx(AnimatePresence, { children: isProfileMenuOpen && (_jsxs(motion.div, { initial: { opacity: 0, scale: 0.95, y: -10 }, animate: { opacity: 1, scale: 1, y: 0 }, exit: { opacity: 0, scale: 0.95, y: -10 }, transition: { duration: 0.1 }, className: "absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50", children: [_jsxs(Link, { to: "/profile", onClick: () => setIsProfileMenuOpen(false), className: "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50", children: [_jsx(User, { className: "h-4 w-4 mr-2" }), "Profile"] }), (user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (_jsxs(Link, { to: "/admin", onClick: () => setIsProfileMenuOpen(false), className: "flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50", children: [_jsx(Shield, { className: "h-4 w-4 mr-2" }), "Admin"] })), _jsxs("button", { onClick: handleLogout, className: "flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50", children: [_jsx(LogOut, { className: "h-4 w-4 mr-2" }), "Sign out"] })] })) })] })) : (_jsxs("div", { className: "flex items-center space-x-3", children: [_jsx(Link, { to: "/login", className: "text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium", children: "Sign in" }), _jsx(Link, { to: "/register", className: "bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200", children: "Get started" })] })) }), _jsx("div", { className: "md:hidden flex items-center", children: _jsx("button", { onClick: () => setIsMobileMenuOpen(!isMobileMenuOpen), className: "p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200", children: isMobileMenuOpen ? _jsx(X, { className: "h-6 w-6" }) : _jsx(Menu, { className: "h-6 w-6" }) }) })] }), _jsx(AnimatePresence, { children: isMobileMenuOpen && (_jsx(motion.div, { initial: { opacity: 0, height: 0 }, animate: { opacity: 1, height: 'auto' }, exit: { opacity: 0, height: 0 }, transition: { duration: 0.2 }, className: "md:hidden border-t border-gray-200 py-4", children: _jsxs("div", { className: "flex flex-col space-y-4", children: [filteredNavigation.map((item) => (_jsx(Link, { to: item.href, onClick: () => setIsMobileMenuOpen(false), className: cn('px-3 py-2 text-base font-medium rounded-lg transition-colors duration-200', item.current
                                        ? 'text-primary-600 bg-primary-50'
                                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'), children: item.name }, item.name))), isAuthenticated ? (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/profile", onClick: () => setIsMobileMenuOpen(false), className: "px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200", children: "Profile" }), _jsx("button", { onClick: handleLogout, className: "px-3 py-2 text-base font-medium text-left text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200", children: "Sign out" })] })) : (_jsxs(_Fragment, { children: [_jsx(Link, { to: "/login", onClick: () => setIsMobileMenuOpen(false), className: "px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200", children: "Sign in" }), _jsx(Link, { to: "/register", onClick: () => setIsMobileMenuOpen(false), className: "px-3 py-2 text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors duration-200", children: "Get started" })] }))] }) })) })] }) }));
};
export default Header;
