import React, { useState } from 'react'
import { BarChart3, TrendingUp, Users, Building2, DollarSign, Activity, Calendar, Download } from 'lucide-react'

const Analytics = () => {
  const [timeRange, setTimeRange] = useState('30d')

  const overviewStats = [
    { name: 'Total Revenue', value: '$125,430', change: '+12.5%', changeType: 'positive', icon: DollarSign },
    { name: 'Active Agencies', value: '12', change: '+2', changeType: 'positive', icon: Building2 },
    { name: 'Total Users', value: '1,234', change: '+8.3%', changeType: 'positive', icon: Users },
    { name: 'System Uptime', value: '99.9%', change: '+0.1%', changeType: 'positive', icon: Activity },
  ]

  const topAgencies = [
    { name: 'Elite Properties', revenue: '$45,230', users: 25, growth: '+15%' },
    { name: 'Prime Real Estate', revenue: '$38,920', users: 18, growth: '+12%' },
    { name: 'Luxury Living', revenue: '$22,180', users: 12, growth: '+8%' },
    { name: 'Metro Homes', revenue: '$19,100', users: 15, growth: '+5%' },
  ]

  const revenueData = [
    { month: 'Jan', revenue: 85000 },
    { month: 'Feb', revenue: 92000 },
    { month: 'Mar', revenue: 98000 },
    { month: 'Apr', revenue: 105000 },
    { month: 'May', revenue: 118000 },
    { month: 'Jun', revenue: 125430 },
  ]

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Monitor your platform performance and growth</p>
        </div>
        <div className="mt-4 sm:mt-0 flex space-x-3">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {overviewStats.map((stat) => (
          <div key={stat.name} className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-8 w-8 text-blue-600" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">{stat.name}</p>
                <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last period
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Revenue Chart */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Revenue Trend</h3>
            <BarChart3 className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {revenueData.map((data, index) => (
              <div key={data.month} className="flex items-center">
                <div className="w-12 text-sm text-gray-600">{data.month}</div>
                <div className="flex-1 mx-4">
                  <div className="bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-blue-600 h-2 rounded-full"
                      style={{ width: `${(data.revenue / 125430) * 100}%` }}
                    ></div>
                  </div>
                </div>
                <div className="w-20 text-sm font-medium text-gray-900">
                  ${(data.revenue / 1000).toFixed(0)}k
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Top Agencies */}
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Top Performing Agencies</h3>
            <TrendingUp className="h-5 w-5 text-gray-400" />
          </div>
          <div className="space-y-4">
            {topAgencies.map((agency, index) => (
              <div key={agency.name} className="flex items-center justify-between">
                <div className="flex items-center">
                  <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-blue-600 font-medium text-sm">
                    {index + 1}
                  </div>
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-900">{agency.name}</p>
                    <p className="text-xs text-gray-500">{agency.users} users</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">{agency.revenue}</p>
                  <p className="text-xs text-green-600">{agency.growth}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Additional Analytics */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h3 className="text-lg font-medium text-gray-900 mb-4">System Metrics</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="text-center">
            <div className="text-3xl font-bold text-blue-600">98.5%</div>
            <div className="text-sm text-gray-600">User Satisfaction</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-green-600">2.3s</div>
            <div className="text-sm text-gray-600">Avg Response Time</div>
          </div>
          <div className="text-center">
            <div className="text-3xl font-bold text-purple-600">45</div>
            <div className="text-sm text-gray-600">Support Tickets</div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Analytics
