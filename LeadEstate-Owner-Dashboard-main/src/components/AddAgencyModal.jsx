import React, { useState } from 'react'
import { X, Building2, User, Mail, Phone, MapPin, Loader, CreditCard, DollarSign } from 'lucide-react'
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
    // Billing Information
    plan: 'standard',
    billingCycle: 'monthly',
    customPrice: '',
    paymentMethod: 'credit_card',
    billingEmail: '',
    billingAddress: '',
    taxId: '',
    notes: ''
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
      if (!formData.name || !formData.managerName || !formData.managerEmail || !formData.plan) {
        toast.error('Please fill in all required fields')
        return
      }

      // Validate custom price if custom plan selected
      if (formData.plan === 'custom' && (!formData.customPrice || formData.customPrice <= 0)) {
        toast.error('Please enter a valid custom price')
        return
      }

      // Create agency with repositories
      const result = await createAgencyWithRepo(formData)

      console.log('Agency creation result:', result) // Debug log

      // Show success message (with demo mode indicator if applicable)
      const message = result.data?.demoMode
        ? `Agency "${formData.name}" created successfully! (Demo Mode)`
        : `Agency "${formData.name}" created successfully!`

      toast.success(message)

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

      // Notify parent component with the correct data structure
      if (onAgencyCreated) {
        // Handle both axios response (result.data) and direct response (result)
        const agencyData = result.data?.data || result.data || result
        onAgencyCreated(agencyData)
      }

      // Close modal
      onClose()
      
    } catch (error) {
      console.error('Error creating agency:', error)
      toast.error(error.message || 'Failed to create agency')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center">
            <Building2 className="h-6 w-6 text-blue-600 mr-3" />
            <h3 className="text-lg font-medium text-gray-900">Add New Agency</h3>
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

          {/* Billing Information */}
          <div>
            <h4 className="text-md font-medium text-gray-900 mb-4 flex items-center">
              <CreditCard className="h-5 w-5 mr-2 text-blue-600" />
              Billing & Plan Information
            </h4>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Plan Selection */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Subscription Plan *
                </label>
                <select
                  name="plan"
                  value={formData.plan}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  required
                >
                  <option value="basic">Basic - $49/month (Up to 10 users)</option>
                  <option value="standard">Standard - $99/month (Up to 50 users)</option>
                  <option value="premium">Premium - $199/month (Up to 100 users)</option>
                  <option value="enterprise">Enterprise - $399/month (Unlimited users)</option>
                  <option value="custom">Custom Plan</option>
                </select>
              </div>

              {/* Billing Cycle */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Cycle
                </label>
                <select
                  name="billingCycle"
                  value={formData.billingCycle}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="monthly">Monthly</option>
                  <option value="quarterly">Quarterly (5% discount)</option>
                  <option value="yearly">Yearly (10% discount)</option>
                </select>
              </div>

              {/* Custom Price (only show if custom plan selected) */}
              {formData.plan === 'custom' && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Custom Price (per month)
                  </label>
                  <div className="relative">
                    <DollarSign className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <input
                      type="number"
                      name="customPrice"
                      value={formData.customPrice}
                      onChange={handleInputChange}
                      className="w-full pl-10 pr-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                      placeholder="299"
                      min="0"
                      step="0.01"
                    />
                  </div>
                </div>
              )}

              {/* Payment Method */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Payment Method
                </label>
                <select
                  name="paymentMethod"
                  value={formData.paymentMethod}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="credit_card">Credit Card</option>
                  <option value="bank_transfer">Bank Transfer</option>
                  <option value="paypal">PayPal</option>
                  <option value="invoice">Invoice (Net 30)</option>
                </select>
              </div>

              {/* Billing Email */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Billing Email
                </label>
                <input
                  type="email"
                  name="billingEmail"
                  value={formData.billingEmail}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="billing@agency.com"
                />
              </div>

              {/* Tax ID */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Tax ID / VAT Number
                </label>
                <input
                  type="text"
                  name="taxId"
                  value={formData.taxId}
                  onChange={handleInputChange}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                  placeholder="US123456789"
                />
              </div>
            </div>

            {/* Billing Address */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Address
              </label>
              <textarea
                name="billingAddress"
                value={formData.billingAddress}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="123 Business St, Suite 100, City, State 12345"
              />
            </div>

            {/* Notes */}
            <div className="mt-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Billing Notes
              </label>
              <textarea
                name="notes"
                value={formData.notes}
                onChange={handleInputChange}
                rows={2}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-blue-500 focus:border-blue-500"
                placeholder="Special billing instructions or notes..."
              />
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
