import React, { createContext, useContext, useState, useEffect } from 'react'
import { ownerAPI } from '../services/api'
import toast from 'react-hot-toast'

const AuthContext = createContext()

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  // Check if user is authenticated on app load
  useEffect(() => {
    checkAuthStatus()
  }, [])

  const checkAuthStatus = async () => {
    try {
      const token = localStorage.getItem('owner_token')
      if (!token) {
        setLoading(false)
        return
      }

      // Verify token with backend
      const response = await ownerAPI.get('/auth/owner/verify', {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        setUser(response.data.user)
        setIsAuthenticated(true)
      } else {
        // Token is invalid, remove it
        localStorage.removeItem('owner_token')
        setUser(null)
        setIsAuthenticated(false)
      }
    } catch (error) {
      console.error('Auth check failed:', error)
      localStorage.removeItem('owner_token')
      setUser(null)
      setIsAuthenticated(false)
    } finally {
      setLoading(false)
    }
  }

  const login = async (email, password) => {
    try {
      setLoading(true)

      const response = await ownerAPI.post('/auth/owner/login', {
        email,
        password
      })

      if (response.data.success) {
        const { token, user } = response.data.data

        // Store token in localStorage
        localStorage.setItem('owner_token', token)

        // Update state
        setUser(user)
        setIsAuthenticated(true)

        toast.success('Welcome back!')
        return { success: true }
      } else {
        toast.error(response.data.message || 'Login failed')
        return { success: false, error: response.data.message }
      }
    } catch (error) {
      console.error('Login error:', error)
      const errorMessage = error.response?.data?.message || 'Login failed. Please try again.'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      // Call logout endpoint to invalidate token on server
      const token = localStorage.getItem('owner_token')
      if (token) {
        await ownerAPI.post('/auth/owner/logout', {}, {
          headers: { Authorization: `Bearer ${token}` }
        })
      }
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      // Clear local state regardless of API call result
      localStorage.removeItem('owner_token')
      setUser(null)
      setIsAuthenticated(false)
      toast.success('Logged out successfully')
    }
  }

  const forgotPassword = async (email) => {
    try {
      setLoading(true)

      const response = await ownerAPI.post('/auth/owner/forgot-password', {
        email
      })

      if (response.data.success) {
        toast.success('Password reset email sent! Check your inbox.')
        return { success: true }
      } else {
        toast.error(response.data.message || 'Failed to send reset email')
        return { success: false, error: response.data.message }
      }
    } catch (error) {
      console.error('Forgot password error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to send reset email'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const resetPassword = async (token, newPassword) => {
    try {
      setLoading(true)

      const response = await ownerAPI.post('/auth/owner/reset-password', {
        token,
        newPassword
      })

      if (response.data.success) {
        toast.success('Password reset successfully! Please login with your new password.')
        return { success: true }
      } else {
        toast.error(response.data.message || 'Failed to reset password')
        return { success: false, error: response.data.message }
      }
    } catch (error) {
      console.error('Reset password error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to reset password'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const updateProfile = async (profileData) => {
    try {
      setLoading(true)
      
      const token = localStorage.getItem('owner_token')
      const response = await ownerAPI.put('/auth/profile', profileData, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        setUser(response.data.user)
        toast.success('Profile updated successfully!')
        return { success: true }
      } else {
        toast.error(response.data.message || 'Failed to update profile')
        return { success: false, error: response.data.message }
      }
    } catch (error) {
      console.error('Update profile error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to update profile'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true)
      
      const token = localStorage.getItem('owner_token')
      const response = await ownerAPI.post('/auth/change-password', {
        currentPassword,
        newPassword
      }, {
        headers: { Authorization: `Bearer ${token}` }
      })

      if (response.data.success) {
        toast.success('Password changed successfully!')
        return { success: true }
      } else {
        toast.error(response.data.message || 'Failed to change password')
        return { success: false, error: response.data.message }
      }
    } catch (error) {
      console.error('Change password error:', error)
      const errorMessage = error.response?.data?.message || 'Failed to change password'
      toast.error(errorMessage)
      return { success: false, error: errorMessage }
    } finally {
      setLoading(false)
    }
  }

  const value = {
    user,
    loading,
    isAuthenticated,
    login,
    logout,
    forgotPassword,
    resetPassword,
    updateProfile,
    changePassword,
    checkAuthStatus
  }

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  )
}
