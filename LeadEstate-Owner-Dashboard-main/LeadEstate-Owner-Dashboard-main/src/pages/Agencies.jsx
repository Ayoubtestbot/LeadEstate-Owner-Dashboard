import React, { useState, useEffect } from 'react'
import {
  Plus,
  Search,
  Filter,
  MoreHorizontal,
  Building2,
  Users,
  TrendingUp,
  Settings,
  Play,
  Pause,
  Trash2,
  Edit,
  UserPlus,
  ExternalLink,
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'
import AddAgencyModal from '../components/AddAgencyModal'
import EditAgencyModal from '../components/EditAgencyModal'
import AgencySettingsModal from '../components/AgencySettingsModal'
import ManageUsersModal from '../components/ManageUsersModal'

const Agencies = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [filterStatus, setFilterStatus] = useState('all')
  const [showAddAgency, setShowAddAgency] = useState(false)
  const [openDropdown, setOpenDropdown] = useState(null)
  const [showEditAgency, setShowEditAgency] = useState(false)
  const [showAgencySettings, setShowAgencySettings] = useState(false)
  const [showManageUsers, setShowManageUsers] = useState(false)
  const [selectedAgency, setSelectedAgency] = useState(null)


  // Load agencies from localStorage or use default data
  const getInitialAgencies = () => {
    const saved = localStorage.getItem('agencies')
    if (saved) {
      return JSON.parse(saved)
    }
    // Default agencies if none saved
    return [
    {
      id: 1,
      name: 'Premier Realty Group',
      domain: 'premier-realty.com',
      status: 'active',
      plan: 'Professional',
      users: 12,
      leads: 234,
      revenue: '$1,980',
      frontendPort: 5101,
      backendPort: 6101,
      createdAt: '2024-01-15',
      lastActive: '2 hours ago',
      owner: {
        name: 'Sarah Johnson',
        email: 'sarah@premier-realty.com'
      }
    },
    {
      id: 2,
      name: 'Urban Properties',
      domain: 'urban-props.com',
      status: 'active',
      plan: 'Enterprise',
      users: 8,
      leads: 156,
      revenue: '$3,990',
      frontendPort: 5102,
      backendPort: 6102,
      createdAt: '2024-02-03',
      lastActive: '5 hours ago',
      owner: {
        name: 'Mike Chen',
        email: 'mike@urban-props.com'
      }
    },
    {
      id: 3,
      name: 'Coastal Homes',
      domain: 'coastal-homes.com',
      status: 'setup',
      plan: 'Starter',
      users: 3,
      leads: 0,
      revenue: '$990',
      frontendPort: 5103,
      backendPort: 6103,
      createdAt: '2024-03-10',
      lastActive: '1 day ago',
      owner: {
        name: 'Lisa Rodriguez',
        email: 'lisa@coastal-homes.com'
      }
    },
    {
      id: 4,
      name: 'Downtown Realty',
      domain: 'downtown-realty.com',
      status: 'active',
      plan: 'Enterprise',
      users: 15,
      leads: 389,
      revenue: '$3,990',
      frontendPort: 5104,
      backendPort: 6104,
      createdAt: '2024-01-28',
      lastActive: '30 minutes ago',
      owner: {
        name: 'David Kim',
        email: 'david@downtown-realty.com'
      }
    },
    {
      id: 5,
      name: 'Sunset Properties',
      domain: 'sunset-props.com',
      status: 'maintenance',
      plan: 'Professional',
      users: 6,
      leads: 89,
      revenue: '$1,980',
      frontendPort: 5105,
      backendPort: 6105,
      createdAt: '2024-02-20',
      lastActive: '3 hours ago',
      owner: {
        name: 'Emma Wilson',
        email: 'emma@sunset-props.com'
      }
    }
    ]
  }

  const [agencies, setAgencies] = useState(getInitialAgencies)

  // Save agencies to localStorage whenever agencies change
  useEffect(() => {
    localStorage.setItem('agencies', JSON.stringify(agencies))
  }, [agencies])

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (openDropdown && !event.target.closest('.relative')) {
        setOpenDropdown(null)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [openDropdown])

  const filteredAgencies = agencies.filter(agency => {
    const matchesSearch = agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         agency.domain.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (agency.owner && agency.owner.name && agency.owner.name.toLowerCase().includes(searchTerm.toLowerCase()))
    const matchesFilter = filterStatus === 'all' || agency.status === filterStatus
    return matchesSearch && matchesFilter
  })

  const getStatusIcon = (status) => {
    switch (status) {
      case 'active':
        return <CheckCircle className="h-4 w-4 text-green-500" />
      case 'setup':
        return <Clock className="h-4 w-4 text-yellow-500" />
      case 'maintenance':
        return <AlertTriangle className="h-4 w-4 text-orange-500" />
      default:
        return <Clock className="h-4 w-4 text-gray-500" />
    }
  }

  const getStatusColor = (status) => {
    switch (status) {
      case 'active':
        return 'bg-green-100 text-green-800'
      case 'setup':
        return 'bg-yellow-100 text-yellow-800'
      case 'maintenance':
        return 'bg-orange-100 text-orange-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const getPlanColor = (plan) => {
    switch (plan) {
      case 'Enterprise':
        return 'bg-purple-100 text-purple-800'
      case 'Professional':
        return 'bg-blue-100 text-blue-800'
      case 'Starter':
        return 'bg-gray-100 text-gray-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  const generatePorts = () => {
    const existingPorts = agencies.flatMap(a => [a.frontendPort, a.backendPort])
    let frontendPort = 5106 // Start after existing agencies
    let backendPort = 6106 // Start after existing agencies

    while (existingPorts.includes(frontendPort)) {
      frontendPort++
    }
    while (existingPorts.includes(backendPort)) {
      backendPort++
    }

    return { frontendPort, backendPort }
  }

  const handleAddAgency = (agencyData) => {
    console.log('*** AGENCIES.JSX handleAddAgency called with:', agencyData)

    try {
      // Generate unique ports
      const { frontendPort, backendPort } = generatePorts()
      console.log('Generated ports:', frontendPort, backendPort)

      // Create new agency
      const newAgency = {
        id: Date.now(),
        name: agencyData.agencyName,
        domain: `${agencyData.domain}.yourdomain.com`,
        status: agencyData.autoSetup ? 'active' : 'setup',
        plan: agencyData.plan.charAt(0).toUpperCase() + agencyData.plan.slice(1),
        users: 1,
        leads: 0,
        frontendPort,
        backendPort,
        revenue: '$0',
        owner: {
          name: agencyData.ownerName,
          email: agencyData.ownerEmail,
          phone: agencyData.ownerPhone || ''
        },
        companySize: agencyData.companySize,
        customBranding: agencyData.customBranding,
        autoSetup: agencyData.autoSetup,
        createdAt: new Date().toISOString(),
        lastActive: 'Just now'
      }

      console.log('New agency object created:', newAgency)

      // Update agencies list
      setAgencies(currentAgencies => {
        console.log('Before adding:', currentAgencies.length)
        const newList = [...currentAgencies, newAgency]
        console.log('After adding:', newList.length)
        return newList
      })

      console.log('Agency added to state')

      // Close modal
      setShowAddAgency(false)
      console.log('Modal closed')

      // Success message
      alert(`✅ Agency "${agencyData.agencyName}" created successfully!`)
      console.log('Success message shown')

    } catch (error) {
      console.error('Error in handleAddAgency:', error)
      alert('Error creating agency: ' + error.message)
    }
  }

  const handleEditAgency = (agency) => {
    setSelectedAgency(agency)
    setShowEditAgency(true)
    setOpenDropdown(null)
  }

  const handleViewSettings = (agency) => {
    setSelectedAgency(agency)
    setShowAgencySettings(true)
    setOpenDropdown(null)
  }

  const handleManageUsers = (agency) => {
    setSelectedAgency(agency)
    setShowManageUsers(true)
    setOpenDropdown(null)
  }

  const handleDeleteAgency = (agency) => {
    setOpenDropdown(null)
    if (confirm(`Are you sure you want to delete "${agency.name}"?\n\nThis action cannot be undone and will permanently remove all agency data.`)) {
      setAgencies(prev => prev.filter(a => a.id !== agency.id))
      alert(`Agency "${agency.name}" has been deleted.`)
    }
  }

  const handleSaveAgency = (updatedData) => {
    setAgencies(prev => prev.map(agency =>
      agency.id === selectedAgency.id
        ? {
            ...agency,
            name: updatedData.agencyName,
            domain: `${updatedData.domain}.yourdomain.com`,
            plan: updatedData.plan.charAt(0).toUpperCase() + updatedData.plan.slice(1),
            status: updatedData.status,
            owner: {
              ...agency.owner,
              name: updatedData.ownerName,
              email: updatedData.ownerEmail,
              phone: updatedData.ownerPhone
            },
            companySize: updatedData.companySize,
            customBranding: updatedData.customBranding,
            autoSetup: updatedData.autoSetup
          }
        : agency
    ))
    alert(`Agency "${updatedData.agencyName}" has been updated successfully!`)
  }

  const handleUpdateUsers = (userCount) => {
    setAgencies(prev => prev.map(agency =>
      agency.id === selectedAgency.id
        ? { ...agency, users: userCount }
        : agency
    ))
  }

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div className="sm:flex sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold leading-7 text-gray-900 sm:truncate sm:text-3xl sm:tracking-tight">
            Agencies ({agencies.length})
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Manage all real estate agencies and their configurations. Showing {filteredAgencies.length} of {agencies.length} agencies.
          </p>
        </div>
        <div className="mt-4 sm:ml-16 sm:mt-0 sm:flex-none flex gap-2">
          <button
            type="button"
            onClick={() => {
              console.log('Test button clicked')
              const testData = {
                agencyName: 'Test Agency',
                domain: 'test-agency',
                plan: 'professional',
                ownerName: 'Test Owner',
                ownerEmail: 'test@test.com',
                ownerPhone: '',
                companySize: '1-5',
                customBranding: false,
                autoSetup: true
              }
              handleAddAgency(testData)
            }}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-green-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-green-500"
          >
            Test Add
          </button>
          <button
            type="button"
            onClick={() => setShowAddAgency(true)}
            className="inline-flex items-center gap-x-1.5 rounded-md bg-primary-600 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-primary-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary-600"
          >
            <Plus className="-ml-0.5 h-5 w-5" />
            New Agency
          </button>
        </div>
      </div>

      {/* Filters */}
      <div className="flex flex-col sm:flex-row gap-4">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 flex items-center pl-3">
            <Search className="h-5 w-5 text-gray-400" />
          </div>
          <input
            type="text"
            placeholder="Search agencies..."
            className="block w-full rounded-md border-0 bg-white py-1.5 pl-10 pr-3 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
        <div className="flex items-center gap-2">
          <Filter className="h-5 w-5 text-gray-400" />
          <select
            className="rounded-md border-0 bg-white py-1.5 pl-3 pr-8 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 focus:ring-2 focus:ring-inset focus:ring-primary-600 sm:text-sm sm:leading-6"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="setup">Setup</option>
            <option value="maintenance">Maintenance</option>
          </select>
        </div>
      </div>

      {/* Agencies table */}
      <div className="bg-white shadow-sm ring-1 ring-gray-900/5 rounded-lg overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-300">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Agency
                </th>
                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Plan
                </th>
                <th className="hidden md:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Metrics
                </th>
                <th className="hidden lg:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Ports
                </th>
                <th className="hidden sm:table-cell px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Revenue
                </th>
                <th className="relative px-3 sm:px-6 py-3">
                  <span className="sr-only">Actions</span>
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredAgencies.map((agency) => (
                <tr key={agency.id} className="hover:bg-gray-50">
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="h-8 w-8 sm:h-10 sm:w-10 flex-shrink-0">
                        <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-primary-100 flex items-center justify-center">
                          <Building2 className="h-4 w-4 sm:h-5 sm:w-5 text-primary-600" />
                        </div>
                      </div>
                      <div className="ml-2 sm:ml-4 min-w-0 flex-1">
                        <div className="text-xs sm:text-sm font-medium text-gray-900 truncate">{agency.name}</div>
                        <div className="text-xs text-gray-500 truncate">{agency.domain}</div>
                        <div className="text-xs text-gray-400 truncate sm:hidden">{agency.plan}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(agency.status)}
                      <span className={`ml-1 sm:ml-2 inline-flex items-center rounded-full px-1.5 sm:px-2.5 py-0.5 text-xs font-medium ${getStatusColor(agency.status)}`}>
                        <span className="sm:hidden">{agency.status.charAt(0).toUpperCase()}</span>
                        <span className="hidden sm:inline">{agency.status}</span>
                      </span>
                    </div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getPlanColor(agency.plan)}`}>
                      {agency.plan}
                    </span>
                  </td>
                  <td className="hidden md:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    <div className="flex items-center space-x-4">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{agency.users}</span>
                      </div>
                      <div className="flex items-center">
                        <TrendingUp className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{agency.leads}</span>
                      </div>
                    </div>
                  </td>
                  <td className="hidden lg:table-cell px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                    <div>Frontend: {agency.frontendPort}</div>
                    <div>Backend: {agency.backendPort}</div>
                  </td>
                  <td className="hidden sm:table-cell px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                    {agency.revenue}
                  </td>
                  <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-end space-x-2">
                      <button
                        onClick={(e) => {
                          e.preventDefault()
                          e.stopPropagation()
                          console.log('External link clicked for agency:', agency.name)
                          window.open(`http://localhost:${agency.frontendPort}`, '_blank')
                        }}
                        className="inline-flex items-center justify-center w-8 h-8 text-primary-600 hover:text-primary-900 hover:bg-primary-50 rounded-md transition-colors"
                        title="Open Agency Frontend"
                      >
                        <ExternalLink className="h-4 w-4" />
                      </button>
                      <div className="relative">
                        <button
                          onClick={(e) => {
                            e.preventDefault()
                            e.stopPropagation()
                            setOpenDropdown(openDropdown === agency.id ? null : agency.id)
                          }}
                          className="inline-flex items-center justify-center w-8 h-8 text-gray-400 hover:text-gray-600 hover:bg-gray-50 rounded-md transition-colors"
                          title="More Options"
                        >
                          <MoreHorizontal className="h-4 w-4" />
                        </button>

                        {openDropdown === agency.id && (
                          <div className="absolute right-0 top-full mt-1 w-48 bg-white rounded-md shadow-lg ring-1 ring-black ring-opacity-5 z-10">
                            <div className="py-1">
                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleEditAgency(agency)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              >
                                <Edit className="h-4 w-4 mr-3" />
                                Edit Agency
                              </button>

                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleViewSettings(agency)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              >
                                <Settings className="h-4 w-4 mr-3" />
                                View Settings
                              </button>

                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleManageUsers(agency)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 hover:text-gray-900"
                              >
                                <UserPlus className="h-4 w-4 mr-3" />
                                Manage Users
                              </button>

                              <hr className="my-1" />

                              <button
                                onClick={(e) => {
                                  e.preventDefault()
                                  e.stopPropagation()
                                  handleDeleteAgency(agency)
                                }}
                                className="flex items-center w-full px-4 py-2 text-sm text-red-700 hover:bg-red-50 hover:text-red-900"
                              >
                                <Trash2 className="h-4 w-4 mr-3" />
                                Delete Agency
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Summary stats */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <Building2 className="h-6 w-6 text-gray-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Agencies</dt>
                  <dd className="text-lg font-medium text-gray-900">{agencies.length}</dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <CheckCircle className="h-6 w-6 text-green-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Active Agencies</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    {agencies.filter(a => a.status === 'active').length}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>

        <div className="bg-white overflow-hidden shadow rounded-lg">
          <div className="p-5">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <TrendingUp className="h-6 w-6 text-blue-400" />
              </div>
              <div className="ml-5 w-0 flex-1">
                <dl>
                  <dt className="text-sm font-medium text-gray-500 truncate">Total Revenue</dt>
                  <dd className="text-lg font-medium text-gray-900">
                    ${agencies.reduce((sum, agency) => sum + parseInt(agency.revenue.replace('$', '').replace(',', '')), 0).toLocaleString()}
                  </dd>
                </dl>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Add Agency Modal */}
      <AddAgencyModal
        isOpen={showAddAgency}
        onClose={() => setShowAddAgency(false)}
        onSubmit={handleAddAgency}
      />

      {/* Edit Agency Modal */}
      <EditAgencyModal
        isOpen={showEditAgency}
        onClose={() => setShowEditAgency(false)}
        onSave={handleSaveAgency}
        agency={selectedAgency}
      />

      {/* Agency Settings Modal */}
      <AgencySettingsModal
        isOpen={showAgencySettings}
        onClose={() => setShowAgencySettings(false)}
        agency={selectedAgency}
      />

      {/* Manage Users Modal */}
      <ManageUsersModal
        isOpen={showManageUsers}
        onClose={() => setShowManageUsers(false)}
        agency={selectedAgency}
        onUpdateUsers={handleUpdateUsers}
      />
    </div>
  )
}

export default Agencies
