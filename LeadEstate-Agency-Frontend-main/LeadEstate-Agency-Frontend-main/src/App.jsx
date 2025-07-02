import React, { useState, useEffect, createContext, useContext } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate, Link, useNavigate } from 'react-router-dom'
import toast, { Toaster } from 'react-hot-toast'
import axios from 'axios'
import {
  Home,
  Users,
  Building,
  Building2,
  BarChart3,
  Settings as SettingsIcon,
  UserCheck,
  Menu,
  LogOut,
  Plus,
  Search,
  Filter,
  Mail,
  Lock,
  Eye,
  EyeOff,
  Loader2
} from 'lucide-react'

// Import pages
import Dashboard from './pages/Dashboard'
import Leads from './pages/Leads'
import Properties from './pages/Properties'
import Team from './pages/Team'
import Analytics from './pages/Analytics'
import Settings from './pages/Settings'
import Automation from './pages/Automation'
import FollowUp from './pages/FollowUp'
import Clients from './pages/Clients'
import Tasks from './pages/Tasks'
import Reports from './pages/Reports'
import Profile from './pages/Profile'
import ResetPassword from './pages/ResetPassword'

// Import components
import Layout from './components/Layout'

// Import contexts
import { LanguageProvider, useLanguage } from './contexts/LanguageContext'
import { PermissionsProvider } from './contexts/PermissionsContext'
import { ToastProvider } from './components/Toast'

// API Configuration - Force correct backend URL
const API_URL = 'https://leadestate-backend-9fih.onrender.com/api'

// Debug API URL
console.log('🔧 Environment VITE_API_URL:', import.meta.env.VITE_API_URL)
console.log('🔧 Final API_URL:', API_URL)

// Auth Context
const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

// Data Context for leads and properties
const DataContext = createContext()

export const useData = () => {
  const context = useContext(DataContext)
  if (!context) {
    throw new Error('useData must be used within a DataProvider')
  }
  return context
}

// Data Provider Component
const DataProvider = ({ children }) => {
  const [leads, setLeads] = useState([])
  const [properties, setProperties] = useState([])
  const [teamMembers, setTeamMembers] = useState([])
  const [loading, setLoading] = useState(false)

  // Get language context for WhatsApp messages
  const { language } = useLanguage ? useLanguage() : { language: 'en' }

  // Fetch data from API on component mount
  useEffect(() => {
    fetchAllData()
  }, [])

  const fetchAllData = async () => {
    console.log('🔄 Fetching all data from API...')
    console.log('🌐 API_URL:', API_URL)
    setLoading(true)
    try {
      const [leadsRes, propertiesRes, teamRes] = await Promise.all([
        fetch(`${API_URL}/leads`).catch((err) => {
          console.error('❌ Error fetching leads:', err)
          return { ok: false }
        }),
        fetch(`${API_URL}/properties`).catch((err) => {
          console.error('❌ Error fetching properties:', err)
          return { ok: false }
        }),
        fetch(`${API_URL}/team`).catch((err) => {
          console.error('❌ Error fetching team:', err)
          return { ok: false }
        })
      ])

      console.log('📊 Leads response status:', leadsRes.status, leadsRes.ok)
      if (leadsRes.ok) {
        const leadsData = await leadsRes.json()
        console.log('✅ Leads data received:', leadsData)
        setLeads(leadsData.data || [])
      } else {
        console.warn('❌ Failed to fetch leads from API, status:', leadsRes.status)
        setLeads([])
      }

      console.log('🏠 Properties response status:', propertiesRes.status, propertiesRes.ok)
      if (propertiesRes.ok) {
        const propertiesData = await propertiesRes.json()
        console.log('✅ Properties data received:', propertiesData)
        setProperties(propertiesData.data || [])
      } else {
        console.warn('❌ Failed to fetch properties from API, status:', propertiesRes.status)
        setProperties([])
      }

      console.log('👥 Team response status:', teamRes.status, teamRes.ok)
      if (teamRes.ok) {
        const teamData = await teamRes.json()
        console.log('✅ Team data received:', teamData)
        setTeamMembers(teamData.data || [])
      } else {
        console.warn('❌ Failed to fetch team members from API, status:', teamRes.status)
        setTeamMembers([])
      }
    } catch (error) {
      console.error('Error fetching data:', error)
      // Set empty arrays as fallback
      setLeads([])
      setProperties([])
      setTeamMembers([])
    } finally {
      setLoading(false)
    }
  }

  // Refresh data function for real-time updates
  const refreshData = async (skipLoading = true) => {
    console.log('🔄 Refreshing all data...')

    if (!skipLoading) setLoading(true)

    try {
      const [leadsRes, propertiesRes, teamRes] = await Promise.all([
        fetch(`${API_URL}/leads`).catch(() => ({ ok: false })),
        fetch(`${API_URL}/properties`).catch(() => ({ ok: false })),
        fetch(`${API_URL}/team`).catch(() => ({ ok: false }))
      ])

      if (leadsRes.ok) {
        const leadsData = await leadsRes.json()
        setLeads(leadsData.data || [])
      }

      if (propertiesRes.ok) {
        const propertiesData = await propertiesRes.json()
        setProperties(propertiesData.data || [])
      }

      if (teamRes.ok) {
        const teamData = await teamRes.json()
        setTeamMembers(teamData.data || [])
      }

      console.log('✅ Data refreshed successfully')
    } catch (error) {
      console.error('Error refreshing data:', error)
    } finally {
      if (!skipLoading) setLoading(false)
    }
  }

  const addLead = async (leadData) => {
    try {
      const response = await fetch(`${API_URL}/leads`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...leadData,
          assignedTo: leadData.assignedTo || null,
          status: leadData.status || 'new',
          language: language || 'en' // Include user's language preference
        })
      })

      if (response.ok) {
        const result = await response.json()

        // Optimistic update: Update UI immediately and keep it
        setLeads(prev => [...prev, result.data])

        // Check if WhatsApp message was sent automatically
        if (result.whatsapp) {
          if (result.whatsapp.success && result.whatsapp.method === 'twilio') {
            console.log('📱 WhatsApp message sent automatically via Twilio!');
            // Could show a success notification here
          } else if (result.whatsapp.success && result.whatsapp.method === 'url_only') {
            console.log('📱 WhatsApp message prepared (Twilio not configured)');
            // Could offer to open WhatsApp manually
          }
        }

        // No background refresh needed - the optimistic update is reliable
        console.log('✅ Lead added and UI updated immediately')

        return result.data
      } else {
        throw new Error('Failed to add lead')
      }
    } catch (error) {
      console.error('Error adding lead:', error)
      throw error
    }
  }

  const sendWhatsAppWelcome = async (leadId) => {
    try {
      const response = await fetch(`${API_URL}/whatsapp/welcome/${leadId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const result = await response.json()
        console.log('📱 WhatsApp welcome message prepared:', result.data)

        // Show notification with WhatsApp link
        if (result.data.whatsappUrl) {
          const shouldOpen = window.confirm(
            `📱 WhatsApp welcome message ready for ${result.data.leadName}!\n\n` +
            `Agent: ${result.data.agent}\n\n` +
            `Click OK to open WhatsApp and send the welcome message.`
          );

          if (shouldOpen) {
            window.open(result.data.whatsappUrl, '_blank');
          }
        }

        return result.data
      } else {
        throw new Error('Failed to prepare WhatsApp message')
      }
    } catch (error) {
      console.error('Error preparing WhatsApp welcome:', error)
      throw error
    }
  }

  const addProperty = async (propertyData) => {
    try {
      const response = await fetch(`${API_URL}/properties`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData)
      })

      if (response.ok) {
        const result = await response.json()

        // Optimistic update: Update UI immediately and keep it
        setProperties(prev => [...prev, result.data])

        console.log('✅ Property added and UI updated immediately')

        return result.data
      } else {
        throw new Error('Failed to add property')
      }
    } catch (error) {
      console.error('Error adding property:', error)
      throw error
    }
  }

  const addTeamMember = async (memberData) => {
    try {
      console.log('🔄 Adding team member:', memberData)
      console.log('🌐 API URL:', `${API_URL}/team`)

      const response = await fetch(`${API_URL}/team`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData)
      })

      console.log('📡 Response status:', response.status)
      console.log('📡 Response ok:', response.ok)

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Team member added successfully:', result)

        // Optimistic update: Update UI immediately and keep it
        setTeamMembers(prev => [...prev, result.data])

        return result.data
      } else {
        const errorText = await response.text()
        console.error('❌ API Error:', response.status, errorText)
        throw new Error(`Failed to add team member: ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Error adding team member:', error)
      throw error
    }
  }

  const updateTeamMember = async (id, memberData) => {
    try {
      const response = await fetch(`${API_URL}/team/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(memberData)
      })

      if (response.ok) {
        const result = await response.json()

        // Update UI immediately with server response
        setTeamMembers(prev => prev.map(member =>
          member.id === id ? result.data : member
        ))

        console.log('✅ Team member updated successfully:', result.data)
        return result.data
      } else {
        throw new Error('Failed to update team member')
      }
    } catch (error) {
      console.error('Error updating team member:', error)
      // Fallback to local update if API fails
      setTeamMembers(prev => prev.map(member =>
        member.id === id ? { ...member, ...memberData } : member
      ))
      throw error
    }
  }

  const deleteTeamMember = (id) => {
    setTeamMembers(prev => prev.filter(member => member.id !== id))
  }

  const updateLead = async (id, leadData) => {
    try {
      const response = await fetch(`${API_URL}/leads/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(leadData)
      })

      if (response.ok) {
        const result = await response.json()

        // Optimistic update: Update UI immediately and keep it
        setLeads(prev => prev.map(lead =>
          lead.id === id ? result.data : lead
        ))

        return result.data
      } else {
        throw new Error('Failed to update lead')
      }
    } catch (error) {
      console.error('Error updating lead:', error)
      // Fallback to local update if API fails
      setLeads(prev => prev.map(lead =>
        lead.id === id ? { ...lead, ...leadData } : lead
      ))
    }
  }

  const deleteLead = (id) => {
    setLeads(prev => prev.filter(lead => lead.id !== id))
  }

  const updateProperty = async (id, propertyData) => {
    try {
      const response = await fetch(`${API_URL}/properties/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(propertyData)
      })

      if (response.ok) {
        const result = await response.json()

        // Update UI immediately with server response
        setProperties(prev => prev.map(property =>
          property.id === id ? result.data : property
        ))

        console.log('✅ Property updated successfully:', result.data)
        return result.data
      } else {
        throw new Error('Failed to update property')
      }
    } catch (error) {
      console.error('Error updating property:', error)
      // Fallback to local update if API fails
      setProperties(prev => prev.map(property =>
        property.id === id ? { ...property, ...propertyData } : property
      ))
      throw error
    }
  }

  const deleteProperty = (id) => {
    setProperties(prev => prev.filter(property => property.id !== id))
  }

  const linkPropertyToLead = async (leadId, propertyId) => {
    console.log('🔗 Linking property:', { leadId, propertyId })
    try {
      const response = await fetch(`${API_URL}/leads/${leadId}/link-property/${propertyId}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      console.log('🔗 Link response status:', response.status)

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Property linked to lead successfully:', result)

        // Update local state with the returned data
        setLeads(prev => prev.map(lead =>
          lead.id === leadId ? {
            ...lead,
            interestedProperties: JSON.parse(result.data.interested_properties || '[]')
          } : lead
        ))
      } else {
        const errorText = await response.text()
        console.error('❌ Link failed with status:', response.status, errorText)
        throw new Error(`Failed to link property: ${response.status}`)
      }
    } catch (error) {
      console.error('❌ Error linking property to lead:', error)
      // Fallback to local update if API fails
      console.log('🔄 Using fallback local update')
      setLeads(prev => prev.map(lead => {
        if (lead.id === leadId) {
          const currentProperties = lead.interestedProperties || []
          if (!currentProperties.includes(propertyId)) {
            const updated = { ...lead, interestedProperties: [...currentProperties, propertyId] }
            console.log('🔄 Fallback updated lead:', updated)
            return updated
          }
        }
        return lead
      }))
    }
  }

  const unlinkPropertyFromLead = async (leadId, propertyId) => {
    try {
      const response = await fetch(`${API_URL}/leads/${leadId}/unlink-property/${propertyId}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        }
      })

      if (response.ok) {
        const result = await response.json()
        console.log('✅ Property unlinked from lead successfully')

        // Update local state with the returned data
        setLeads(prev => prev.map(lead =>
          lead.id === leadId ? {
            ...lead,
            interestedProperties: JSON.parse(result.data.interested_properties || '[]')
          } : lead
        ))
      } else {
        throw new Error('Failed to unlink property')
      }
    } catch (error) {
      console.error('Error unlinking property from lead:', error)
      // Fallback to local update if API fails
      setLeads(prev => prev.map(lead => {
        if (lead.id === leadId) {
          const currentProperties = lead.interestedProperties || []
          return { ...lead, interestedProperties: currentProperties.filter(id => id !== propertyId) }
        }
        return lead
      }))
    }
  }

  const clearAllData = () => {
    setLeads([])
    setProperties([])
    setTeamMembers([])
    localStorage.removeItem('leadestate_leads')
    localStorage.removeItem('leadestate_properties')
    localStorage.removeItem('leadestate_team_members')
  }

  const value = {
    leads,
    properties,
    teamMembers,
    loading,
    setLeads,
    setProperties,
    setTeamMembers,
    addLead,
    addProperty,
    addTeamMember,
    updateTeamMember,
    deleteTeamMember,
    updateLead,
    deleteLead,
    updateProperty,
    deleteProperty,
    linkPropertyToLead,
    unlinkPropertyFromLead,
    refreshData
  }

  return (
    <DataContext.Provider value={value}>
      {children}
    </DataContext.Provider>
  )
}

// Auth Provider
const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let token = localStorage.getItem('token')

    // If no token exists, create a demo token for development
    if (!token) {
      token = 'demo-token-' + Date.now()
      localStorage.setItem('token', token)
    }

    // Create a demo user
    setUser({
      firstName: 'Demo User',
      name: 'Demo User',
      role: 'manager',
      email: 'demo@agency.com'
    })

    setLoading(false)
  }, [])

  const login = async (credentials) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/auth/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (response.ok) {
        localStorage.setItem('token', data.token)
        setUser(data.user)
        toast.success('Login successful!')
        return { success: true }
      } else {
        toast.error(data.message || 'Invalid credentials')
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      toast.error('Login failed. Please check your connection.')
      return { success: false, message: 'Login failed' }
    } finally {
      setLoading(false)
    }
  }

  const forgotPassword = async (email) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/auth/forgot-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Password reset email sent!')
        return { success: true }
      } else {
        toast.error(data.message || 'Failed to send reset email')
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      toast.error('Failed to send reset email')
      return { success: false, message: 'Failed to send reset email' }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true)
      const response = await fetch(`${API_URL}/auth/reset-password`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ token, newPassword }),
      })

      const data = await response.json()

      if (response.ok) {
        toast.success('Password reset successfully!')
        return { success: true }
      } else {
        toast.error(data.message || 'Failed to reset password')
        return { success: false, message: data.message }
      }
    } catch (error) {
      console.error('Reset password error:', error)
      toast.error('Failed to reset password')
      return { success: false, message: 'Failed to reset password' }
    } finally {
      setLoading(false)
    }
  }

  const verifyToken = async () => {
    try {
      const token = localStorage.getItem('token')
      if (!token) return false

      const response = await fetch(`${API_URL}/auth/verify`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      })

      if (response.ok) {
        const data = await response.json()
        setUser(data.user)
        return true
      } else {
        localStorage.removeItem('token')
        setUser(null)
        return false
      }
    } catch (error) {
      console.error('Token verification error:', error)
      localStorage.removeItem('token')
      setUser(null)
      return false
    }
  }

  const logout = async () => {
    try {
      const token = localStorage.getItem('token')
      if (token) {
        await fetch(`${API_URL}/auth/logout`, {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('token')
      setUser(null)
      toast.success('Logged out successfully')
    }
  }

  // Check authentication status on app load
  useEffect(() => {
    const checkAuth = async () => {
      const isValid = await verifyToken()
      if (!isValid) {
        setLoading(false)
      } else {
        setLoading(false)
      }
    }
    checkAuth()
  }, [])

  return (
    <AuthContext.Provider value={{
      user,
      login,
      logout,
      forgotPassword,
      resetPassword,
      verifyToken,
      loading
    }}>
      {children}
    </AuthContext.Provider>
  )
}

// Login Component
const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [errors, setErrors] = useState({})
  const { login, forgotPassword, loading } = useAuth()
  const navigate = useNavigate()

  const validateForm = () => {
    const newErrors = {}
    if (!email) {
      newErrors.email = 'Email is required'
    } else if (!/\S+@\S+\.\S+/.test(email)) {
      newErrors.email = 'Please enter a valid email'
    }
    if (!password && !showForgotPassword) {
      newErrors.password = 'Password is required'
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    if (showForgotPassword) {
      if (!email) {
        setErrors({ email: 'Email is required' })
        return
      }
      const result = await forgotPassword(email)
      if (result.success) {
        setShowForgotPassword(false)
        setEmail('')
      }
      return
    }

    if (!validateForm()) return

    const result = await login({ email, password })
    if (result.success) {
      navigate('/dashboard')
    }
  }

  const handleInputChange = (field, value) => {
    if (field === 'email') setEmail(value)
    if (field === 'password') setPassword(value)

    // Clear errors when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: '' }))
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="flex justify-center">
            <div className="bg-blue-600 p-3 rounded-full">
              <Building2 className="h-8 w-8 text-white" />
            </div>
          </div>
          <h2 className="mt-6 text-3xl font-extrabold text-gray-900">
            {showForgotPassword ? 'Reset Password' : 'LeadEstate CRM'}
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            {showForgotPassword
              ? 'Enter your email to receive a reset link'
              : 'Sign in to your agency dashboard'
            }
          </p>
        </div>

        <form className="mt-8 space-y-6" onSubmit={handleSubmit}>
          <div className="space-y-4">
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                Email Address
              </label>
              <div className="mt-1 relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Mail className="h-5 w-5 text-gray-400" />
                </div>
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  className={`appearance-none relative block w-full pl-10 pr-3 py-2 border ${
                    errors.email ? 'border-red-300' : 'border-gray-300'
                  } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && (
                <p className="mt-1 text-sm text-red-600">{errors.email}</p>
              )}
            </div>

            {/* Password Field - Hidden in forgot password mode */}
            {!showForgotPassword && (
              <div>
                <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                  Password
                </label>
                <div className="mt-1 relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-gray-400" />
                  </div>
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    required
                    value={password}
                    onChange={(e) => handleInputChange('password', e.target.value)}
                    className={`appearance-none relative block w-full pl-10 pr-10 py-2 border ${
                      errors.password ? 'border-red-300' : 'border-gray-300'
                    } placeholder-gray-500 text-gray-900 rounded-md focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm`}
                    placeholder="Enter your password"
                  />
                  <button
                    type="button"
                    className="absolute inset-y-0 right-0 pr-3 flex items-center"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    ) : (
                      <Eye className="h-5 w-5 text-gray-400 hover:text-gray-600" />
                    )}
                  </button>
                </div>
                {errors.password && (
                  <p className="mt-1 text-sm text-red-600">{errors.password}</p>
                )}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div>
            <button
              type="submit"
              disabled={loading}
              className="group relative w-full flex justify-center py-2 px-4 border border-transparent text-sm font-medium rounded-md text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {loading ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  {showForgotPassword ? 'Sending...' : 'Signing in...'}
                </>
              ) : (
                showForgotPassword ? 'Send Reset Link' : 'Sign in'
              )}
            </button>
          </div>

          {/* Toggle between login and forgot password */}
          <div className="text-center">
            <button
              type="button"
              onClick={() => {
                setShowForgotPassword(!showForgotPassword)
                setErrors({})
                setPassword('')
              }}
              className="text-blue-600 hover:text-blue-500 font-medium text-sm"
            >
              {showForgotPassword ? 'Back to login' : 'Forgot your password?'}
            </button>
          </div>
        </form>

        {/* Demo Credentials */}
        {!showForgotPassword && (
          <div className="mt-6 p-4 bg-blue-50 rounded-md">
            <h3 className="text-sm font-medium text-blue-800 mb-2">Demo Credentials</h3>
            <div className="text-xs text-blue-700 space-y-1">
              <p><strong>Manager:</strong> manager@agency.com / password123</p>
              <p><strong>Agent:</strong> agent@agency.com / password123</p>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

// Sidebar Component
const Sidebar = ({ sidebarOpen, setSidebarOpen }) => {
  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: Home },
    { name: 'Leads', href: '/leads', icon: Users },
    { name: 'Properties', href: '/properties', icon: Building },
    { name: 'Team', href: '/team', icon: UserCheck },
    { name: 'Analytics', href: '/analytics', icon: BarChart3 },
    { name: 'Settings', href: '/settings', icon: SettingsIcon },
  ]

  return (
    <div className={`${sidebarOpen ? 'block' : 'hidden'} fixed inset-0 z-40 lg:relative lg:inset-0 lg:block lg:w-64 lg:flex-shrink-0`}>
      <div className="flex flex-col w-64 bg-white border-r border-gray-200 h-full">
        <div className="flex items-center h-16 px-6 border-b border-gray-200">
          <h1 className="text-xl font-bold text-gray-900">LeadEstate</h1>
        </div>
        <nav className="flex-1 px-4 py-6 space-y-2">
          {navigation.map((item) => (
            <Link
              key={item.name}
              to={item.href}
              className="flex items-center px-3 py-2 text-sm font-medium text-gray-600 rounded-md hover:bg-gray-50 hover:text-gray-900"
            >
              <item.icon className="w-5 h-5 mr-3" />
              {item.name}
            </Link>
          ))}
        </nav>
      </div>
    </div>
  )
}

// Header Component
const Header = ({ setSidebarOpen }) => {
  const { user, logout } = useAuth()

  return (
    <header className="bg-white border-b border-gray-200">
      <div className="flex items-center justify-between h-16 px-6">
        <button
          type="button"
          className="lg:hidden p-2 rounded-md text-gray-400 hover:text-gray-500 hover:bg-gray-100"
          onClick={() => setSidebarOpen(true)}
        >
          <Menu className="h-6 w-6" />
        </button>
        
        <div className="flex items-center space-x-4">
          <span className="text-sm text-gray-700">
            Welcome, {user?.firstName || 'User'}
          </span>
          <button
            onClick={logout}
            className="flex items-center px-3 py-2 text-sm text-gray-700 hover:text-gray-900"
          >
            <LogOut className="h-4 w-4 mr-2" />
            Logout
          </button>
        </div>
      </div>
    </header>
  )
}



// Rename Settings to avoid conflict with SettingsIcon
const SettingsPage = Settings

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  return user ? children : <Navigate to="/login" replace />
}



// Main App Component
function App() {
  return (
    <AuthProvider>
      <LanguageProvider>
        <AppWithAuth />
      </LanguageProvider>
    </AuthProvider>
  )
}

// Component that has access to auth context
function AppWithAuth() {
  const { user } = useAuth()

  // Debug: Log user object
  console.log('AppWithAuth user:', user)

  return (
    <PermissionsProvider userRole={user?.role || 'manager'}>
      <ToastProvider>
        <DataProvider>
          <Router>
          <div className="App">
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/reset-password" element={<ResetPassword />} />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Layout>
                    <Dashboard />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/leads" element={
                <ProtectedRoute>
                  <Layout>
                    <Leads />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/properties" element={
                <ProtectedRoute>
                  <Layout>
                    <Properties />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/team" element={
                <ProtectedRoute>
                  <Layout>
                    <Team />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/analytics" element={
                <ProtectedRoute>
                  <Layout>
                    <Analytics />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/settings" element={
                <ProtectedRoute>
                  <Layout>
                    <SettingsPage />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/automation" element={
                <ProtectedRoute>
                  <Layout>
                    <Automation />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/follow-up" element={
                <ProtectedRoute>
                  <Layout>
                    <FollowUp />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/clients" element={
                <ProtectedRoute>
                  <Layout>
                    <Clients />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/tasks" element={
                <ProtectedRoute>
                  <Layout>
                    <Tasks />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/reports" element={
                <ProtectedRoute>
                  <Layout>
                    <Reports />
                  </Layout>
                </ProtectedRoute>
              } />
              <Route path="/profile" element={
                <ProtectedRoute>
                  <Layout>
                    <Profile />
                  </Layout>
                </ProtectedRoute>
              } />
            </Routes>
            <Toaster position="top-right" />
          </div>
        </Router>
      </DataProvider>
    </ToastProvider>
    </PermissionsProvider>
  )
}

export default App
