import React from 'react'
import { X, Bell, AlertCircle, CheckCircle, Info, Clock } from 'lucide-react'

const NotificationsModal = ({ isOpen, onClose }) => {
  const notifications = [
    {
      id: 1,
      type: 'warning',
      title: 'Server Maintenance Scheduled',
      message: 'Scheduled maintenance tonight at 2:00 AM EST. All agencies will be notified.',
      time: '1 hour ago',
      read: false
    },
    {
      id: 2,
      type: 'success',
      title: 'New Agency Onboarded',
      message: 'Sunset Properties has been successfully set up and is now active.',
      time: '3 hours ago',
      read: false
    },
    {
      id: 3,
      type: 'error',
      title: 'Database Connection Issue',
      message: 'Temporary connection timeout for agency ID 5. Issue resolved automatically.',
      time: '5 hours ago',
      read: true
    },
    {
      id: 4,
      type: 'info',
      title: 'Monthly Billing Completed',
      message: 'All agency subscriptions have been processed successfully.',
      time: '1 day ago',
      read: true
    },
    {
      id: 5,
      type: 'warning',
      title: 'High Memory Usage',
      message: 'Server 2 is experiencing high memory usage. Consider scaling resources.',
      time: '2 days ago',
      read: true
    }
  ]

  const getIcon = (type) => {
    switch (type) {
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case 'error':
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case 'info':
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <Bell className="h-5 w-5 text-gray-500" />
    }
  }

  const getBgColor = (type, read) => {
    if (read) return 'bg-white'
    
    switch (type) {
      case 'warning':
        return 'bg-yellow-50'
      case 'success':
        return 'bg-green-50'
      case 'error':
        return 'bg-red-50'
      case 'info':
        return 'bg-blue-50'
      default:
        return 'bg-gray-50'
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-start justify-center p-2 sm:p-4 pt-12 sm:pt-16">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-lg shadow-xl max-w-md w-full mx-2 sm:mx-4">
          <div className="flex items-center justify-between p-3 sm:p-4 border-b border-gray-200">
            <div className="flex items-center space-x-2 min-w-0 flex-1">
              <Bell className="h-4 w-4 sm:h-5 sm:w-5 text-gray-600 flex-shrink-0" />
              <h3 className="text-base sm:text-lg font-medium text-gray-900 truncate">Notifications</h3>
              <span className="inline-flex items-center rounded-full bg-red-100 px-2 sm:px-2.5 py-0.5 text-xs font-medium text-red-800 flex-shrink-0">
                3 new
              </span>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2"
            >
              <X className="h-4 w-4 sm:h-5 sm:w-5" />
            </button>
          </div>

          <div className="max-h-96 overflow-y-auto">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                className={`p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer ${getBgColor(notification.type, notification.read)}`}
              >
                <div className="flex space-x-3">
                  <div className="flex-shrink-0">
                    {getIcon(notification.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className={`text-sm font-medium ${notification.read ? 'text-gray-700' : 'text-gray-900'}`}>
                        {notification.title}
                      </p>
                      {!notification.read && (
                        <div className="h-2 w-2 bg-primary-600 rounded-full"></div>
                      )}
                    </div>
                    <p className={`text-sm mt-1 ${notification.read ? 'text-gray-500' : 'text-gray-700'}`}>
                      {notification.message}
                    </p>
                    <div className="flex items-center mt-2 text-xs text-gray-500">
                      <Clock className="h-3 w-3 mr-1" />
                      {notification.time}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="p-4 border-t border-gray-200 bg-gray-50">
            <div className="flex justify-between items-center">
              <button className="text-sm text-primary-600 hover:text-primary-700 font-medium">
                Mark all as read
              </button>
              <button className="text-sm text-gray-600 hover:text-gray-700">
                View all notifications
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotificationsModal
