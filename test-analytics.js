// Test analytics endpoint after fix
import axios from 'axios';

const API_BASE_URL = 'https://leadestate-backend-9fih.onrender.com';
const OWNER_API_KEY = 'owner-dashboard-2024';

async function testAnalytics() {
  try {
    console.log('📊 Testing analytics endpoint...');
    
    const response = await axios.get(`${API_BASE_URL}/api/owner-integration/analytics`, {
      headers: {
        'x-owner-api-key': OWNER_API_KEY
      }
    });
    
    console.log('✅ Analytics working!', {
      totalAgencies: response.data.data.totalAgencies,
      activeAgencies: response.data.data.activeAgencies,
      totalUsers: response.data.data.totalUsers,
      newAgencies: response.data.data.newAgencies,
      growthRate: response.data.data.growthRate
    });
    
  } catch (error) {
    console.error('❌ Analytics failed:', error.response?.data || error.message);
  }
}

testAnalytics();
