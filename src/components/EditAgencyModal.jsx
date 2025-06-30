import React, { useState, useEffect } from 'react'
import { X, Save, RefreshCw } from 'lucide-react'
import { ownerAPI, handleApiError } from '../services/api'
import toast from 'react-hot-toast'

const EditAgencyModal = ({ isOpen, onClose, agency, onAgencyUpdated }) => {
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: '',
    managerName: '',
    managerEmail: '',
    city: '',
    status: 'active',
    plan: 'standard',
    description: ''
  })

  useEffect(() => {
    if (agency) {
      setFormData({
        name: agency.name || '',
        managerName: agency.managerName || '',
        managerEmail: agency.email || '',
        city: agency.city || '',
        status: agency.status || 'active',
        plan: agency.settings?.plan || 'standard',
        description: agency.description || ''
      })
    }
  }, [agency])

  const handleSubmit = async (e) => {
    e.preventDefault()
    
    if (!formData.name || !formData.managerName || !formData.managerEmail) {
      toast.error('Please fill in all required fields')
      return
    }

    try {
      setLoading(true)

      // For now, simulate update since we don't have a real update endpoint
      const updatedAgency = {
        ...agency,
        name: formData.name,
        managerName: formData.managerName,
        email: formData.managerEmail,
        city: formData.city,
        status: formData.status,
        settings: {
          ...agency.settings,
          plan: formData.plan
        },
        description: formData.description,
        updatedAt: new Date().toISOString()
      }

      toast.success(`Agency "${formData.name}" updated successfully!`)

      // Reset form
      setFormData({
        name: '',
        managerName: '',
        managerEmail: '',
        city: '',
        status: 'active',
        plan: 'standard',
        description: ''
      })

      // Notify parent component
      if (onAgencyUpdated) {
        onAgencyUpdated(updatedAgency)
      }

      // Close modal
      onClose()

    } catch (error) {
      console.error('Error updating agency:', error)
      toast.error(handleApiError(error))
    } finally {
      setLoading(false)
    }
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Edit Agency</h3>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600"
            disabled={loading}
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Basic Information</h4>
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
                  placeholder="Enter agency name"
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
                  placeholder="Enter city"
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
                  placeholder="Enter manager name"
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
                  placeholder="Enter manager email"
                  required
                />
              </div>
            </div>
          </div>

          {/* Agency Settings */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4">Agency Settings</h4>
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
              placeholder="Enter agency description..."
            />
          </div>

          {/* Form Actions */}
          <div className="flex justify-end gap-3 pt-4 border-t border-gray-200">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
              disabled={loading}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:opacity-50"
              disabled={loading}
            >
              {loading ? (
                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
              {loading ? 'Updating...' : 'Update Agency'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default EditAgencyModal
