import React from 'react'
import { Outlet } from 'react-router-dom'
import Header from './Header'
import Footer from './Footer'
import { useAuth } from '@/contexts/AuthContext'

const Layout: React.FC = () => {
  const { isAuthenticated } = useAuth()

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <Header />
      <main className="flex-1 py-8">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Outlet />
        </div>
      </main>
      <Footer />
    </div>
  )
}

export default Layout