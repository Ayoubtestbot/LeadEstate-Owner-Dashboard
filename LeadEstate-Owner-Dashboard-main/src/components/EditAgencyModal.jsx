import React, { useState, useEffect } from 'react'
import { X, Building2, User, Mail, Phone, MapPin, Loader } from 'lucide-react'
import { ownerAPI, handleApiError } from '../services/api'
import toast from 'react-hot-toast'

const EditAgencyModal = ({ isOpen, onClose, agency, onAgencyUpdated }) => {
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
    status: 'active',
    plan: 'standard',
    maxUsers: 50,
    maxLeads: 1000,
    maxProperties: 500,
  })

  // Update form data when agency prop changes
  useEffect(() => {
    if (agency) {
      setFormData({
        name: agency.name || '',
        managerName: agency.managerName || '',
        managerEmail: agency.email || '',
        managerPhone: agency.managerPhone || '',
        address: agency.address || '',
        city: agency.city || '',
        country: agency.country || '',
        description: agency.description || '',
        status: agency.status || 'active',
        plan: agency.settings?.plan || 'standard',
        maxUsers: agency.maxUsers || 50,
        maxLeads: agency.maxLeads || 1000,
        maxProperties: agency.maxProperties || 500,
      })
    }
  }, [agency])

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

      // Update agency via API
      const response = await ownerAPI.updateAgency(agency.id, {
        name: formData.name,
        managerName: formData.managerName,
        managerEmail: formData.managerEmail,
        city: formData.city,
        status: formData.status,
        plan: formData.plan,
        description: formData.description
      })

      toast.success(`Agency "${formData.name}" updated successfully!`)

      // Notify parent component
      if (onAgencyUpdated) {
        const updatedAgency = {
          ...agency,
          name: formData.name,
          managerName: formData.managerName,
          email: formData.managerEmail,
          city: formData.city,
          status: formData.status,
          settings: { plan: formData.plan },
          description: formData.description
        }
        onAgencyUpdated(updatedAgency)
      }

      // Close modal
      onClose()
      
    } catch (error) {
      console.error('Error updating agency:', error)
      toast.error(error.message || 'Failed to update agency')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen || !agency) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Edit Agency</h3>
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

          {/* Status and Plan */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Settings</h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  name="status"
                  value={formData.status}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="active">Active</option>
                  <option value="pending">Pending</option>
                  <option value="inactive">Inactive</option>
                  <option value="suspended">Suspended</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan
                </label>
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="basic">Basic</option>
                  <option value="standard">Standard</option>
                  <option value="premium">Premium</option>
                </select>
              </div>
            </div>
          </div>

          {/* Description */}
          <div>
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
                  Updating Agency...
                </>
              ) : (
                'Update Agency'
              )}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditAgencyModal
