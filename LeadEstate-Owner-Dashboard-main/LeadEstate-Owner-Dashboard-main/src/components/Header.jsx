import React, { useState } from 'react'
import { Menu, Bell, Search, Plus } from 'lucide-react'
import AddAgencyModal from './AddAgencyModal'
import NotificationsModal from './NotificationsModal'
import ProfileDropdown from './ProfileDropdown'

const Header = ({ setSidebarOpen }) => {
  const [showAddAgency, setShowAddAgency] = useState(false)
  const [showNotifications, setShowNotifications] = useState(false)
  const [showProfile, setShowProfile] = useState(false)

  const handleAddAgency = (agencyData) => {
    console.log('Creating new agency:', agencyData)
    // In real app, this would call API to create agency
    alert(`Agency "${agencyData.agencyName}" will be created with domain "${agencyData.domain}.yourdomain.com"`)
    setShowAddAgency(false)
  }
  return (
    <div className="sticky top-0 z-40 flex h-16 shrink-0 items-center gap-x-4 border-b border-gray-200 bg-white px-4 shadow-sm sm:gap-x-6 sm:px-6 lg:px-8">
      <button
        type="button"
        className="-m-2.5 p-2.5 text-gray-700 lg:hidden"
        onClick={() => setSidebarOpen(true)}
      >
        <span className="sr-only">Open sidebar</span>
        <Menu className="h-6 w-6" />
      </button>

      {/* Separator */}
      <div className="h-6 w-px bg-gray-200 lg:hidden" />

      <div className="flex flex-1 gap-x-2 sm:gap-x-4 self-stretch lg:gap-x-6">
        <div className="relative flex flex-1 items-center">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-4 w-4 sm:h-5 sm:w-5 text-gray-400" />
          </div>
          <input
            className="block w-full rounded-md border-0 bg-gray-50 py-1.5 pl-8 sm:pl-10 pr-3 text-gray-900 placeholder:text-gray-400 focus:bg-white focus:ring-2 focus:ring-primary-600 text-sm sm:leading-6"
            placeholder="Search agencies..."
            type="search"
          />
        </div>
        
        <div className="flex items-center gap-x-2 sm:gap-x-4 lg:gap-x-6">
          {/* Quick Actions */}
          <button
            type="button"
            onClick={() => setShowAddAgency(true)}
            className="inline-flex items-center gap-x-1 sm:gap-x-1.5 rounded-md bg-primary-600 px-2 sm:px-3 py-1.5 sm:py-2 text-xs sm:text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <Plus className="-ml-0.5 h-4 w-4 sm:h-5 sm:w-5" />
            <span className="hidden sm:inline">New Agency</span>
            <span className="sm:hidden">Add</span>
          </button>

          {/* Notifications */}
          <button
            type="button"
            onClick={() => setShowNotifications(true)}
            className="relative -m-2.5 p-2.5 text-gray-400 hover:text-gray-500"
          >
            <span className="sr-only">View notifications</span>
            <Bell className="h-6 w-6" />
            <span className="absolute -top-1 -right-1 h-4 w-4 rounded-full bg-red-500 flex items-center justify-center">
              <span className="text-xs font-medium text-white">3</span>
            </span>
          </button>

          {/* Separator */}
          <div className="hidden lg:block lg:h-6 lg:w-px lg:bg-gray-200" />

          {/* Profile dropdown */}
          <div className="relative">
            <button
              type="button"
              onClick={() => setShowProfile(!showProfile)}
              className="-m-1.5 flex items-center p-1.5"
            >
              <span className="sr-only">Open user menu</span>
              <div className="h-8 w-8 rounded-full bg-primary-100 flex items-center justify-center">
                <span className="text-sm font-medium text-primary-600">SA</span>
              </div>
              <span className="hidden lg:flex lg:items-center">
                <span className="ml-4 text-sm font-semibold leading-6 text-gray-900">
                  System Admin
                </span>
              </span>
            </button>
            <ProfileDropdown
              isOpen={showProfile}
              onClose={() => setShowProfile(false)}
            />
          </div>
        </div>
      </div>

      {/* Modals */}
      <AddAgencyModal
        isOpen={showAddAgency}
        onClose={() => setShowAddAgency(false)}
        onSubmit={handleAddAgency}
      />

      <NotificationsModal
        isOpen={showNotifications}
        onClose={() => setShowNotifications(false)}
      />
    </div>
  )
}

export default Header
