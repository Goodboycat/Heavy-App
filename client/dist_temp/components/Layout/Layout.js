import { jsx as _jsx, jsxs as _jsxs } from "react/jsx-runtime";
import { Outlet } from 'react-router-dom';
import Header from './Header';
import Footer from './Footer';
import { useAuth } from '@/contexts/AuthContext';
const Layout = () => {
    const { isAuthenticated } = useAuth();
    return (_jsxs("div", { className: "min-h-screen bg-gray-50 flex flex-col", children: [_jsx(Header, {}), _jsx("main", { className: "flex-1 py-8", children: _jsx("div", { className: "max-w-7xl mx-auto px-4 sm:px-6 lg:px-8", children: _jsx(Outlet, {}) }) }), _jsx(Footer, {})] }));
};
export default Layout;
