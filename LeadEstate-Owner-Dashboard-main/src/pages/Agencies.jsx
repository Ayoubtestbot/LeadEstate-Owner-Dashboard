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
  Calendar,
  CreditCard
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
  const [showBillingModal, setShowBillingModal] = useState(false)
  const [selectedAgency, setSelectedAgency] = useState(null)
  const [showActions, setShowActions] = useState(null)

  useEffect(() => {
    loadAgencies()
  }, [])

  const loadAgencies = async () => {
    try {
      setLoading(true)
      const response = await ownerAPI.getAgencies()
      console.log('✅ Agencies loaded from database:', response.data)
      setAgencies(response.data.data || response.data || [])
    } catch (error) {
      console.error('❌ Failed to load agencies from database:', error.message)
      toast.error(`Failed to load agencies: ${handleApiError(error)}`)
      setAgencies([]) // Empty array instead of mock data
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

  const handleViewBilling = (agency) => {
    setSelectedAgency(agency)
    setShowBillingModal(true)
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
                  Plan & Billing
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
                      <div className="space-y-1">
                        {getPlanBadge(agency.settings?.plan)}
                        <div className="text-xs text-gray-500">
                          ${agency.settings?.monthlyPrice || '99'}/{agency.settings?.billingCycle || 'month'}
                        </div>
                        {agency.settings?.billingStatus && (
                          <div className={`text-xs px-2 py-1 rounded-full inline-block ${
                            agency.settings.billingStatus === 'active'
                              ? 'bg-green-100 text-green-800'
                              : 'bg-red-100 text-red-800'
                          }`}>
                            {agency.settings.billingStatus}
                          </div>
                        )}
                      </div>
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
                                onClick={() => handleViewBilling(agency)}
                                className="flex items-center px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 w-full text-left"
                              >
                                <CreditCard className="h-4 w-4 mr-2" />
                                View Billing
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

      {/* Billing Modal */}
      {showBillingModal && selectedAgency && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            {/* Header */}
            <div className="flex items-center justify-between p-6 border-b border-gray-200">
              <div className="flex items-center">
                <CreditCard className="h-6 w-6 text-blue-600 mr-3" />
                <h3 className="text-lg font-medium text-gray-900">
                  Billing Information - {selectedAgency.name}
                </h3>
              </div>
              <button
                onClick={() => {
                  setShowBillingModal(false)
                  setSelectedAgency(null)
                }}
                className="text-gray-400 hover:text-gray-600"
              >
                ×
              </button>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6">
              {/* Plan Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Plan Details</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Current Plan</p>
                    <p className="text-lg font-bold text-gray-900 capitalize">
                      {selectedAgency.settings?.plan || 'Standard'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Monthly Price</p>
                    <p className="text-lg font-bold text-gray-900">
                      ${selectedAgency.settings?.monthlyPrice || '99'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Billing Cycle</p>
                    <p className="text-lg font-bold text-gray-900 capitalize">
                      {selectedAgency.settings?.billingCycle || 'Monthly'}
                    </p>
                  </div>
                  <div className="bg-gray-50 p-4 rounded-lg">
                    <p className="text-sm font-medium text-gray-600">Status</p>
                    <p className={`text-lg font-bold capitalize ${
                      selectedAgency.settings?.billingStatus === 'active'
                        ? 'text-green-600'
                        : 'text-red-600'
                    }`}>
                      {selectedAgency.settings?.billingStatus || 'Active'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Billing Information */}
              <div>
                <h4 className="text-md font-medium text-gray-900 mb-4">Billing Details</h4>
                <div className="space-y-3">
                  <div>
                    <p className="text-sm font-medium text-gray-600">Billing Email</p>
                    <p className="text-gray-900">{selectedAgency.settings?.billingEmail || selectedAgency.email}</p>
                  </div>
                  {selectedAgency.settings?.billingAddress && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Billing Address</p>
                      <p className="text-gray-900">{selectedAgency.settings.billingAddress}</p>
                    </div>
                  )}
                  {selectedAgency.settings?.taxId && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Tax ID</p>
                      <p className="text-gray-900">{selectedAgency.settings.taxId}</p>
                    </div>
                  )}
                  <div>
                    <p className="text-sm font-medium text-gray-600">Payment Method</p>
                    <p className="text-gray-900 capitalize">{selectedAgency.settings?.paymentMethod || 'Credit Card'}</p>
                  </div>
                  {selectedAgency.settings?.nextBillingDate && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Next Billing Date</p>
                      <p className="text-gray-900">
                        {new Date(selectedAgency.settings.nextBillingDate).toLocaleDateString()}
                      </p>
                    </div>
                  )}
                  {selectedAgency.settings?.notes && (
                    <div>
                      <p className="text-sm font-medium text-gray-600">Notes</p>
                      <p className="text-gray-900">{selectedAgency.settings.notes}</p>
                    </div>
                  )}
                </div>
              </div>
            </div>

            {/* Footer */}
            <div className="flex justify-end p-6 border-t border-gray-200">
              <button
                onClick={() => {
                  setShowBillingModal(false)
                  setSelectedAgency(null)
                }}
                className="bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Agencies
