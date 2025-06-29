import axios from 'axios'

// Base API configuration for Owner Dashboard
const API_BASE_URL = import.meta.env.VITE_API_URL || 'https://leadestate-backend-9fih.onrender.com/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('ownerToken')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('ownerToken')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

// Owner Dashboard API endpoints
export const ownerAPI = {
  // Dashboard stats
  getDashboardStats: () => api.get('/owner-integration/dashboard/stats', {
    headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
  }),

  // Agencies management
  getAgencies: (params = {}) => api.get('/owner-integration/agencies', {
    params,
    headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
  }),
  createAgency: (data) => api.post('/owner-integration/create-agency', data, {
    headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
  }),
  updateAgency: (id, data) => api.put(`/owner-integration/agencies/${id}`, data, {
    headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
  }),
  deleteAgency: (id) => api.delete(`/owner-integration/agencies/${id}`, {
    headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
  }),
  getAgencyDetails: (id) => api.get(`/owner-integration/agencies/${id}`, {
    headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
  }),

  // Analytics
  getAnalytics: (timeRange = '30d') => api.get(`/owner/analytics?range=${timeRange}`),
  getRevenueData: (timeRange = '30d') => api.get(`/owner/analytics/revenue?range=${timeRange}`),
  getTopAgencies: () => api.get('/owner/analytics/top-agencies'),

  // Settings
  getSettings: () => api.get('/owner/settings'),
  updateSettings: (data) => api.put('/owner/settings', data),

  // Support
  getSupportTickets: () => api.get('/owner/support/tickets'),
  createSupportTicket: (data) => api.post('/owner/support/tickets', data),
  updateTicketStatus: (id, status) => api.put(`/owner/support/tickets/${id}/status`, { status }),

  // Authentication
  login: (credentials) => api.post('/owner/auth/login', credentials),
  logout: () => api.post('/owner/auth/logout'),
  refreshToken: () => api.post('/owner/auth/refresh'),
}

// Agency creation with repository setup
export const createAgencyWithRepo = async (agencyData) => {
  try {
    // Create agency with repositories using the backend endpoint
    const agencyResponse = await api.post('/owner-integration/create-agency', {
      agencyName: agencyData.name,
      managerName: agencyData.managerName,
      managerEmail: agencyData.managerEmail,
      domain: agencyData.domain,
      plan: agencyData.plan || 'standard',
      companySize: agencyData.companySize || 'small',
      customBranding: {
        primaryColor: '#3B82F6',
        logo: agencyData.logo || null
      },
      autoSetup: true,
      ownerInfo: {
        phone: agencyData.managerPhone,
        address: agencyData.address,
        city: agencyData.city,
        country: agencyData.country,
        description: agencyData.description
      }
    }, {
      headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
    })

    return agencyResponse.data
  } catch (error) {
    console.error('Error creating agency with repositories:', error)
    throw error
  }
}

// Utility functions
export const handleApiError = (error) => {
  if (error.response) {
    return error.response.data.message || 'An error occurred'
  } else if (error.request) {
    return 'Network error. Please check your connection.'
  } else {
    return 'An unexpected error occurred'
  }
}

export default api
