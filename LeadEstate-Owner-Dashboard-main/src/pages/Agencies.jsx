import React, { useState, useEffect } from 'react'
import { 
  Building2, 
  Users, 
  Search, 
  MoreVertical, 
  Eye, 
  Edit, 
  Trash2, 
  Plus,
  RefreshCw,
  MapPin,
  Mail,
  Calendar
} from 'lucide-react'
import { ownerAPI, handleApiError } from '../services/api'
import AddAgencyModal from '../components/AddAgencyModal'
import EditAgencyModal from '../components/EditAgencyModal'
import toast from 'react-hot-toast'

const Agencies = () => {
  const [agencies, setAgencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
  const [showEditModal, setShowEditModal] = useState(false)
  const [selectedAgency, setSelectedAgency] = useState(null)
  const [showActions, setShowActions] = useState(null)

  useEffect(() => {
    loadAgencies()
  }, [])

  const loadAgencies = async () => {
    try {
      setLoading(true)
      const response = await ownerAPI.getAgencies()
      setAgencies(response.data.data || [])
    } catch (error) {
      console.warn('Agencies endpoint not available, using demo data:', error.message)
      // Demo data fallback
      setAgencies([
        {
          id: '1',
          name: 'Elite Properties',
          managerName: 'John Smith',
          email: 'john@eliteproperties.com',
          status: 'active',
          userCount: 25,
          city: 'New York',
          createdAt: '2024-01-15T10:00:00Z',
          settings: { plan: 'premium' }
        },
        {
          id: '2',
          name: 'Prime Real Estate',
          managerName: 'Sarah Johnson',
          email: 'sarah@primerealestate.com',
          status: 'active',
          userCount: 18,
          city: 'Los Angeles',
          createdAt: '2024-01-10T10:00:00Z',
          settings: { plan: 'standard' }
        },
        {
          id: '3',
          name: 'Metro Homes',
          managerName: 'Mike Wilson',
          email: 'mike@metrohomes.com',
          status: 'pending',
          userCount: 0,
          city: 'Chicago',
          createdAt: '2024-01-08T10:00:00Z',
          settings: { plan: 'basic' }
        },
        {
          id: '4',
          name: 'Luxury Estates',
          managerName: 'Emma Davis',
          email: 'emma@luxuryestates.com',
          status: 'active',
          userCount: 32,
          city: 'Miami',
          createdAt: '2024-01-05T10:00:00Z',
          settings: { plan: 'premium' }
        },
        {
          id: '5',
          name: 'Urban Properties',
          managerName: 'David Brown',
          email: 'david@urbanproperties.com',
          status: 'inactive',
          userCount: 12,
          city: 'Seattle',
          createdAt: '2024-01-03T10:00:00Z',
          settings: { plan: 'standard' }
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAgencyCreated = (newAgency) => {
    // If we have demo data, add the new agency to the list
    if (newAgency?.agency) {
      setAgencies(prev => [newAgency.agency, ...prev])
    } else {
      // Otherwise refresh from backend
      loadAgencies()
    }
    setShowAddModal(false)
  }

  const handleEditAgency = (agency) => {
    setSelectedAgency(agency)
    setShowEditModal(true)
    setShowActions(null)
  }

  const handleAgencyUpdated = (updatedAgency) => {
    setAgencies(prev =>
      prev.map(agency =>
        agency.id === updatedAgency.id ? updatedAgency : agency
      )
    )
    setShowEditModal(false)
    setSelectedAgency(null)
  }

  const handleDeleteAgency = (agency) => {
    if (window.confirm(`Are you sure you want to delete "${agency.name}"? This action cannot be undone.`)) {
      setAgencies(prev => prev.filter(a => a.id !== agency.id))
      toast.success(`Agency "${agency.name}" deleted successfully`)
      setShowActions(null)
    }
  }

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.managerName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.email?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = statusFilter === 'all' || agency.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusBadge = (status) => {
    const statusConfig = {
      active: { bg: 'bg-green-100', text: 'text-green-800', label: 'Active' },
      pending: { bg: 'bg-yellow-100', text: 'text-yellow-800', label: 'Pending' },
      inactive: { bg: 'bg-red-100', text: 'text-red-800', label: 'Inactive' },
      suspended: { bg: 'bg-gray-100', text: 'text-gray-800', label: 'Suspended' }
    }
    
    const config = statusConfig[status] || statusConfig.pending
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${config.bg} ${config.text}`}>
        {config.label}
      </span>
    )
  }

  const getPlanBadge = (plan) => {
    const planConfig = {
      basic: { bg: 'bg-gray-100', text: 'text-gray-800' },
      standard: { bg: 'bg-blue-100', text: 'text-blue-800' },
      premium: { bg: 'bg-purple-100', text: 'text-purple-800' }
    }
    
    const config = planConfig[plan] || planConfig.basic
    
    return (
      <span className={`inline-flex px-2 py-1 text-xs font-medium rounded ${config.bg} ${config.text}`}>
        {plan?.charAt(0).toUpperCase() + plan?.slice(1) || 'Basic'}
      </span>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col space-y-4 sm:flex-row sm:items-center sm:justify-between sm:space-y-0">
        <div>
          <h1 className="text-xl sm:text-2xl font-bold text-gray-900">Agencies</h1>
          <p className="text-sm sm:text-base text-gray-600">Manage all your real estate agencies</p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2">
          <button
            onClick={loadAgencies}
            className="flex items-center justify-center px-4 py-2 bg-gray-100 text-gray-700 rounded-md hover:bg-gray-200 text-sm"
            disabled={loading}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${loading ? 'animate-spin' : ''}`} />
            Refresh
          </button>
          <button
            onClick={() => setShowAddModal(true)}
            className="flex items-center justify-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 text-sm"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Agency
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <input
              type="text"
              placeholder="Search agencies..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
            />
          </div>
        </div>
        <div className="sm:w-48">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="inactive">Inactive</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Building2 className="h-8 w-8 text-blue-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Agencies</p>
              <p className="text-2xl font-bold text-gray-900">{agencies.length}</p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-green-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Active Agencies</p>
              <p className="text-2xl font-bold text-gray-900">
                {agencies.filter(a => a.status === 'active').length}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Users className="h-8 w-8 text-yellow-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">Total Users</p>
              <p className="text-2xl font-bold text-gray-900">
                {agencies.reduce((sum, a) => sum + (a.userCount || 0), 0)}
              </p>
            </div>
          </div>
        </div>
        <div className="bg-white p-4 rounded-lg shadow">
          <div className="flex items-center">
            <Calendar className="h-8 w-8 text-purple-600" />
            <div className="ml-3">
              <p className="text-sm font-medium text-gray-600">This Month</p>
              <p className="text-2xl font-bold text-gray-900">
                {agencies.filter(a => {
                  const created = new Date(a.createdAt)
                  const now = new Date()
                  return created.getMonth() === now.getMonth() && created.getFullYear() === now.getFullYear()
                }).length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Agencies Table */}
      <div className="bg-white shadow rounded-lg overflow-hidden">
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
                  Plan
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Users
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Created
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {loading ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    <div className="flex items-center justify-center">
                      <RefreshCw className="h-5 w-5 animate-spin mr-2" />
                      Loading agencies...
                    </div>
                  </td>
                </tr>
              ) : filteredAgencies.length === 0 ? (
                <tr>
                  <td colSpan="7" className="px-6 py-8 text-center text-gray-500">
                    No agencies found. Create your first agency to get started.
                  </td>
                </tr>
              ) : (
                filteredAgencies.map((agency) => (
                  <tr key={agency.id} className="hover:bg-gray-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="flex items-center">
                        <div className="flex-shrink-0 h-10 w-10">
                          <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
                            <Building2 className="h-5 w-5 text-blue-600" />
                          </div>
                        </div>
                        <div className="ml-4">
                          <div className="text-sm font-medium text-gray-900">{agency.name}</div>
                          <div className="text-sm text-gray-500 flex items-center">
                            <MapPin className="h-3 w-3 mr-1" />
                            {agency.city || 'Unknown'}
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div className="text-sm text-gray-900">{agency.managerName || 'Unknown'}</div>
                      <div className="text-sm text-gray-500 flex items-center">
                        <Mail className="h-3 w-3 mr-1" />
                        {agency.email}
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getStatusBadge(agency.status)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      {getPlanBadge(agency.settings?.plan)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                      {agency.userCount || 0}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                      {new Date(agency.createdAt).toLocaleDateString()}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                      <div className="relative">
                        <button
                          onClick={() => setShowActions(showActions === agency.id ? null : agency.id)}
                          className="text-gray-400 hover:text-gray-600"
                        >
                          <MoreVertical className="h-4 w-4" />
                        </button>
                        {showActions === agency.id && (
                          <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                            <div className="py-1">
                              <button
                                onClick={() => handleEditAgency(agency)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Eye className="h-4 w-4 mr-2" />
                                View Details
                              </button>
                              <button
                                onClick={() => handleEditAgency(agency)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <Edit className="h-4 w-4 mr-2" />
                                Edit Agency
                              </button>
                              <button
                                onClick={() => handleDeleteAgency(agency)}
                                className="flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 w-full text-left"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete Agency
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
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

      {/* Edit Agency Modal */}
      <EditAgencyModal
        isOpen={showEditModal}
        onClose={() => {
          setShowEditModal(false)
          setSelectedAgency(null)
        }}
        agency={selectedAgency}
        onAgencyUpdated={handleAgencyUpdated}
      />
    </div>
  )
}

export default Agencies
