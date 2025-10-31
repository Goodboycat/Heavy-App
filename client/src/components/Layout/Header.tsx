import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { 
  Code2, 
  Menu, 
  X, 
  User, 
  Settings, 
  LogOut,
  Shield 
} from 'lucide-react'
import { useAuth } from '@/contexts/AuthContext'
import { cn } from '@/utils/cn'

const Header: React.FC = () => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [isProfileMenuOpen, setIsProfileMenuOpen] = useState(false)
  const { user, logout, isAuthenticated } = useAuth()
  const location = useLocation()

  const navigation = [
    { name: 'Home', href: '/', current: location.pathname === '/' },
    { name: 'Dashboard', href: '/dashboard', current: location.pathname === '/dashboard', protected: true },
    { name: 'Admin', href: '/admin', current: location.pathname === '/admin', protected: true, admin: true },
  ]

  const filteredNavigation = navigation.filter(item => {
    if (!isAuthenticated && item.protected) return false
    if (item.admin && user?.role !== 'ADMIN' && user?.role !== 'SUPER_ADMIN') return false
    return true
  })

  const handleLogout = () => {
    logout()
    setIsProfileMenuOpen(false)
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200">
      <nav className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Code2 className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">HaevyApp</span>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            {filteredNavigation.map((item) => (
              <Link
                key={item.name}
                to={item.href}
                className={cn(
                  'relative px-3 py-2 text-sm font-medium transition-colors duration-200',
                  item.current
                    ? 'text-primary-600'
                    : 'text-gray-500 hover:text-gray-900'
                )}
              >
                {item.name}
                {item.current && (
                  <motion.div
                    layoutId="activeTab"
                    className="absolute inset-x-0 bottom-0 h-0.5 bg-primary-600"
                    transition={{ type: 'spring', stiffness: 300, damping: 30 }}
                  />
                )}
              </Link>
            ))}
          </div>

          {/* Desktop Auth Section */}
          <div className="hidden md:flex items-center space-x-4">
            {isAuthenticated ? (
              <div className="relative">
                <button
                  onClick={() => setIsProfileMenuOpen(!isProfileMenuOpen)}
                  className="flex items-center space-x-2 p-2 rounded-lg hover:bg-gray-100 transition-colors duration-200"
                >
                  <div className="w-8 h-8 bg-primary-100 rounded-full flex items-center justify-center">
                    <User className="h-4 w-4 text-primary-600" />
                  </div>
                  <span className="text-sm font-medium text-gray-700">
                    {user?.profile?.firstName || user?.username}
                  </span>
                </button>

                <AnimatePresence>
                  {isProfileMenuOpen && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.1 }}
                      className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50"
                    >
                      <Link
                        to="/profile"
                        onClick={() => setIsProfileMenuOpen(false)}
                        className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="h-4 w-4 mr-2" />
                        Profile
                      </Link>
                      {(user?.role === 'ADMIN' || user?.role === 'SUPER_ADMIN') && (
                        <Link
                          to="/admin"
                          onClick={() => setIsProfileMenuOpen(false)}
                          className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        >
                          <Shield className="h-4 w-4 mr-2" />
                          Admin
                        </Link>
                      )}
                      <button
                        onClick={handleLogout}
                        className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign out
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ) : (
              <div className="flex items-center space-x-3">
                <Link
                  to="/login"
                  className="text-gray-500 hover:text-gray-900 px-3 py-2 text-sm font-medium"
                >
                  Sign in
                </Link>
                <Link
                  to="/register"
                  className="bg-primary-600 text-white hover:bg-primary-700 px-4 py-2 rounded-lg text-sm font-medium transition-colors duration-200"
                >
                  Get started
                </Link>
              </div>
            )}
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            <button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="p-2 rounded-lg text-gray-500 hover:text-gray-900 hover:bg-gray-100 transition-colors duration-200"
            >
              {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Navigation */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.2 }}
              className="md:hidden border-t border-gray-200 py-4"
            >
              <div className="flex flex-col space-y-4">
                {filteredNavigation.map((item) => (
                  <Link
                    key={item.name}
                    to={item.href}
                    onClick={() => setIsMobileMenuOpen(false)}
                    className={cn(
                      'px-3 py-2 text-base font-medium rounded-lg transition-colors duration-200',
                      item.current
                        ? 'text-primary-600 bg-primary-50'
                        : 'text-gray-500 hover:text-gray-900 hover:bg-gray-100'
                    )}
                  >
                    {item.name}
                  </Link>
                ))}
                {isAuthenticated ? (
                  <>
                    <Link
                      to="/profile"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="px-3 py-2 text-base font-medium text-left text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      Sign out
                    </button>
                  </>
                ) : (
                  <>
                    <Link
                      to="/login"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      Sign in
                    </Link>
                    <Link
                      to="/register"
                      onClick={() => setIsMobileMenuOpen(false)}
                      className="px-3 py-2 text-base font-medium text-primary-600 hover:text-primary-700 hover:bg-primary-50 rounded-lg transition-colors duration-200"
                    >
                      Get started
                    </Link>
                  </>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </nav>
    </header>
  )
}

export default Header