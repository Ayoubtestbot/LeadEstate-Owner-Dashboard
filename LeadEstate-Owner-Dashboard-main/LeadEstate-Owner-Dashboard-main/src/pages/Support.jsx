import React from 'react'
import { 
  MessageSquare, 
  Mail, 
  Phone, 
  AlertCircle, 
  CheckCircle, 
  Clock,
  ExternalLink,
  Download,
  FileText
} from 'lucide-react'

const Support = () => {
  const tickets = [
    {
      id: 'TICK-001',
      agency: 'Premier Realty Group',
      subject: 'WhatsApp integration not working',
      status: 'open',
      priority: 'high',
      created: '2 hours ago',
      lastUpdate: '30 minutes ago'
    },
    {
      id: 'TICK-002',
      agency: 'Urban Properties',
      subject: 'CSV import failing for large files',
      status: 'in-progress',
      priority: 'medium',
      created: '1 day ago',
      lastUpdate: '4 hours ago'
    },
    {
      id: 'TICK-003',
      agency: 'Coastal Homes',
      subject: 'Custom branding request',
      status: 'resolved',
      priority: 'low',
      created: '3 days ago',
      lastUpdate: '1 day ago'
    }
  ]

  const systemLogs = [
    {
      id: 1,
      type: 'error',
      message: 'Database connection timeout for agency ID 5',
      timestamp: '2024-03-15 14:30:22',
      agency: 'Sunset Properties'
    },
    {
      id: 2,
      type: 'warning',
      message: 'High memory usage detected on server 2',
      timestamp: '2024-03-15 14:25:15',
      agency: 'System'
    },
    {
      id: 3,
      type: 'info',
      message: 'Backup completed successfully for all agencies',
      timestamp: '2024-03-15 14:00:00',
      agency: 'System'
    },
    {
      id: 4,
      type: 'success',
      message: 'New agency onboarding completed',
      timestamp: '2024-03-15 13:45:30',
      agency: 'Downtown Realty'
    }
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case 'open':
        return 'bg-red-100 text-red-800'
      case 'in-progress':
        return 'bg-yellow-100 text-yellow-800'
      case 'resolved':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'high':
        return 'bg-red-100 text-red-800'
      case 'medium':
        return 'bg-yellow-100 text-yellow-800'
      case 'low':
        return 'bg-green-100 text-green-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getLogIcon = (type) => {
    switch (type) {
      case 'error':
        return <AlertCircle className="h-4 w-4 text-red-500" />
      case 'warning':
        return <AlertCircle className="h-4 w-4 text-yellow-500" />
      case 'success':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      default:
        return <Clock className="h-4 w-4 text-blue-500" />
    }
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
          Support & Monitoring
        </h1>
        <p className="mt-2 text-sm text-gray-600">
          Monitor system health, manage support tickets, and access system logs.
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg shadow hover:shadow-md transition-shadow">
          <div>
            <span className="rounded-lg inline-flex p-3 bg-primary-50 text-primary-600 group-hover:bg-primary-100">
              <MessageSquare className="h-6 w-6" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">
              <span className="absolute inset-0" />
              Live Chat
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Start a live chat session with agencies
            </p>
          </div>
        </button>

        <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg shadow hover:shadow-md transition-shadow">
          <div>
            <span className="rounded-lg inline-flex p-3 bg-green-50 text-green-600 group-hover:bg-green-100">
              <Mail className="h-6 w-6" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">
              <span className="absolute inset-0" />
              Send Broadcast
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Send announcements to all agencies
            </p>
          </div>
        </button>

        <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg shadow hover:shadow-md transition-shadow">
          <div>
            <span className="rounded-lg inline-flex p-3 bg-orange-50 text-orange-600 group-hover:bg-orange-100">
              <Download className="h-6 w-6" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">
              <span className="absolute inset-0" />
              Export Logs
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Download system logs for analysis
            </p>
          </div>
        </button>

        <button className="relative group bg-white p-6 focus-within:ring-2 focus-within:ring-inset focus-within:ring-primary-500 rounded-lg shadow hover:shadow-md transition-shadow">
          <div>
            <span className="rounded-lg inline-flex p-3 bg-purple-50 text-purple-600 group-hover:bg-purple-100">
              <FileText className="h-6 w-6" />
            </span>
          </div>
          <div className="mt-4">
            <h3 className="text-lg font-medium text-gray-900">
              <span className="absolute inset-0" />
              Documentation
            </h3>
            <p className="mt-2 text-sm text-gray-500">
              Access system documentation
            </p>
          </div>
        </button>
      </div>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Support Tickets */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">Recent Support Tickets</h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {tickets.map((ticket) => (
                  <li key={ticket.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-8 w-8 bg-gray-100 rounded-full flex items-center justify-center">
                          <span className="text-xs font-medium text-gray-600">{ticket.id.split('-')[1]}</span>
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm font-medium text-gray-900 truncate">{ticket.subject}</p>
                        <p className="text-sm text-gray-500">{ticket.agency}</p>
                        <p className="text-xs text-gray-400">Created {ticket.created}</p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="flex flex-col space-y-1">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getStatusColor(ticket.status)}`}>
                            {ticket.status}
                          </span>
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPriorityColor(ticket.priority)}`}>
                            {ticket.priority}
                          </span>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                View all tickets
              </button>
            </div>
          </div>
        </div>

        {/* System Logs */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">System Logs</h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {systemLogs.map((log) => (
                  <li key={log.id} className="py-4">
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        {getLogIcon(log.type)}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900">{log.message}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          <p className="text-xs text-gray-500">{log.agency}</p>
                          <span className="text-xs text-gray-400">•</span>
                          <p className="text-xs text-gray-500">{log.timestamp}</p>
                        </div>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <button className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                View full logs
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* System Status */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">System Status</h3>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <div className="text-center">
              <div className="text-2xl font-bold text-green-600">99.9%</div>
              <div className="text-sm text-gray-500">Uptime</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-blue-600">24</div>
              <div className="text-sm text-gray-500">Active Agencies</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-orange-600">3</div>
              <div className="text-sm text-gray-500">Open Tickets</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-bold text-purple-600">45ms</div>
              <div className="text-sm text-gray-500">Avg Response</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Support
