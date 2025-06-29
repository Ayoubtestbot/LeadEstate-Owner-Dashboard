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
import toast from 'react-hot-toast'

const Agencies = () => {
  const [agencies, setAgencies] = useState([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [showAddModal, setShowAddModal] = useState(false)
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
        }
      ])
    } finally {
      setLoading(false)
    }
  }

  const handleAgencyCreated = () => {
    loadAgencies()
    setShowAddModal(false)
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
      inactive: { bg: 'bg-red-100', text: 'text-red-800', label: 'Inactive' }
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
          </select>
        </div>
      </div>
