import axios from 'axios';

class ApiService {
  constructor() {
    this.baseURL = import.meta.env.VITE_API_URL || 'http://localhost:6001';
    this.ownerApiKey = import.meta.env.VITE_OWNER_API_KEY;
    
    // Create axios instance
    this.api = axios.create({
      baseURL: this.baseURL,
      timeout: 30000,
      headers: {
        'Content-Type': 'application/json',
        'x-owner-api-key': this.ownerApiKey
      }
    });

    // Add request interceptor for logging
    this.api.interceptors.request.use(
      (config) => {
        console.log('🚀 API Request:', config.method?.toUpperCase(), config.url);
        return config;
      },
      (error) => {
        console.error('❌ API Request Error:', error);
        return Promise.reject(error);
      }
    );

    // Add response interceptor for error handling
    this.api.interceptors.response.use(
      (response) => {
        console.log('✅ API Response:', response.status, response.config.url);
        return response;
      },
      (error) => {
        console.error('❌ API Response Error:', error.response?.status, error.response?.data);
        return Promise.reject(error);
      }
    );
  }

  // Create new agency with repositories
  async createAgency(agencyData) {
    try {
      console.log('🏢 Creating agency:', agencyData.agencyName);
      
      const payload = {
        agencyName: agencyData.agencyName,
        managerName: agencyData.ownerName, // Using ownerName as manager name
        managerEmail: agencyData.ownerEmail,
        domain: agencyData.domain ? `${agencyData.domain}.leadestate.com` : null,
        plan: agencyData.plan,
        companySize: agencyData.companySize,
        customBranding: {
          primaryColor: agencyData.customBranding?.primaryColor || '#3B82F6',
          secondaryColor: agencyData.customBranding?.secondaryColor || '#1E40AF',
          logo: agencyData.customBranding?.logo || ''
        },
        autoSetup: agencyData.autoSetup || true,
        ownerInfo: {
          name: import.meta.env.VITE_OWNER_NAME || 'LeadEstate Owner',
          email: import.meta.env.VITE_OWNER_EMAIL || 'owner@leadestate.com'
        }
      };

      const response = await this.api.post('/api/owner-integration/create-agency', payload);
      
      console.log('✅ Agency created successfully:', response.data);
      return {
        success: true,
        data: response.data.data
      };

    } catch (error) {
      console.error('❌ Error creating agency:', error);
      
      const errorMessage = error.response?.data?.message || error.message || 'Failed to create agency';
      
      return {
        success: false,
        error: errorMessage,
        details: error.response?.data
      };
    }
  }

  // Get all agencies
  async getAgencies(filters = {}) {
    try {
      const params = new URLSearchParams();
      
      if (filters.status) params.append('status', filters.status);
      if (filters.search) params.append('search', filters.search);
      if (filters.limit) params.append('limit', filters.limit);
      if (filters.offset) params.append('offset', filters.offset);

      const response = await this.api.get(`/api/owner-integration/agencies?${params}`);
      
      return {
        success: true,
        data: response.data.data,
        count: response.data.count,
        pagination: response.data.pagination
      };

    } catch (error) {
      console.error('❌ Error fetching agencies:', error);
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch agencies',
        details: error.response?.data
      };
    }
  }

  // Get specific agency details
  async getAgency(agencyId) {
    try {
      const response = await this.api.get(`/api/owner-integration/agency/${agencyId}`);
      
      return {
        success: true,
        data: response.data.data
      };

    } catch (error) {
      console.error('❌ Error fetching agency:', error);
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to fetch agency',
        details: error.response?.data
      };
    }
  }

  // Update agency status
  async updateAgencyStatus(agencyId, status, reason = '') {
    try {
      const response = await this.api.put(`/api/owner-integration/agency/${agencyId}/status`, {
        status,
        reason
      });
      
      return {
        success: true,
        data: response.data.data
      };

    } catch (error) {
      console.error('❌ Error updating agency status:', error);
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'Failed to update agency status',
        details: error.response?.data
      };
    }
  }

  // Get system statistics
  async getSystemStats() {
    try {
      // This would call a system stats endpoint when available
      const response = await this.api.get('/api/owner-integration/stats');
      
      return {
        success: true,
        data: response.data.data
      };

    } catch (error) {
      console.error('❌ Error fetching system stats:', error);
      
      // Return mock data for now
      return {
        success: true,
        data: {
          totalAgencies: 0,
          activeAgencies: 0,
          totalUsers: 0,
          totalLeads: 0,
          totalRevenue: '$0'
        }
      };
    }
  }

  // Test API connection
  async testConnection() {
    try {
      const response = await this.api.get('/api/owner-integration/agencies?limit=1');
      
      return {
        success: true,
        message: 'API connection successful',
        data: response.data
      };

    } catch (error) {
      console.error('❌ API connection test failed:', error);
      
      return {
        success: false,
        error: error.response?.data?.message || error.message || 'API connection failed',
        details: error.response?.data
      };
    }
  }

  // Generate agency preview data
  generateAgencyPreview(agencyData) {
    const agencySlug = agencyData.agencyName
      .toLowerCase()
      .replace(/[^a-z0-9\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim('-');

    return {
      id: `preview-${Date.now()}`,
      name: agencyData.agencyName,
      domain: agencyData.domain ? `${agencyData.domain}.leadestate.com` : `${agencySlug}.leadestate.com`,
      status: agencyData.autoSetup ? 'active' : 'setup',
      plan: agencyData.plan.charAt(0).toUpperCase() + agencyData.plan.slice(1),
      users: 1,
      leads: 0,
      revenue: '$0',
      owner: {
        name: agencyData.ownerName,
        email: agencyData.ownerEmail,
        phone: agencyData.ownerPhone || ''
      },
      companySize: agencyData.companySize,
      customBranding: agencyData.customBranding,
      autoSetup: agencyData.autoSetup,
      createdAt: new Date().toISOString(),
      lastActive: 'Just now',
      repositories: {
        frontend: `${agencySlug}-Frontend`,
        backend: `${agencySlug}-Backend`
      }
    };
  }
}

export default new ApiService();
