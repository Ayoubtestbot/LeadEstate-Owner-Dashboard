import React, { useState, useEffect } from 'react'
import {
  Building2,
  Users,
  TrendingUp,
  DollarSign,
  Calendar,
  Activity,
  BarChart3,
  PieChart,
  RefreshCw
} from 'lucide-react'
import { ownerAPI, handleApiError } from '../services/api'
import toast from 'react-hot-toast'

const Dashboard = () => {
  // Simple test version to check if component renders
  console.log('🎯 Dashboard component rendering...')

  // Test if the issue is with API calls
  const [testMode, setTestMode] = useState(true)

  if (testMode) {
    return (
      <div className="space-y-6">
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          <strong>🎯 DASHBOARD TEST MODE ACTIVE</strong>
          <br />
          <span>If you see this, React components are working!</span>
          <br />
          <button
            onClick={() => setTestMode(false)}
            className="mt-2 bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Load Full Dashboard
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-blue-600" />
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-600">Test Card</p>
                <p className="text-2xl font-bold text-gray-900">Working!</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  const [stats, setStats] = useState({
    totalAgencies: 0,
    activeAgencies: 0,
    totalUsers: 0,
    monthlyRevenue: 0,
    newAgenciesThisMonth: 0,
    activeUsers: 0
  })
  const [loading, setLoading] = useState(true)
  const [recentActivity, setRecentActivity] = useState([])

  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Load agencies data
      const agenciesResponse = await ownerAPI.getAgencies()
      const agencies = agenciesResponse.data.data || agenciesResponse.data || []

      // Calculate stats from real data
      const totalAgencies = agencies.length
      const activeAgencies = agencies.filter(a => a.status === 'active').length
      const totalUsers = agencies.reduce((sum, a) => sum + (a.userCount || 0), 0)

      // Calculate new agencies this month
      const now = new Date()
      const newAgenciesThisMonth = agencies.filter(a => {
        const created = new Date(a.createdAt)
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
      }).length

      setStats({
        totalAgencies,
        activeAgencies,
        totalUsers,
        monthlyRevenue: totalAgencies * 99, // $99 per agency per month
        newAgenciesThisMonth,
        activeUsers: Math.floor(totalUsers * 0.75) // Estimate 75% active
      })

      // Set recent activity from agencies
      setRecentActivity(
        agencies.slice(0, 3).map(agency => ({
          id: agency.id,
          message: `Agency "${agency.name}" is ${agency.status}`,
          time: new Date(agency.createdAt).toLocaleString(),
          type: agency.status
        }))
      )

      console.log('✅ Dashboard data loaded from database')

    } catch (error) {
      console.error('❌ Failed to load dashboard data:', error.message)
      toast.error(`Failed to load dashboard data: ${handleApiError(error)}`)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-gray-600">Welcome to LeadEstate Owner Dashboard</p>
        </div>
        <button
          onClick={loadDashboardData}
          className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 mt-4 sm:mt-0"
          disabled={loading}
        >
          <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Agencies</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalAgencies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Agencies</p>
              <p className="text-2xl font-bold text-gray-900">{stats.activeAgencies}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">{stats.totalUsers}</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <DollarSign className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Monthly Revenue</p>
              <p className="text-2xl font-bold text-gray-900">${stats.monthlyRevenue.toLocaleString()}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <BarChart3 className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Agency Growth</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Growth This Month</span>
                <span className="text-lg font-semibold text-green-600">+{stats.newAgenciesThisMonth}</span>
              </div>
              <div className="w-full bg-gray-200 rounded-full h-3">
                <div
                  className="bg-blue-600 h-3 rounded-full transition-all duration-500"
                  style={{ width: `${Math.min((stats.newAgenciesThisMonth / 5) * 100, 100)}%` }}
                ></div>
              </div>
              <div className="flex justify-between text-xs text-gray-500">
                <span>0</span>
                <span>Target: 5 agencies</span>
              </div>
              <div className="grid grid-cols-3 gap-4 mt-6">
                <div className="text-center p-3 bg-blue-50 rounded-lg">
                  <div className="text-xl font-bold text-blue-600">{stats.totalAgencies}</div>
                  <div className="text-xs text-gray-600">Total Agencies</div>
                </div>
                <div className="text-center p-3 bg-green-50 rounded-lg">
                  <div className="text-xl font-bold text-green-600">{stats.activeAgencies}</div>
                  <div className="text-xs text-gray-600">Active</div>
                </div>
                <div className="text-center p-3 bg-yellow-50 rounded-lg">
                  <div className="text-xl font-bold text-yellow-600">{stats.totalAgencies - stats.activeAgencies}</div>
                  <div className="text-xs text-gray-600">Pending</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <PieChart className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Agency Status Distribution</h3>
          </div>
          <div className="p-4">
            <div className="space-y-4">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-green-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Active</span>
                  </div>
                  <span className="text-sm font-medium">{stats.activeAgencies}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Pending</span>
                  </div>
                  <span className="text-sm font-medium">{stats.totalAgencies - stats.activeAgencies}</span>
                </div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="w-3 h-3 bg-gray-500 rounded-full mr-2"></div>
                    <span className="text-sm text-gray-600">Inactive</span>
                  </div>
                  <span className="text-sm font-medium">0</span>
                </div>
              </div>

              <div className="mt-6">
                <div className="text-center">
                  <div className="text-2xl font-bold text-gray-900">
                    {stats.totalAgencies > 0 ? Math.round((stats.activeAgencies / stats.totalAgencies) * 100) : 0}%
                  </div>
                  <div className="text-sm text-gray-500">Active Rate</div>
                </div>
                <div className="mt-4 w-full bg-gray-200 rounded-full h-2">
                  <div
                    className="bg-green-500 h-2 rounded-full transition-all duration-500"
                    style={{ width: `${stats.totalAgencies > 0 ? (stats.activeAgencies / stats.totalAgencies) * 100 : 0}%` }}
                  ></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Calendar className="h-5 w-5 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Recent Activity</h3>
          </div>
        </div>
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <RefreshCw className="h-5 w-5 animate-spin mr-2" />
              <span className="text-gray-500">Loading recent activity...</span>
            </div>
          ) : recentActivity.length > 0 ? (
            <div className="space-y-4">
              {recentActivity.map((activity) => (
                <div key={activity.id} className="flex items-center">
                  <div className={`flex-shrink-0 h-2 w-2 rounded-full ${
                    activity.type === 'active' ? 'bg-green-400' :
                    activity.type === 'pending' ? 'bg-yellow-400' : 'bg-gray-400'
                  }`}></div>
                  <div className="ml-4">
                    <p className="text-sm text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-gray-300" />
              <p>No recent activity</p>
              <p className="text-sm">Activity will appear here as agencies are created and updated</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Dashboard
