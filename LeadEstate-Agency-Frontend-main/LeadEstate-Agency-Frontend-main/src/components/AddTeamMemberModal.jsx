import { useState } from 'react'
import { X, User, Mail, Crown, Star } from 'lucide-react'
import { USER_ROLES, ROLE_DISPLAY_NAMES } from '../contexts/PermissionsContext'
import PhoneInput from './PhoneInput'

const AddTeamMemberModal = ({ isOpen, onClose, onSubmit }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    role: USER_ROLES?.AGENT || 'agent'
  })
  const [errors, setErrors] = useState({})

  if (!isOpen) return null

  // Debug: Log to see if modal is being called
  console.log('AddTeamMemberModal rendering, isOpen:', isOpen)

  const handleSubmit = (e) => {
    e.preventDefault()

    try {
      // Validation
      const newErrors = {}
      if (!formData.name.trim()) newErrors.name = 'Name is required'
      if (!formData.email.trim()) newErrors.email = 'Email is required'
      if (!formData.phone.trim()) newErrors.phone = 'Phone is required'
      if (!/\S+@\S+\.\S+/.test(formData.email)) newErrors.email = 'Invalid email format'

      if (Object.keys(newErrors).length > 0) {
        setErrors(newErrors)
        return
      }

      console.log('Submitting team member:', formData)
      onSubmit(formData)
      setFormData({ name: '', email: '', phone: '', role: USER_ROLES?.AGENT || 'agent' })
      setErrors({})
      onClose()
    } catch (error) {
      console.error('Error submitting team member:', error)
    }
  }

  const handleChange = (field, value) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  const getRoleIcon = (role) => {
    if (!USER_ROLES) return User

    switch (role) {
      case USER_ROLES.MANAGER: return Crown
      case USER_ROLES.SUPER_AGENT: return Star
      default: return User
    }
  }

  try {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full">
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <h2 className="text-xl font-semibold text-gray-900">Add Team Member</h2>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {/* Name */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Full Name *
            </label>
            <input
              type="text"
              value={formData.name}
              onChange={(e) => handleChange('name', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.name ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter full name"
            />
            {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
          </div>

          {/* Email */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Email Address *
            </label>
            <input
              type="email"
              value={formData.email}
              onChange={(e) => handleChange('email', e.target.value)}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                errors.email ? 'border-red-300' : 'border-gray-300'
              }`}
              placeholder="Enter email address"
            />
            {errors.email && <p className="text-red-500 text-xs mt-1">{errors.email}</p>}
          </div>

          {/* Phone */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Phone Number *
            </label>
            <PhoneInput
              name="phone"
              value={formData.phone}
              onChange={(e) => handleChange('phone', e.target.value)}
              placeholder="Enter phone number"
              required
              className={errors.phone ? 'border-red-300' : ''}
            />
            {errors.phone && <p className="text-red-500 text-xs mt-1">{errors.phone}</p>}
          </div>

          {/* Role */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Role *
            </label>
            <div className="space-y-2">
              {Object.values(USER_ROLES).map(role => {
                const RoleIcon = getRoleIcon(role)
                return (
                  <label key={role} className="flex items-center">
                    <input
                      type="radio"
                      name="role"
                      value={role}
                      checked={formData.role === role}
                      onChange={(e) => handleChange('role', e.target.value)}
                      className="mr-3"
                    />
                    <RoleIcon className="h-4 w-4 mr-2 text-gray-600" />
                    <span className="text-sm">{ROLE_DISPLAY_NAMES[role]}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {/* Buttons */}
          <div className="flex space-x-3 pt-4">
            <button
              type="button"
              onClick={onClose}
              className="flex-1 px-4 py-2 text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              Add Member
            </button>
          </div>
        </form>
        </div>
      </div>
    )
  } catch (error) {
    console.error('Error rendering AddTeamMemberModal:', error)
    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
        <div className="bg-white rounded-lg shadow-xl max-w-md w-full p-6">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Error</h2>
          <p className="text-red-600 mb-4">There was an error loading the form. Please try again.</p>
          <button
            onClick={onClose}
            className="w-full px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700"
          >
            Close
          </button>
        </div>
      </div>
    )
  }
}

export default AddTeamMemberModal
