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
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Agency growth chart will be displayed here</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center mb-4">
            <PieChart className="h-5 w-5 text-green-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Agency Status Distribution</h3>
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <PieChart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Status distribution chart will be displayed here</p>
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
