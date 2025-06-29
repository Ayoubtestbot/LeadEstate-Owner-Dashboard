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
  getDashboardStats: () => api.get('/owner/dashboard/stats'),

  // Agencies management
  getAgencies: (params = {}) => api.get('/owner/agencies', { params }),
  createAgency: (data) => api.post('/owner/agencies', data),
  updateAgency: (id, data) => api.put(`/owner/agencies/${id}`, data),
  deleteAgency: (id) => api.delete(`/owner/agencies/${id}`),
  getAgencyDetails: (id) => api.get(`/owner/agencies/${id}`),

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
    // Step 1: Create agency in database
    const agencyResponse = await ownerAPI.createAgency(agencyData)
    const agency = agencyResponse.data

    // Step 2: Create GitHub repositories (backend, frontend, database)
    const repoResponse = await api.post('/owner/agencies/create-repositories', {
      agencyId: agency.id,
      agencyName: agencyData.name,
      managerEmail: agencyData.managerEmail,
    })

    // Step 3: Deploy to hosting platforms
    const deployResponse = await api.post('/owner/agencies/deploy', {
      agencyId: agency.id,
      repositories: repoResponse.data.repositories,
    })

    return {
      agency,
      repositories: repoResponse.data.repositories,
      deployments: deployResponse.data.deployments,
    }
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
