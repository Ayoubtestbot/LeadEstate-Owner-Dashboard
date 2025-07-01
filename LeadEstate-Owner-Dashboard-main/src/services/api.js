import axios from 'axios'

// API Configuration
const API_BASE_URL = 'https://leadestate-backend-9fih.onrender.com'

// Create axios instance
const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  }
})

// Request interceptor
api.interceptors.request.use(
  (config) => {
    console.log(`🌐 API Request: ${config.method?.toUpperCase()} ${config.url}`)
    return config
  },
  (error) => {
    console.error('❌ API Request Error:', error)
    return Promise.reject(error)
  }
)

// Response interceptor
api.interceptors.response.use(
  (response) => {
    console.log(`✅ API Response: ${response.status} ${response.config.url}`)
    return response
  },
  (error) => {
    console.error('❌ API Response Error:', error.response?.status, error.response?.data || error.message)
    return Promise.reject(error)
  }
)

// Error handler
export const handleApiError = (error) => {
  if (error.response) {
    // Server responded with error status
    const message = error.response.data?.message || `Server error: ${error.response.status}`
    console.error('API Error:', message)
    return message
  } else if (error.request) {
    // Request was made but no response received
    console.error('Network Error:', error.message)
    return 'Network error - please check your connection'
  } else {
    // Something else happened
    console.error('Error:', error.message)
    return error.message
  }
}

// Owner Dashboard API endpoints
export const ownerAPI = {
  // Dashboard stats
  getDashboardStats: () => api.get('/api/owner-integration/dashboard/stats', {
    headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
  }),

  // Agencies management
  getAgencies: (params = {}) => api.get('/api/owner-integration/agencies', {
    params,
    headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
  }),
  createAgency: (data) => api.post('/api/owner-integration/create-agency', data, {
    headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
  }),
  updateAgency: (id, data) => api.put(`/api/owner-integration/agencies/${id}`, data, {
    headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
  }),
  deleteAgency: (id) => api.delete(`/api/owner-integration/agencies/${id}`, {
    headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
  }),

  // Analytics
  getAnalytics: (params = {}) => api.get('/api/owner-integration/analytics', {
    params,
    headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
  }),

  // System health
  getSystemHealth: () => api.get('/api/owner-integration/system/health', {
    headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
  }),

  // Settings management
  getSettings: () => api.get('/api/owner-integration/settings', {
    headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
  }),
  updateSettings: (data) => api.put('/api/owner-integration/settings', data, {
    headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
  }),

  // Support management
  submitSupportTicket: (data) => api.post('/api/owner-integration/support/tickets', data, {
    headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
  }),
  getSupportTickets: () => api.get('/api/owner-integration/support/tickets', {
    headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
  }),
  getFAQs: () => api.get('/api/owner-integration/support/faqs', {
    headers: { 'x-owner-api-key': 'owner-dashboard-2024' }
  })
}

// Agency creation with repository setup
export const createAgencyWithRepo = async (agencyData) => {
  try {
    // Create agency with repositories using the backend endpoint
    const agencyResponse = await api.post('/api/owner-integration/create-agency', {
      agencyName: agencyData.name,
      managerName: agencyData.managerName,
      managerEmail: agencyData.managerEmail,
      city: agencyData.city, // ← FIXED: Add city at root level for backend
      domain: agencyData.domain,
      plan: agencyData.plan || 'standard',
      companySize: agencyData.companySize || 'small',
      description: agencyData.description,
      // Billing information
      billingCycle: agencyData.billingCycle || 'monthly',
      customPrice: agencyData.customPrice,
      paymentMethod: agencyData.paymentMethod || 'credit_card',
      billingEmail: agencyData.billingEmail,
      billingAddress: agencyData.billingAddress,
      taxId: agencyData.taxId,
      notes: agencyData.notes,
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

    console.log('✅ Agency created successfully:', agencyResponse.data)
    return agencyResponse.data

  } catch (error) {
    console.error('❌ Error creating agency:', error)
    const errorMessage = handleApiError(error)
    throw new Error(errorMessage)
  }
}

export default api
