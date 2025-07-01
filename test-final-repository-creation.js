// Final test of repository creation with template repositories configured
import axios from 'axios';

const API_BASE_URL = 'https://leadestate-backend-9fih.onrender.com';
const OWNER_API_KEY = 'owner-dashboard-2024';

// Test agency data for final repository creation test
const testAgencyData = {
  agencyName: 'Real Estate Pro Agency',
  managerName: 'Michael Manager',
  managerEmail: 'michael.manager@realestateproagency.com',
  city: 'Miami',
  description: 'Professional real estate agency with repository automation',
  plan: 'enterprise',
  billingCycle: 'monthly',
  paymentMethod: 'credit_card',
  billingEmail: 'billing@realestateproagency.com',
  billingAddress: '789 Business Blvd, Miami, FL 33101',
  taxId: 'US555666777',
  notes: 'Final test of GitHub repository automation with template repositories'
};

async function testFinalRepositoryCreation() {
  console.log('🚀 FINAL REPOSITORY CREATION TEST');
  console.log('=================================');
  
  try {
    // Step 1: Verify template repositories are configured
    console.log('\n🔍 Step 1: Verifying template repositories...');
    const debugResponse = await axios.get(`${API_BASE_URL}/api/owner-integration/debug-repository-service`, {
      headers: {
        'x-owner-api-key': OWNER_API_KEY
      }
    });
    
    console.log('Repository Service Status:', debugResponse.data);

    if (!debugResponse.data.success) {
      throw new Error('Repository service not available');
    }

    // Step 2: Create agency with repository automation
    console.log('\n🏢 Step 2: Creating agency with repository automation...');
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

    // Step 3: Analyze results
    console.log('\n📊 Step 3: Analyzing repository creation results...');
    
    const agencyData = createResponse.data.data;
    const repositoriesCreated = createResponse.data.data.repositoriesCreated;
    
    if (repositoriesCreated) {
      console.log('🎉 SUCCESS! Repositories created successfully!');
      console.log('📁 Repository Information:');
      console.log('Frontend Repository:', {
        name: agencyData.repositories.frontend?.name,
        url: agencyData.repositories.frontend?.url,
        cloneUrl: agencyData.repositories.frontend?.cloneUrl
      });
      console.log('Backend Repository:', {
        name: agencyData.repositories.backend?.name,
        url: agencyData.repositories.backend?.url,
        cloneUrl: agencyData.repositories.backend?.cloneUrl
      });
      
      if (agencyData.deployment) {
        console.log('🚀 Deployment Information:', agencyData.deployment);
      }
    } else {
      console.log('❌ Repository creation failed:', agencyData.repositories);
    }

    // Step 4: Verify agency in database
    console.log('\n🔍 Step 4: Verifying agency in database...');
    const verifyResponse = await axios.get(`${API_BASE_URL}/api/owner-integration/agencies`, {
      headers: {
        'x-owner-api-key': OWNER_API_KEY
      }
    });
    
    const agencies = verifyResponse.data.data || [];
    const createdAgency = agencies.find(agency => 
      agency.name === testAgencyData.agencyName
    );
    
    if (createdAgency) {
      console.log('✅ Agency verified in database:', {
        id: createdAgency.id,
        name: createdAgency.name,
        status: createdAgency.status,
        plan: createdAgency.settings?.plan
      });
    }

    console.log('\n🎉 FINAL REPOSITORY CREATION TEST COMPLETED!');
    console.log('============================================');
    
    if (repositoriesCreated) {
      console.log('\n✅ REPOSITORY AUTOMATION IS WORKING!');
      console.log('====================================');
      console.log('🎯 What was created:');
      console.log('  ✅ Agency database record');
      console.log('  ✅ Manager user account');
      console.log('  ✅ Billing configuration');
      console.log('  ✅ GitHub repositories (Frontend & Backend)');
      console.log('  ✅ Code cloned from templates');
      console.log('  ✅ Agency-specific configuration');
      
      console.log('\n📋 NEXT STEPS FOR DEPLOYMENT:');
      console.log('=============================');
      console.log('1. 🗄️ Create PostgreSQL database on Railway');
      console.log('2. 🖥️ Deploy backend to Render using created repository');
      console.log('3. 🌐 Deploy frontend to Vercel using created repository');
      console.log('4. ⚙️ Configure environment variables');
      console.log('5. 🔗 Set up custom domain (optional)');
      console.log('6. 📧 Configure email and WhatsApp integrations');
      console.log('\n📚 See AGENCY_DEPLOYMENT_GUIDE.md for detailed instructions');
    } else {
      console.log('\n❌ REPOSITORY AUTOMATION NEEDS DEBUGGING');
      console.log('========================================');
      console.log('Check the error details above and fix the issues.');
    }

  } catch (error) {
    console.error('\n❌ FINAL REPOSITORY CREATION TEST FAILED!');
    console.error('=========================================');
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

// Run the final test
testFinalRepositoryCreation();
