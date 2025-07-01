// Debug repository service loading
import axios from 'axios';

const API_BASE_URL = 'https://leadestate-backend-9fih.onrender.com';
const OWNER_API_KEY = 'owner-dashboard-2024';

async function debugRepositoryService() {
  try {
    console.log('🔍 Debugging repository service...');
    
    // Check GitHub configuration
    const githubResponse = await axios.get(`${API_BASE_URL}/api/owner-integration/debug-github`, {
      headers: {
        'x-owner-api-key': OWNER_API_KEY
      }
    });
    
    console.log('GitHub Configuration:', githubResponse.data);
    
    // Try to create a minimal agency to see detailed error
    const testData = {
      agencyName: 'Debug Test Agency',
      managerName: 'Debug Manager',
      managerEmail: 'debug@test.com',
      city: 'Test City',
      plan: 'basic'
    };
    
    console.log('\n🧪 Creating test agency to debug repository service...');
    const createResponse = await axios.post(`${API_BASE_URL}/api/owner-integration/create-agency`, testData, {
      headers: {
        'x-owner-api-key': OWNER_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    
    console.log('Response:', JSON.stringify(createResponse.data, null, 2));
    
  } catch (error) {
    console.error('Error:', error.response?.data || error.message);
  }
}

debugRepositoryService();
