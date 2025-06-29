import React, { useState } from 'react'
import { Plus, Search, Edit, Trash2, Users, Building2, Settings, Eye } from 'lucide-react'

const Agencies = () => {
  const [searchTerm, setSearchTerm] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)

  const agencies = [
    {
      id: 1,
      name: 'Elite Properties',
      manager: 'John Smith',
      email: 'john@eliteproperties.com',
      status: 'Active',
      users: 25,
      leads: 150,
      properties: 45,
      created: '2024-01-15',
      lastLogin: '2024-06-29'
    },
    {
      id: 2,
      name: 'Prime Real Estate',
      manager: 'Sarah Johnson',
      email: 'sarah@primerealestate.com',
      status: 'Active',
      users: 18,
      leads: 89,
      properties: 32,
      created: '2024-01-10',
      lastLogin: '2024-06-28'
    },
    {
      id: 3,
      name: 'Metro Homes',
      manager: 'Mike Wilson',
      email: 'mike@metrohomes.com',
      status: 'Pending',
      users: 0,
      leads: 0,
      properties: 0,
      created: '2024-01-08',
      lastLogin: 'Never'
    },
    {
      id: 4,
      name: 'Luxury Living',
      manager: 'Emma Davis',
      email: 'emma@luxuryliving.com',
      status: 'Active',
      users: 12,
      leads: 67,
      properties: 28,
      created: '2024-01-05',
      lastLogin: '2024-06-27'
    }
  ]

  const filteredAgencies = agencies.filter(agency =>
    agency.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    agency.manager.toLowerCase().includes(searchTerm.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Agencies</h1>
          <p className="text-gray-600">Manage all your real estate agencies</p>
        </div>
        <button
          onClick={() => setShowAddModal(true)}
          className="mt-4 sm:mt-0 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 flex items-center"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Agency
        </button>
      </div>

      {/* Search and Filters */}
      <div className="bg-white p-4 rounded-lg shadow">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search agencies or managers..."
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
          </div>
          <select className="px-4 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500">
            <option value="">All Status</option>
            <option value="active">Active</option>
            <option value="pending">Pending</option>
            <option value="suspended">Suspended</option>
          </select>
        </div>
      </div>

      {/* Agencies Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredAgencies.map((agency) => (
          <div key={agency.id} className="bg-white rounded-lg shadow hover:shadow-md transition-shadow">
            <div className="p-6">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center">
                  <Building2 className="h-8 w-8 text-blue-600" />
                  <div className="ml-3">
                    <h3 className="text-lg font-medium text-gray-900">{agency.name}</h3>
                    <p className="text-sm text-gray-500">{agency.manager}</p>
                  </div>
                </div>
                <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${
                  agency.status === 'Active'
                    ? 'bg-green-100 text-green-800'
                    : agency.status === 'Pending'
                    ? 'bg-yellow-100 text-yellow-800'
                    : 'bg-red-100 text-red-800'
                }`}>
                  {agency.status}
                </span>
              </div>

              <div className="space-y-2 mb-4">
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Users:</span>
                  <span className="font-medium">{agency.users}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Leads:</span>
                  <span className="font-medium">{agency.leads}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Properties:</span>
                  <span className="font-medium">{agency.properties}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-gray-500">Last Login:</span>
                  <span className="font-medium">{agency.lastLogin}</span>
                </div>
              </div>

              <div className="flex space-x-2">
                <button className="flex-1 bg-blue-50 text-blue-600 px-3 py-2 rounded-md hover:bg-blue-100 flex items-center justify-center">
                  <Eye className="h-4 w-4 mr-1" />
                  View
                </button>
                <button className="flex-1 bg-gray-50 text-gray-600 px-3 py-2 rounded-md hover:bg-gray-100 flex items-center justify-center">
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button className="bg-red-50 text-red-600 px-3 py-2 rounded-md hover:bg-red-100">
                  <Trash2 className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Add Agency Modal Placeholder */}
      {showAddModal && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md">
            <h3 className="text-lg font-medium mb-4">Add New Agency</h3>
            <p className="text-gray-600 mb-4">Agency creation form will be implemented here.</p>
            <div className="flex space-x-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300"
              >
                Cancel
              </button>
              <button className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700">
                Create Agency
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default Agencies
