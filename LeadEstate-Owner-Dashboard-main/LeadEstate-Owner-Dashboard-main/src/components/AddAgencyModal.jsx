import React, { useState } from 'react'
import { X, Building2, Loader2 } from 'lucide-react'

const AddAgencyModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    agencyName: '',
    domain: '',
    plan: 'professional',
    ownerName: '',
    ownerEmail: '',
    ownerPhone: '',
    companySize: '',
    customBranding: false,
    autoSetup: true
  })

  const [errors, setErrors] = useState({})

  const handleChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }))
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: ''
      }))
    }
  }

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
    console.log('Form submitted')

    if (validateForm()) {
      console.log('Validation passed, calling onSubmit with:', formData)
      console.log('onSubmit function:', onSubmit)
      onSubmit(formData)
      setFormData({
        agencyName: '',
        domain: '',
        plan: 'professional',
        ownerName: '',
        ownerEmail: '',
        ownerPhone: '',
        companySize: '',
        customBranding: false,
        autoSetup: true
      })
      setErrors({})
    } else {
      console.log('Validation failed')
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="flex min-h-screen items-start justify-center p-4 pt-8 pb-20">
        <div className="fixed inset-0 bg-gray-500 bg-opacity-75 transition-opacity" onClick={onClose} />

        <div className="relative bg-white rounded-lg shadow-xl w-full max-w-md sm:max-w-lg lg:max-w-xl xl:max-w-2xl max-h-[85vh] overflow-hidden flex flex-col">
          <div className="flex items-center justify-between p-4 sm:p-6 border-b border-gray-200 flex-shrink-0">
            <div className="flex items-center space-x-3 min-w-0 flex-1">
              <div className="h-8 w-8 sm:h-10 sm:w-10 bg-primary-100 rounded-lg flex items-center justify-center flex-shrink-0">
                <Building2 className="h-5 w-5 sm:h-6 sm:w-6 text-primary-600" />
              </div>
              <div className="min-w-0 flex-1">
                <h3 className="text-base sm:text-lg font-medium text-gray-900">Add New Agency</h3>
                <p className="text-xs sm:text-sm text-gray-500 mt-1">Create a new agency instance</p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-gray-600 flex-shrink-0 ml-2 sm:ml-4"
            >
              <X className="h-5 w-5 sm:h-6 sm:w-6" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto">
            <form id="add-agency-form" onSubmit={handleSubmit} className="p-4 sm:p-6 space-y-4 sm:space-y-6">
              <div>
                <h4 className="text-sm sm:text-md font-medium text-gray-900 mb-3 sm:mb-4">Agency Information</h4>
                <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                  <div className="sm:col-span-2">
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Agency Name *</label>
                    <input
                      type="text"
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm py-2 ${
                        errors.agencyName ? 'border-red-300' : ''
                      }`}
                      placeholder="Premier Realty Group"
                      value={formData.agencyName}
                      onChange={(e) => handleChange('agencyName', e.target.value)}
                    />
                    {errors.agencyName && <p className="mt-1 text-xs text-red-600">{errors.agencyName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Domain/Subdomain *</label>
                    <div className="flex rounded-md shadow-sm">
                      <input
                        type="text"
                        className={`flex-1 rounded-l-md border-gray-300 focus:border-primary-500 focus:ring-primary-500 text-sm py-2 ${
                          errors.domain ? 'border-red-300' : ''
                        }`}
                        placeholder="premier-realty"
                        value={formData.domain}
                        onChange={(e) => handleChange('domain', e.target.value.toLowerCase())}
                      />
                      <span className="inline-flex items-center px-2 sm:px-3 rounded-r-md border border-l-0 border-gray-300 bg-gray-50 text-gray-500 text-xs sm:text-sm">
                        .yourdomain.com
                      </span>
                    </div>
                    {errors.domain && <p className="mt-1 text-xs text-red-600">{errors.domain}</p>}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Plan</label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm py-2"
                      value={formData.plan}
                      onChange={(e) => handleChange('plan', e.target.value)}
                    >
                      <option value="starter">Starter - $99/month</option>
                      <option value="professional">Professional - $199/month</option>
                      <option value="enterprise">Enterprise - $399/month</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm sm:text-md font-medium text-gray-900 mb-3 sm:mb-4">Agency Owner</h4>
                <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2">
                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Full Name *</label>
                    <input
                      type="text"
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm py-2 ${
                        errors.ownerName ? 'border-red-300' : ''
                      }`}
                      placeholder="Sarah Johnson"
                      value={formData.ownerName}
                      onChange={(e) => handleChange('ownerName', e.target.value)}
                    />
                    {errors.ownerName && <p className="mt-1 text-xs text-red-600">{errors.ownerName}</p>}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Email Address *</label>
                    <input
                      type="email"
                      className={`block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm py-2 ${
                        errors.ownerEmail ? 'border-red-300' : ''
                      }`}
                      placeholder="sarah@premier-realty.com"
                      value={formData.ownerEmail}
                      onChange={(e) => handleChange('ownerEmail', e.target.value)}
                    />
                    {errors.ownerEmail && <p className="mt-1 text-xs text-red-600">{errors.ownerEmail}</p>}
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                    <input
                      type="tel"
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm py-2"
                      placeholder="+1 (555) 123-4567"
                      value={formData.ownerPhone}
                      onChange={(e) => handleChange('ownerPhone', e.target.value)}
                    />
                  </div>

                  <div>
                    <label className="block text-xs sm:text-sm font-medium text-gray-700 mb-1">Company Size</label>
                    <select
                      className="block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 text-sm py-2"
                      value={formData.companySize}
                      onChange={(e) => handleChange('companySize', e.target.value)}
                    >
                      <option value="">Select size</option>
                      <option value="1-5">1-5 agents</option>
                      <option value="6-15">6-15 agents</option>
                      <option value="16-50">16-50 agents</option>
                      <option value="50+">50+ agents</option>
                    </select>
                  </div>
                </div>
              </div>

              <div>
                <h4 className="text-sm sm:text-md font-medium text-gray-900 mb-3 sm:mb-4">Setup Options</h4>
                <div className="space-y-3 sm:space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Custom Branding</label>
                      <p className="text-xs text-gray-500">Allow agency to customize logo and colors</p>
                    </div>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${
                        formData.customBranding ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                      onClick={() => handleChange('customBranding', !formData.customBranding)}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          formData.customBranding ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <label className="text-sm font-medium text-gray-700">Auto Setup</label>
                      <p className="text-xs text-gray-500">Automatically configure and start the agency instance</p>
                    </div>
                    <button
                      type="button"
                      className={`relative inline-flex h-6 w-11 flex-shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-primary-600 focus:ring-offset-2 ${
                        formData.autoSetup ? 'bg-primary-600' : 'bg-gray-200'
                      }`}
                      onClick={() => handleChange('autoSetup', !formData.autoSetup)}
                    >
                      <span
                        className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${
                          formData.autoSetup ? 'translate-x-5' : 'translate-x-0'
                        }`}
                      />
                    </button>
                  </div>
                </div>
              </div>
            </form>
          </div>

          <div className="flex-shrink-0 flex justify-end space-x-3 p-4 sm:p-6 border-t border-gray-200 bg-gray-50">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Cancel
            </button>
            <button
              type="submit"
              form="add-agency-form"
              className="px-4 py-2 text-sm font-medium text-white bg-primary-600 border border-transparent rounded-md hover:bg-primary-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
            >
              Create Agency
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default AddAgencyModal