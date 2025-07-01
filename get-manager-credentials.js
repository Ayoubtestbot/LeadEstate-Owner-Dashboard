// Script to retrieve manager credentials for created agencies
import axios from 'axios';

const API_BASE_URL = 'https://leadestate-backend-9fih.onrender.com';
const OWNER_API_KEY = 'owner-dashboard-2024';

async function getManagerCredentials() {
  try {
    console.log('🔍 RETRIEVING MANAGER CREDENTIALS');
    console.log('=================================');
    
    // Get all agencies
    const agenciesResponse = await axios.get(`${API_BASE_URL}/api/owner-integration/agencies`, {
      headers: {
        'x-owner-api-key': OWNER_API_KEY
      }
    });
    
    const agencies = agenciesResponse.data.data || [];
    console.log(`📊 Found ${agencies.length} agencies\n`);
    
    for (const agency of agencies) {
      console.log(`🏢 Agency: ${agency.name}`);
      console.log(`📧 Manager Email: ${agency.email}`);
      console.log(`🆔 Agency ID: ${agency.id}`);
      console.log(`📅 Created: ${agency.created_at}`);
      console.log(`📊 Status: ${agency.status}`);
      
      // Try to get manager details from users table
      try {
        const managerResponse = await axios.get(`${API_BASE_URL}/api/owner-integration/agencies/${agency.id}/manager`, {
          headers: {
            'x-owner-api-key': OWNER_API_KEY
          }
        });
        
        if (managerResponse.data.success) {
          const manager = managerResponse.data.data;
          console.log(`👤 Manager Details:`);
          console.log(`   - Name: ${manager.first_name} ${manager.last_name || ''}`);
          console.log(`   - Email: ${manager.email}`);
          console.log(`   - Status: ${manager.status}`);
          console.log(`   - Role: ${manager.role}`);
          
          if (manager.status === 'invited') {
            console.log(`   - ⚠️ Account Setup Required`);
            console.log(`   - 🔗 Setup Link: Check email for invitation`);
            console.log(`   - ⏰ Invitation Expires: ${manager.invitation_expires_at}`);
          } else if (manager.status === 'active') {
            console.log(`   - ✅ Account Active - Manager can login with their chosen password`);
          }
        }
      } catch (managerError) {
        console.log(`   - ❌ Could not retrieve manager details`);
      }
      
      console.log(`${'='.repeat(60)}\n`);
    }
    
    console.log('📋 MANAGER ACCESS INSTRUCTIONS:');
    console.log('==============================');
    console.log('1. 📧 Manager should check their email for invitation');
    console.log('2. 🔗 Click the setup link in the email');
    console.log('3. 🔐 Set their own secure password');
    console.log('4. ✅ Complete account setup');
    console.log('5. 🚀 Login to their agency CRM system');
    
    console.log('\n⚠️ TEMPORARY CREDENTIALS (for testing only):');
    console.log('============================================');
    console.log('Email: [Manager email from agency creation]');
    console.log('Temporary Password: TempPassword123!');
    console.log('Note: This password should be changed during setup');
    
  } catch (error) {
    console.error('❌ Error retrieving manager credentials:', error.response?.data || error.message);
  }
}

getManagerCredentials();
