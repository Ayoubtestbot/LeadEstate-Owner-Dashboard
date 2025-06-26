import React, { useState, useRef, useEffect } from 'react'
import { User, Settings, LogOut, Shield, HelpCircle } from 'lucide-react'

const ProfileDropdown = ({ isOpen, onClose }) => {
  const dropdownRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        onClose()
      }
    }

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [isOpen, onClose])

  const menuItems = [
    {
      icon: User,
      label: 'Your Profile',
      action: () => console.log('Profile clicked')
    },
    {
      icon: Settings,
      label: 'Account Settings',
      action: () => console.log('Settings clicked')
    },
    {
      icon: Shield,
      label: 'Security',
      action: () => console.log('Security clicked')
    },
    {
      icon: HelpCircle,
      label: 'Help & Support',
      action: () => console.log('Help clicked')
    },
    {
      icon: LogOut,
      label: 'Sign Out',
      action: () => console.log('Sign out clicked'),
      danger: true
    }
  ]

  if (!isOpen) return null

  return (
    <div
      ref={dropdownRef}
      className="absolute right-0 top-full mt-2 w-56 rounded-md bg-white shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
    >
      <div className="py-1">
        {/* User Info */}
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center space-x-3">
            <div className="h-10 w-10 rounded-full bg-primary-100 flex items-center justify-center">
              <span className="text-sm font-medium text-primary-600">SA</span>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-900">System Admin</p>
              <p className="text-xs text-gray-500">admin@realestatepro.com</p>
            </div>
          </div>
        </div>

        {/* Menu Items */}
        {menuItems.map((item, index) => (
          <button
            key={index}
            onClick={() => {
              item.action()
              onClose()
            }}
            className={`w-full text-left px-4 py-2 text-sm flex items-center space-x-3 hover:bg-gray-100 transition-colors ${
              item.danger ? 'text-red-700 hover:bg-red-50' : 'text-gray-700'
            }`}
          >
            <item.icon className={`h-4 w-4 ${item.danger ? 'text-red-500' : 'text-gray-400'}`} />
            <span>{item.label}</span>
          </button>
        ))}
      </div>
    </div>
  )
}

export default ProfileDropdown
