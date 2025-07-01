import React, { useState, useEffect } from 'react'
import {
  BarChart3,
  PieChart,
  TrendingUp,
  Users,
  Building2,
  Activity,
  RefreshCw,
  Download
} from 'lucide-react'
import { ownerAPI, handleApiError } from '../services/api'
import toast from 'react-hot-toast'

const Analytics = () => {
  const [loading, setLoading] = useState(true)
  const [timeRange, setTimeRange] = useState('30d')
  const [agencies, setAgencies] = useState([])
  const [analytics, setAnalytics] = useState({
    totalAgencies: 0,
    totalUsers: 0,
    activeRate: 0,
    growthRate: 0,
    newThisMonth: 0,
    newThisWeek: 0
  })

  useEffect(() => {
    loadAnalytics()
  }, [timeRange])

  const loadAnalytics = async () => {
    try {
      setLoading(true)
      const response = await ownerAPI.getAgencies()
      const agenciesData = response.data.data || response.data || []
      setAgencies(agenciesData)

      // Calculate analytics from real data
      const totalAgencies = agenciesData.length
      const totalUsers = agenciesData.reduce((sum, a) => sum + (a.userCount || 0), 0)
      const activeAgencies = agenciesData.filter(a => a.status === 'active').length
      const activeRate = totalAgencies > 0 ? Math.round((activeAgencies / totalAgencies) * 100) : 0

      // Calculate growth metrics
      const now = new Date()
      const thisMonth = agenciesData.filter(a => {
        const created = new Date(a.createdAt)
        return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
      }).length

      const lastMonth = agenciesData.filter(a => {
        const created = new Date(a.createdAt)
        const lastMonthDate = new Date(now.getFullYear(), now.getMonth() - 1, 1)
        return created.getMonth() === lastMonthDate.getMonth() && created.getFullYear() === lastMonthDate.getFullYear()
      }).length

      const growthRate = lastMonth > 0 ? Math.round(((thisMonth - lastMonth) / lastMonth) * 100) : 0

      setAnalytics({
        totalAgencies,
        totalUsers,
        activeRate,
        growthRate,
        newThisMonth: thisMonth,
        newThisWeek: agenciesData.filter(a => {
          const created = new Date(a.createdAt)
          const weekAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000)
          return created >= weekAgo
        }).length
      })

      console.log('✅ Analytics loaded from database')
    } catch (error) {
      console.error('❌ Failed to load analytics:', error.message)
      toast.error(`Failed to load analytics: ${handleApiError(error)}`)
    } finally {
      setLoading(false)
    }
  }

  const handleRefresh = () => {
    loadAnalytics()
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Analytics</h1>
          <p className="text-gray-600">Comprehensive analytics for all your agencies</p>
        </div>
        <div className="flex items-center space-x-3 mt-4 sm:mt-0">
          <select
            value={timeRange}
            onChange={(e) => setTimeRange(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="7d">Last 7 days</option>
            <option value="30d">Last 30 days</option>
            <option value="90d">Last 90 days</option>
            <option value="1y">Last year</option>
          </select>
          <button
            onClick={handleRefresh}
            className="flex items-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700">
            <Download className="h-4 w-4 mr-2" />
            Export
          </button>
        </div>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Agencies</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : analytics.totalAgencies}
              </p>
              <p className="text-xs text-green-600">+{analytics.newThisMonth} this month</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : analytics.totalUsers}
              </p>
              <p className="text-xs text-green-600">+{analytics.newThisWeek} this week</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <Activity className="h-8 w-8 text-purple-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Active Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : `${analytics.activeRate}%`}
              </p>
              <p className="text-xs text-green-600">of all agencies</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center">
            <TrendingUp className="h-8 w-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm font-medium text-gray-600">Growth Rate</p>
              <p className="text-2xl font-bold text-gray-900">
                {loading ? '...' : `${analytics.growthRate >= 0 ? '+' : ''}${analytics.growthRate}%`}
              </p>
              <p className="text-xs text-green-600">vs last month</p>
            </div>
          </div>
        </div>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Agency Performance</h3>
            <BarChart3 className="h-5 w-5 text-blue-600" />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <BarChart3 className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Performance chart will be displayed here</p>
              <p className="text-sm">Integration with charting library needed</p>
            </div>
          </div>
        </div>

        <div className="bg-white p-6 rounded-lg shadow">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-medium text-gray-900">Plan Distribution</h3>
            <PieChart className="h-5 w-5 text-green-600" />
          </div>
          <div className="h-64 flex items-center justify-center text-gray-500">
            <div className="text-center">
              <PieChart className="h-12 w-12 mx-auto mb-2 text-gray-300" />
              <p>Plan distribution chart will be displayed here</p>
              <p className="text-sm">Integration with charting library needed</p>
            </div>
          </div>
        </div>
      </div>

      {/* Agency Breakdown Table */}
      <div className="bg-white rounded-lg shadow">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Agency Breakdown</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Performance
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <RefreshCw className="h-5 w-5 animate-spin mx-auto mb-2" />
                    Loading analytics data...
                  </td>
                </tr>
              ) : agencies.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No agencies found. Create your first agency to see analytics.
                  </td>
                </tr>
              ) : (
                agencies.map((agency) => (
                  <tr key={agency.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {agency.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agency.userCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${
                        agency.settings?.plan === 'premium' ? 'bg-purple-100 text-purple-800' :
                        agency.settings?.plan === 'standard' ? 'bg-blue-100 text-blue-800' :
                        'bg-gray-100 text-gray-800'
                      }`}>
                        {agency.settings?.plan?.charAt(0).toUpperCase() + agency.settings?.plan?.slice(1) || 'Basic'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        agency.status === 'active' ? 'bg-green-100 text-green-800' :
                        agency.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                        'bg-red-100 text-red-800'
                      }`}>
                        {agency.status?.charAt(0).toUpperCase() + agency.status?.slice(1)}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agency.userCount > 20 ? 'Excellent' :
                       agency.userCount > 10 ? 'Good' :
                       agency.userCount > 0 ? 'Fair' : 'New'}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

export default Analytics
