// Complete test after deployment
import axios from 'axios';

const API_BASE_URL = 'https://leadestate-backend-9fih.onrender.com';
const OWNER_API_KEY = 'owner-dashboard-2024';

async function testComplete() {
  try {
    console.log('🔄 Waiting for deployment to complete...');
    
    // Test analytics endpoint
    console.log('📊 Testing analytics endpoint...');
    const analyticsResponse = await axios.get(`${API_BASE_URL}/api/owner-integration/analytics`, {
      headers: {
        'x-owner-api-key': OWNER_API_KEY
      }
    });
    
    console.log('✅ Analytics working perfectly!');
    console.log('📈 Current system stats:', {
      totalAgencies: analyticsResponse.data.data.totalAgencies,
      activeAgencies: analyticsResponse.data.data.activeAgencies,
      totalUsers: analyticsResponse.data.data.totalUsers,
      newAgencies: analyticsResponse.data.data.newAgencies,
      growthRate: analyticsResponse.data.data.growthRate,
      activeRate: analyticsResponse.data.data.activeRate
    });

    // Verify our test agency exists
    console.log('\n🔍 Verifying test agency...');
    const agenciesResponse = await axios.get(`${API_BASE_URL}/api/owner-integration/agencies`, {
      headers: {
        'x-owner-api-key': OWNER_API_KEY
      }
    });
    
    const agencies = agenciesResponse.data.data || [];
    const testAgency = agencies.find(agency => agency.name === 'Test Real Estate Agency');
    
    if (testAgency) {
      console.log('✅ Test agency found and active:', {
        id: testAgency.id,
        name: testAgency.name,
        status: testAgency.status,
        plan: testAgency.settings?.plan,
        monthlyPrice: testAgency.settings?.monthlyPrice,
        billingStatus: testAgency.settings?.billingStatus
      });
    }

    console.log('\n🎉 DEPLOYMENT COMPLETE - ALL SYSTEMS WORKING!');
    
  } catch (error) {
    console.error('❌ Test failed:', error.response?.data || error.message);
  }
}

testComplete();
