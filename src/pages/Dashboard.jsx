import React, { useState, useEffect } from 'react'
import { Building2, Users, BarChart3, TrendingUp, DollarSign, Activity, RefreshCw } from 'lucide-react'
import { ownerAPI, handleApiError } from '../services/api'
import AddAgencyModal from '../components/AddAgencyModal'
import toast from 'react-hot-toast'

const Dashboard = () => {
  const [stats, setStats] = useState([
    { name: 'Total Agencies', value: '0', icon: Building2, change: '+0', changeType: 'positive' },
    { name: 'Active Users', value: '0', icon: Users, change: '+0%', changeType: 'positive' },
    { name: 'Monthly Revenue', value: '$0', icon: DollarSign, change: '+0%', changeType: 'positive' },
    { name: 'System Health', value: '99.9%', icon: Activity, change: '+0.1%', changeType: 'positive' },
  ])

  const [recentAgencies, setRecentAgencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [showAddModal, setShowAddModal] = useState(false)

  // Load dashboard data
  useEffect(() => {
    loadDashboardData()
  }, [])

  const loadDashboardData = async () => {
    try {
      setLoading(true)

      // Load dashboard stats
      const statsResponse = await ownerAPI.getDashboardStats()
      const dashboardStats = statsResponse.data

      setStats([
        {
          name: 'Total Agencies',
          value: dashboardStats.totalAgencies?.toString() || '0',
          icon: Building2,
          change: `+${dashboardStats.newAgenciesThisMonth || 0}`,
          changeType: 'positive'
        },
        {
          name: 'Active Users',
          value: dashboardStats.totalUsers?.toLocaleString() || '0',
          icon: Users,
          change: `+${dashboardStats.userGrowthPercent || 0}%`,
          changeType: 'positive'
        },
        {
          name: 'Monthly Revenue',
          value: `$${dashboardStats.monthlyRevenue?.toLocaleString() || '0'}`,
          icon: DollarSign,
          change: `+${dashboardStats.revenueGrowthPercent || 0}%`,
          changeType: 'positive'
        },
        {
          name: 'System Health',
          value: `${dashboardStats.systemHealth || 99.9}%`,
          icon: Activity,
          change: '+0.1%',
          changeType: 'positive'
        },
      ])

      // Load recent agencies
      const agenciesResponse = await ownerAPI.getAgencies({ limit: 5 })
      setRecentAgencies(agenciesResponse.data.data || [])

    } catch (error) {
      console.error('Error loading dashboard data:', error)
      toast.error(handleApiError(error))
    } finally {
      setLoading(false)
    }
  }

  const handleAgencyCreated = (newAgency) => {
    // Refresh dashboard data
    loadDashboardData()
    toast.success('Agency created successfully!')
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Owner Dashboard</h1>
          <p className="text-sm sm:text-base text-gray-600">Welcome to LeadEstate Owner Dashboard</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button
            onClick={loadDashboardData}
            className="w-full sm:w-auto bg-gray-100 text-gray-700 px-4 py-2 rounded-md hover:bg-gray-200 text-sm sm:text-base flex items-center justify-center"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="w-full sm:w-auto bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 text-sm sm:text-base"
          >
            Add New Agency
          </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {stats.map((stat) => (
          <div key={stat.name} className="bg-white p-4 sm:p-6 rounded-lg shadow">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <stat.icon className="h-6 w-6 sm:h-8 sm:w-8 text-blue-600" />
              </div>
              <div className="ml-3 sm:ml-4 min-w-0 flex-1">
                <p className="text-xs sm:text-sm font-medium text-gray-600 truncate">{stat.name}</p>
                <p className="text-lg sm:text-2xl font-bold text-gray-900">{stat.value}</p>
                <p className={`text-xs sm:text-sm ${stat.changeType === 'positive' ? 'text-green-600' : 'text-red-600'}`}>
                  {stat.change} from last month
                </p>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Recent Agencies */}
      <div className="bg-white shadow rounded-lg">
        <div className="px-4 sm:px-6 py-4 border-b border-gray-200">
          <h3 className="text-base sm:text-lg font-medium text-gray-900">Recent Agencies</h3>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agency
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Manager
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                      Loading agencies...
                    </div>
                  </td>
                </tr>
              ) : recentAgencies.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-8 text-center text-gray-500">
                    No agencies found. Create your first agency to get started.
                  </td>
                </tr>
              ) : (
                recentAgencies.map((agency) => (
                  <tr key={agency.id}>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                      {agency.name}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agency.managerName || agency.manager}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                        agency.status === 'active'
                          ? 'bg-green-100 text-green-800'
                          : agency.status === 'pending'
                          ? 'bg-yellow-100 text-yellow-800'
                          : 'bg-red-100 text-red-800'
                      }`}>
                        {agency.status?.charAt(0).toUpperCase() + agency.status?.slice(1) || 'Unknown'}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agency.userCount || agency.users || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {agency.createdAt ? new Date(agency.createdAt).toLocaleDateString() : agency.created}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add Agency Modal */}
      <AddAgencyModal
        isOpen={showAddModal}
        onClose={() => setShowAddModal(false)}
        onAgencyCreated={handleAgencyCreated}
      />
    </div>
  )
}

export default Dashboard
