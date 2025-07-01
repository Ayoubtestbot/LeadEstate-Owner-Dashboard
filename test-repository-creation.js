// Test repository creation functionality
import axios from 'axios';

const API_BASE_URL = 'https://leadestate-backend-9fih.onrender.com';
const OWNER_API_KEY = 'owner-dashboard-2024';

// Test agency data for repository creation
const testAgencyData = {
  agencyName: 'Demo Real Estate Co',
  managerName: 'Sarah Manager',
  managerEmail: 'sarah.manager@demorealestate.com',
  city: 'Los Angeles',
  description: 'A demo real estate agency for testing repository creation',
  plan: 'premium',
  billingCycle: 'yearly',
  paymentMethod: 'credit_card',
  billingEmail: 'billing@demorealestate.com',
  billingAddress: '456 Demo Avenue, Los Angeles, CA 90210',
  taxId: 'US987654321',
  notes: 'Demo agency for testing GitHub repository automation'
};

async function testRepositoryCreation() {
  console.log('🧪 TESTING REPOSITORY CREATION FUNCTIONALITY');
  console.log('=============================================');
  
  try {
    // Step 1: Check GitHub configuration
    console.log('\n🔍 Step 1: Checking GitHub configuration...');
    const githubResponse = await axios.get(`${API_BASE_URL}/api/owner-integration/debug-github`, {
      headers: {
        'x-owner-api-key': OWNER_API_KEY
      }
    });
    
    console.log('GitHub Configuration:', {
      hasToken: githubResponse.data.github.hasToken,
      tokenLength: githubResponse.data.github.tokenLength,
      owner: githubResponse.data.github.owner
    });

    if (!githubResponse.data.github.hasToken) {
      console.log('⚠️ No GitHub token configured - Repository creation will be simulated');
    } else {
      console.log('✅ GitHub token configured - Real repositories will be created');
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

    // Step 3: Analyze repository creation results
    console.log('\n📊 Step 3: Analyzing repository creation results...');
    
    const agencyData = createResponse.data.data;
    
    if (agencyData.repositories) {
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
    }

    if (agencyData.database) {
      console.log('🗄️ Database Configuration:', agencyData.database);
    }

    if (agencyData.deployment) {
      console.log('🚀 Deployment Information:', agencyData.deployment);
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
        plan: createdAgency.settings?.plan,
        repositories: createdAgency.settings?.repositories
      });
    }

    console.log('\n🎉 REPOSITORY CREATION TEST COMPLETED!');
    console.log('=====================================');
    
    // Step 5: Display deployment instructions
    console.log('\n📋 NEXT STEPS FOR MANUAL DEPLOYMENT:');
    console.log('====================================');
    
    if (githubResponse.data.github.hasToken) {
      console.log('1. 🗄️ Create PostgreSQL database on Railway');
      console.log('2. 🖥️ Deploy backend to Render using the created repository');
      console.log('3. 🌐 Deploy frontend to Vercel using the created repository');
      console.log('4. ⚙️ Configure environment variables');
      console.log('5. 🔗 Set up custom domain (optional)');
      console.log('6. 📧 Configure email and WhatsApp integrations');
      console.log('\n📚 See AGENCY_DEPLOYMENT_GUIDE.md for detailed instructions');
    } else {
      console.log('1. 🔧 Configure GitHub token in Render environment variables');
      console.log('2. 📁 Create template repositories (LeadEstate-Agency-Frontend, LeadEstate-Agency-Backend)');
      console.log('3. 🔄 Re-run agency creation to generate repositories');
      console.log('4. 📚 Follow AGENCY_DEPLOYMENT_GUIDE.md for deployment');
    }

  } catch (error) {
    console.error('\n❌ REPOSITORY CREATION TEST FAILED!');
    console.error('===================================');
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
testRepositoryCreation();
