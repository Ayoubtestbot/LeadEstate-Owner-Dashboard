import React, { useState } from 'react'
import { X, Building2, User, Mail, Phone, MapPin, Loader } from 'lucide-react'
import { createAgencyWithRepo, handleApiError } from '../services/api'
import toast from 'react-hot-toast'

const AddAgencyModal = ({ isOpen, onClose, onAgencyCreated }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    managerName: '',
    managerEmail: '',
    managerPhone: '',
    address: '',
    city: '',
    country: '',
    description: '',
    maxUsers: 50,
    maxLeads: 1000,
    maxProperties: 500,
  })

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      // Validate required fields
      if (!formData.name || !formData.managerName || !formData.managerEmail) {
        toast.error('Please fill in all required fields')
        return
      }

      // Create agency with repositories and deployments
      const result = await createAgencyWithRepo(formData)
      
      toast.success(`Agency "${formData.name}" created successfully!`)
      
      // Reset form
      setFormData({
        name: '',
        managerName: '',
        managerEmail: '',
        managerPhone: '',
        address: '',
        city: '',
        country: '',
        description: '',
        maxUsers: 50,
        maxLeads: 1000,
        maxProperties: 500,
      })
      
      // Notify parent component
      if (onAgencyCreated) {
        onAgencyCreated(result)
      }
      
      // Close modal
      onClose()
      
    } catch (error) {
      console.error('Error creating agency:', error)
      toast.error(handleApiError(error))
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-blue-600 mr-2" />
            <h3 className="text-lg font-medium text-gray-900">Create New Agency</h3>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Agency Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Agency Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agency Name *
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Elite Properties"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  City
                </label>
                <input
                  type="text"
                  name="city"
                  value={formData.city}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="New York"
                />
              </div>
            </div>
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                rows={3}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Brief description of the agency..."
              />
            </div>
          </div>

          {/* Manager Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Manager Information</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manager Name *
                </label>
                <input
                  type="text"
                  name="managerName"
                  value={formData.managerName}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="John Smith"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Manager Email *
                </label>
                <input
                  type="email"
                  name="managerEmail"
                  value={formData.managerEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="john@eliteproperties.com"
                  required
                />
              </div>
            </div>
          </div>

          {/* Limits */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Agency Limits</h4>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Users
                </label>
                <input
                  type="number"
                  name="maxUsers"
                  value={formData.maxUsers}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="1000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Leads
                </label>
                <input
                  type="number"
                  name="maxLeads"
                  value={formData.maxLeads}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="10000"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Max Properties
                </label>
                <input
                  type="number"
                  name="maxProperties"
                  value={formData.maxProperties}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  min="1"
                  max="5000"
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex flex-col sm:flex-row gap-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 bg-gray-200 text-gray-800 px-4 py-2 rounded-md hover:bg-gray-300 disabled:opacity-50"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 disabled:opacity-50 flex items-center justify-center"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader className="h-4 w-4 mr-2 animate-spin" />
                  Creating Agency...
                </>
              ) : (
                'Create Agency'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default AddAgencyModal
