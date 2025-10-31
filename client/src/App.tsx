import React from 'react'

function App() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center">
      <div className="text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          🚀 Haevy App
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Senior Full Stack Application
        </p>
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md mx-auto">
          <h2 className="text-2xl font-semibold text-gray-800 mb-4">
            Welcome!
          </h2>
          <p className="text-gray-600 mb-6">
            Your application is running successfully.
          </p>
          <div className="space-y-3 text-left">
            <div className="flex items-center text-green-600">
              <span className="w-2 h-2 bg-green-500 rounded-full mr-3"></span>
              React 18 + TypeScript
            </div>
            <div className="flex items-center text-blue-600">
              <span className="w-2 h-2 bg-blue-500 rounded-full mr-3"></span>
              Tailwind CSS
            </div>
            <div className="flex items-center text-purple-600">
              <span className="w-2 h-2 bg-purple-500 rounded-full mr-3"></span>
              Vite Build System
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default App
