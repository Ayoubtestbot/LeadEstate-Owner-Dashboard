import React from 'react'
import { Link } from 'react-router-dom'
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Activity,
  AlertCircle,
  CheckCircle,
  Clock,
  ArrowUpRight,
  ArrowDownRight
} from 'lucide-react'

const Dashboard = () => {
  // Mock data - in real app this would come from API
  const stats = [
    {
      name: 'Total Agencies',
      value: '24',
      change: '+12%',
      changeType: 'increase',
      icon: Building2,
      color: 'bg-blue-500'
    },
    {
      name: 'Active Users',
      value: '1,247',
      change: '+18%',
      changeType: 'increase',
      icon: Users,
      color: 'bg-green-500'
    },
    {
      name: 'Total Leads',
      value: '15,832',
      change: '+23%',
      changeType: 'increase',
      icon: TrendingUp,
      color: 'bg-purple-500'
    },
    {
      name: 'Monthly Revenue',
      value: '$47,800',
      change: '+8%',
      changeType: 'increase',
      icon: DollarSign,
      color: 'bg-orange-500'
    }
  ]

  const recentAgencies = [
    {
      id: 1,
      name: 'Premier Realty Group',
      status: 'active',
      users: 12,
      leads: 234,
      lastActive: '2 hours ago',
      plan: 'Professional'
    },
    {
      id: 2,
      name: 'Urban Properties',
      status: 'active',
      users: 8,
      leads: 156,
      lastActive: '5 hours ago',
      plan: 'Enterprise'
    },
    {
      id: 3,
      name: 'Coastal Homes',
      status: 'setup',
      users: 3,
      leads: 0,
      lastActive: '1 day ago',
      plan: 'Starter'
    },
    {
      id: 4,
      name: 'Downtown Realty',
      status: 'active',
      users: 15,
      leads: 389,
      lastActive: '30 minutes ago',
      plan: 'Enterprise'
    }
  ]

  const systemAlerts = [
    {
      id: 1,
      type: 'warning',
      message: 'Server maintenance scheduled for tonight at 2 AM EST',
      time: '1 hour ago'
    },
    {
      id: 2,
      type: 'success',
      message: 'New agency "Sunset Properties" successfully onboarded',
      time: '3 hours ago'
    },
    {
      id: 3,
      type: 'info',
      message: 'Monthly billing cycle completed for all agencies',
      time: '1 day ago'
    }
  ]

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl sm:text-2xl lg:text-3xl font-bold leading-7 text-gray-900 sm:truncate sm:tracking-tight">
          System Overview
        </h1>
        <p className="mt-2 text-xs sm:text-sm text-gray-600">
          Monitor and manage all real estate agencies from your central dashboard.
        </p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <div key={stat.name} className="relative overflow-hidden rounded-lg bg-white px-3 py-4 shadow sm:px-4 sm:py-5 lg:px-6 lg:py-6">
            <dt>
              <div className={`absolute rounded-md p-2 sm:p-3 ${stat.color}`}>
                <stat.icon className="h-4 w-4 sm:h-5 sm:w-5 lg:h-6 lg:w-6 text-white" />
              </div>
              <p className="ml-12 sm:ml-14 lg:ml-16 truncate text-xs sm:text-sm font-medium text-gray-500">{stat.name}</p>
            </dt>
            <dd className="ml-12 sm:ml-14 lg:ml-16 flex items-baseline">
              <p className="text-lg sm:text-xl lg:text-2xl font-semibold text-gray-900">{stat.value}</p>
              <p className={`ml-1 sm:ml-2 flex items-baseline text-xs sm:text-sm font-semibold ${
                stat.changeType === 'increase' ? 'text-green-600' : 'text-red-600'
              }`}>
                {stat.changeType === 'increase' ? (
                  <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 self-center" />
                ) : (
                  <ArrowDownRight className="h-3 w-3 sm:h-4 sm:w-4 flex-shrink-0 self-center" />
                )}
                <span className="sr-only">{stat.changeType === 'increase' ? 'Increased' : 'Decreased'} by</span>
                {stat.change}
              </p>
            </dd>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Recent Agencies */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-3 py-4 sm:px-4 sm:py-5 lg:p-6">
            <h3 className="text-base sm:text-lg font-medium leading-6 text-gray-900 mb-3 sm:mb-4">Recent Agencies</h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {recentAgencies.map((agency) => (
                  <li key={agency.id} className="py-4">
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="h-10 w-10 rounded-full bg-gray-100 flex items-center justify-center">
                          <Building2 className="h-5 w-5 text-gray-600" />
                        </div>
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="truncate text-sm font-medium text-gray-900">{agency.name}</p>
                        <p className="truncate text-sm text-gray-500">
                          {agency.users} users • {agency.leads} leads • {agency.plan}
                        </p>
                      </div>
                      <div className="flex-shrink-0 text-right">
                        <div className="flex items-center space-x-2">
                          <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                            agency.status === 'active' 
                              ? 'bg-green-100 text-green-800' 
                              : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {agency.status === 'active' ? (
                              <CheckCircle className="mr-1 h-3 w-3" />
                            ) : (
                              <Clock className="mr-1 h-3 w-3" />
                            )}
                            {agency.status}
                          </span>
                        </div>
                        <p className="text-xs text-gray-500 mt-1">{agency.lastActive}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Link to="/agencies" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                View all agencies
              </Link>
            </div>
          </div>
        </div>

        {/* System Alerts */}
        <div className="bg-white shadow rounded-lg">
          <div className="px-4 py-5 sm:p-6">
            <h3 className="text-lg font-medium leading-6 text-gray-900 mb-4">System Alerts</h3>
            <div className="flow-root">
              <ul className="-my-5 divide-y divide-gray-200">
                {systemAlerts.map((alert) => (
                  <li key={alert.id} className="py-4">
                    <div className="flex space-x-3">
                      <div className="flex-shrink-0">
                        {alert.type === 'warning' && (
                          <AlertCircle className="h-5 w-5 text-yellow-500" />
                        )}
                        {alert.type === 'success' && (
                          <CheckCircle className="h-5 w-5 text-green-500" />
                        )}
                        {alert.type === 'info' && (
                          <Activity className="h-5 w-5 text-blue-500" />
                        )}
                      </div>
                      <div className="min-w-0 flex-1">
                        <p className="text-sm text-gray-900">{alert.message}</p>
                        <p className="text-xs text-gray-500 mt-1">{alert.time}</p>
                      </div>
                    </div>
                  </li>
                ))}
              </ul>
            </div>
            <div className="mt-6">
              <Link to="/support" className="w-full flex justify-center items-center px-4 py-2 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50">
                View all alerts
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Dashboard
