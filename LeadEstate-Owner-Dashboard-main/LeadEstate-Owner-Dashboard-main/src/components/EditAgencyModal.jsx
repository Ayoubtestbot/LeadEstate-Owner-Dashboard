import React, { useState, useEffect } from 'react'
import { X, Save } from 'lucide-react'

const EditAgencyModal = ({ isOpen, onClose, onSave, agency }) => {
  const [formData, setFormData] = useState({
    agencyName: '',
    domain: '',
    plan: 'professional',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    companySize: '',
    customBranding: false,
    autoSetup: true,
    status: 'active'
  })
  const [errors, setErrors] = useState({})

  useEffect(() => {
    if (agency) {
      setFormData({
        agencyName: agency.name || '',
        domain: agency.domain?.replace('.yourdomain.com', '') || '',
        plan: agency.plan?.toLowerCase() || 'professional',
        ownerName: agency.owner?.name || '',
        ownerEmail: agency.owner?.email || '',
        ownerPhone: agency.owner?.phone || '',
        companySize: agency.companySize || '',
        customBranding: agency.customBranding || false,
        autoSetup: agency.autoSetup || true,
        status: agency.status || 'active'
      })
    }
  }, [agency])

  const validateForm = () => {
    const newErrors = {}
    
    if (!formData.agencyName.trim()) {
      newErrors.agencyName = 'Agency name is required'
    }
    
    if (!formData.domain.trim()) {
      newErrors.domain = 'Domain is required'
    } else if (!/^[a-z0-9-]+$/.test(formData.domain)) {
      newErrors.domain = 'Domain can only contain lowercase letters, numbers, and hyphens'
    }
    
    if (!formData.ownerName.trim()) {
      newErrors.ownerName = 'Owner name is required'
    }
    
    if (!formData.ownerEmail.trim()) {
      newErrors.ownerEmail = 'Owner email is required'
    } else if (!/\S+@\S+\.\S+/.test(formData.ownerEmail)) {
      newErrors.ownerEmail = 'Please enter a valid email address'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e) => {
    e.preventDefault()
    
    if (validateForm()) {
      onSave(formData)
      onClose()
    }
  }

  const handleInputChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-gray-500 bg-opacity-75 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900">Edit Agency</h3>
          <button onClick={onClose} className="text-gray-400 hover:text-gray-600">
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Form */}
        <div className="flex-1 overflow-y-auto p-6">
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Agency Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Agency Name *
                </label>
                <input
                  type="text"
                  value={formData.agencyName}
                  onChange={(e) => handleInputChange('agencyName', e.target.value)}
                  className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                    errors.agencyName ? 'border-red-300' : 'border-gray-300'
                  }`}
                />
                {errors.agencyName && <p className="mt-1 text-sm text-red-600">{errors.agencyName}</p>}
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Domain *
                </label>
                <div className="flex">
                  <input
                    type="text"
                    value={formData.domain}
                    onChange={(e) => handleInputChange('domain', e.target.value.toLowerCase())}
                    className={`flex-1 px-3 py-2 border rounded-l-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.domain ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  <span className="px-3 py-2 bg-gray-50 border border-l-0 border-gray-300 rounded-r-md text-gray-500">
                    .yourdomain.com
                  </span>
                </div>
                {errors.domain && <p className="mt-1 text-sm text-red-600">{errors.domain}</p>}
              </div>
            </div>

            {/* Plan and Status */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Plan
                </label>
                <select
                  value={formData.plan}
                  onChange={(e) => handleInputChange('plan', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="starter">Starter - $990/month</option>
                  <option value="professional">Professional - $1,980/month</option>
                  <option value="enterprise">Enterprise - $3,990/month</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Status
                </label>
                <select
                  value={formData.status}
                  onChange={(e) => handleInputChange('status', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                >
                  <option value="active">Active</option>
                  <option value="setup">Setup</option>
                  <option value="maintenance">Maintenance</option>
                </select>
              </div>
            </div>

            {/* Owner Information */}
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Owner Information</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner Name *
                  </label>
                  <input
                    type="text"
                    value={formData.ownerName}
                    onChange={(e) => handleInputChange('ownerName', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.ownerName ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.ownerName && <p className="mt-1 text-sm text-red-600">{errors.ownerName}</p>}
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Owner Email *
                  </label>
                  <input
                    type="email"
                    value={formData.ownerEmail}
                    onChange={(e) => handleInputChange('ownerEmail', e.target.value)}
                    className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500 ${
                      errors.ownerEmail ? 'border-red-300' : 'border-gray-300'
                    }`}
                  />
                  {errors.ownerEmail && <p className="mt-1 text-sm text-red-600">{errors.ownerEmail}</p>}
                </div>
              </div>

              <div className="mt-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Owner Phone
                </label>
                <input
                  type="tel"
                  value={formData.ownerPhone}
                  onChange={(e) => handleInputChange('ownerPhone', e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary-500"
                />
              </div>
            </div>

            {/* Settings */}
            <div className="border-t pt-6">
              <h4 className="text-md font-medium text-gray-900 mb-4">Settings</h4>
              <div className="space-y-4">
                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="customBranding"
                    checked={formData.customBranding}
                    onChange={(e) => handleInputChange('customBranding', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="customBranding" className="ml-2 block text-sm text-gray-900">
                    Enable Custom Branding
                  </label>
                </div>

                <div className="flex items-center">
                  <input
                    type="checkbox"
                    id="autoSetup"
                    checked={formData.autoSetup}
                    onChange={(e) => handleInputChange('autoSetup', e.target.checked)}
                    className="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded"
                  />
                  <label htmlFor="autoSetup" className="ml-2 block text-sm text-gray-900">
                    Auto Setup New Features
                  </label>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* Footer */}
        <div className="flex justify-end space-x-3 p-6 border-t border-gray-200 bg-gray-50">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            onClick={handleSubmit}
            className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 flex items-center"
          >
            <Save className="h-4 w-4 mr-2" />
            Save Changes
          </button>
        </div>
      </div>
    </div>
  )
}

export default EditAgencyModal
