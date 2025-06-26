import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Sidebar from './components/Sidebar'
import Header from './components/Header'
import Dashboard from './pages/Dashboard'
import Agencies from './pages/Agencies'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Support from './pages/Support'

function App() {
  const [sidebarOpen, setSidebarOpen] = useState(false)

  return (
    <Router>
      <div className="min-h-screen bg-gray-50 flex">
        {/* Sidebar */}
        <Sidebar sidebarOpen={sidebarOpen} setSidebarOpen={setSidebarOpen} />
        
        {/* Main content */}
        <div className="flex-1 flex flex-col lg:pl-64">
          <Header setSidebarOpen={setSidebarOpen} />

          <main className="flex-1 py-4 sm:py-6">
            <div className="mx-auto max-w-7xl px-2 sm:px-4 lg:px-8">
              <Routes>
                <Route path="/" element={<Dashboard />} />
                <Route path="/agencies" element={<Agencies />} />
                <Route path="/analytics" element={<Analytics />} />
                <Route path="/settings" element={<Settings />} />
                <Route path="/support" element={<Support />} />
              </Routes>
            </div>
          </main>
        </div>
      </div>
    </Router>
  )
}

export default App
