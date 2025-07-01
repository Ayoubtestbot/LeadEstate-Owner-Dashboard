// Test script to create a real agency and monitor the process
import axios from 'axios';

const API_BASE_URL = 'https://leadestate-backend-9fih.onrender.com';
const OWNER_API_KEY = 'owner-dashboard-2024';

// Test agency data
const testAgencyData = {
  agencyName: 'Test Real Estate Agency',
  managerName: 'John Manager',
  managerEmail: 'john.manager@testrealestate.com',
  city: 'New York',
  description: 'A test real estate agency for demonstration',
  plan: 'standard',
  billingCycle: 'monthly',
  paymentMethod: 'credit_card',
  billingEmail: 'billing@testrealestate.com',
  billingAddress: '123 Test Street, New York, NY 10001',
  taxId: 'US123456789',
  notes: 'Test agency created for demonstration purposes'
};

async function testAgencyCreation() {
  console.log('🧪 STARTING REAL AGENCY CREATION TEST');
  console.log('=====================================');
  
  try {
    // Step 1: Check backend health
    console.log('\n📡 Step 1: Checking backend health...');
    const healthResponse = await axios.get(`${API_BASE_URL}/api/owner-integration/test`, {
      headers: {
        'x-owner-api-key': OWNER_API_KEY
      }
    });
    console.log('✅ Backend is healthy:', healthResponse.data);

    // Step 2: Get current agencies count
    console.log('\n📊 Step 2: Getting current agencies...');
    const agenciesResponse = await axios.get(`${API_BASE_URL}/api/owner-integration/agencies`, {
      headers: {
        'x-owner-api-key': OWNER_API_KEY
      }
    });
    const currentAgencies = agenciesResponse.data.data || [];
    console.log(`📈 Current agencies count: ${currentAgencies.length}`);
    
    // Step 3: Create the test agency
    console.log('\n🏢 Step 3: Creating test agency...');
    console.log('Agency data:', JSON.stringify(testAgencyData, null, 2));
    
    const startTime = Date.now();
    const createResponse = await axios.post(`${API_BASE_URL}/api/owner-integration/create-agency`, testAgencyData, {
      headers: {
        'x-owner-api-key': OWNER_API_KEY,
        'Content-Type': 'application/json'
      }
    });
    const endTime = Date.now();
    
    console.log(`⏱️ Agency creation took: ${endTime - startTime}ms`);
    console.log('✅ Agency creation response:', JSON.stringify(createResponse.data, null, 2));

    // Step 4: Verify agency was created
    console.log('\n🔍 Step 4: Verifying agency creation...');
    const verifyResponse = await axios.get(`${API_BASE_URL}/api/owner-integration/agencies`, {
      headers: {
        'x-owner-api-key': OWNER_API_KEY
      }
    });
    const newAgencies = verifyResponse.data.data || [];
    console.log(`📈 New agencies count: ${newAgencies.length}`);
    
    // Find our created agency
    const createdAgency = newAgencies.find(agency => 
      agency.name === testAgencyData.agencyName
    );
    
    if (createdAgency) {
      console.log('✅ Agency found in database:', {
        id: createdAgency.id,
        name: createdAgency.name,
        email: createdAgency.email,
        status: createdAgency.status,
        plan: createdAgency.settings?.plan,
        billingCycle: createdAgency.settings?.billingCycle,
        monthlyPrice: createdAgency.settings?.monthlyPrice,
        createdAt: createdAgency.created_at
      });
    } else {
      console.log('❌ Agency not found in database');
    }

    // Step 5: Test analytics update
    console.log('\n📊 Step 5: Checking analytics update...');
    const analyticsResponse = await axios.get(`${API_BASE_URL}/api/owner-integration/analytics`, {
      headers: {
        'x-owner-api-key': OWNER_API_KEY
      }
    });
    console.log('📈 Updated analytics:', {
      totalAgencies: analyticsResponse.data.data.totalAgencies,
      activeAgencies: analyticsResponse.data.data.activeAgencies,
      newAgencies: analyticsResponse.data.data.newAgencies
    });

    console.log('\n🎉 AGENCY CREATION TEST COMPLETED SUCCESSFULLY!');
    console.log('===============================================');

  } catch (error) {
    console.error('\n❌ AGENCY CREATION TEST FAILED!');
    console.error('================================');
    console.error('Error details:', {
      message: error.message,
      status: error.response?.status,
      statusText: error.response?.statusText,
      data: error.response?.data
    });
    
    if (error.response?.data) {
      console.error('Backend error response:', JSON.stringify(error.response.data, null, 2));
    }
  }
}

// Run the test
testAgencyCreation();
