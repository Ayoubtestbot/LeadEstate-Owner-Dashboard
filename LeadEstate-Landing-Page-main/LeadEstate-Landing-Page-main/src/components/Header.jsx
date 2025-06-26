import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import { Menu, X, Home } from 'lucide-react'

const Header = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false)

  const navigation = [
    { name: 'Home', href: '/' },
    { name: 'Features', href: '/features' },
    { name: 'Pricing', href: '/pricing' },
    { name: 'Contact', href: '/contact' },
  ]

  return (
    <header className="bg-white shadow-sm">
      <nav className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8" aria-label="Top">
        <div className="flex w-full items-center justify-between border-b border-indigo-500 py-6 lg:border-none">
          <div className="flex items-center">
            <Link to="/" className="flex items-center space-x-2">
              <Home className="h-8 w-8 text-primary-600" />
              <span className="text-xl font-bold text-gray-900">RealEstate Pro</span>
            </Link>
          </div>
          
          <div className="ml-10 hidden space-x-8 lg:block">
            {navigation.map((link) => (
              <Link
                key={link.name}
                to={link.href}
                className="text-base font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                {link.name}
              </Link>
            ))}
          </div>
          
          <div className="ml-10 hidden space-x-4 lg:block">
            <a
              href="http://localhost:5000"
              className="inline-block bg-primary-500 py-2 px-4 border border-transparent rounded-md text-base font-medium text-white hover:bg-primary-600 transition-colors"
            >
              Owner Dashboard
            </a>
          </div>
          
          <div className="ml-10 lg:hidden">
            <button
              type="button"
              className="inline-flex items-center justify-center rounded-md p-2 text-gray-400 hover:bg-gray-100 hover:text-gray-500"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
            >
              <span className="sr-only">Open main menu</span>
              {isMenuOpen ? (
                <X className="block h-6 w-6" aria-hidden="true" />
              ) : (
                <Menu className="block h-6 w-6" aria-hidden="true" />
              )}
            </button>
          </div>
        </div>
        
        {isMenuOpen && (
          <div className="lg:hidden">
            <div className="space-y-1 px-2 pt-2 pb-3">
              {navigation.map((link) => (
                <Link
                  key={link.name}
                  to={link.href}
                  className="block px-3 py-2 text-base font-medium text-gray-500 hover:text-gray-900"
                  onClick={() => setIsMenuOpen(false)}
                >
                  {link.name}
                </Link>
              ))}
              <a
                href="http://localhost:5000"
                className="block px-3 py-2 text-base font-medium bg-primary-500 text-white rounded-md hover:bg-primary-600"
              >
                Owner Dashboard
              </a>
            </div>
          </div>
        )}
      </nav>
    </header>
  )
}

export default Header
