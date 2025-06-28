import fetch from 'node-fetch';

const API_URL = 'https://leadestate-backend-9fih.onrender.com/api';

async function checkPropertiesData() {
  console.log('🏠 CHECKING PROPERTIES DATA PRESERVATION');
  console.log('📊 Verifying that properties were not lost during fixes...');
  console.log('');
  
  try {
    // Check properties endpoint
    console.log('📡 Fetching properties from database...');
    const propertiesResponse = await fetch(`${API_URL}/properties`);
    
    if (propertiesResponse.ok) {
      const propertiesData = await propertiesResponse.json();
      console.log('✅ Properties endpoint responding');
      console.log('📊 Properties count:', propertiesData.data?.length || 0);
      
      if (propertiesData.data && propertiesData.data.length > 0) {
        console.log('');
        console.log('🏠 EXISTING PROPERTIES:');
        propertiesData.data.forEach((property, index) => {
          console.log(`${index + 1}. ${property.title || 'Untitled'}`);
          console.log(`   Type: ${property.type || 'N/A'}`);
          console.log(`   Price: ${property.price || 'N/A'}`);
          console.log(`   Address: ${property.address || 'N/A'}`);
          console.log(`   Created: ${property.createdAt || property.created_at || 'N/A'}`);
          console.log('');
        });
      } else {
        console.log('❌ NO PROPERTIES FOUND IN DATABASE');
        console.log('');
        console.log('🔍 POSSIBLE REASONS:');
        console.log('1. Properties were accidentally deleted during database updates');
        console.log('2. Database table was recreated without preserving data');
        console.log('3. Properties endpoint is not returning data correctly');
        console.log('4. Database connection issue');
      }
      
    } else {
      console.log('❌ Properties endpoint failed:', propertiesResponse.status);
      const errorText = await propertiesResponse.text();
      console.log('Error details:', errorText);
    }
    
    // Check leads to see if they're preserved
    console.log('📋 Checking leads for comparison...');
    const leadsResponse = await fetch(`${API_URL}/leads`);
    
    if (leadsResponse.ok) {
      const leadsData = await leadsResponse.json();
      console.log('✅ Leads count:', leadsData.data?.length || 0);
      
      if (leadsData.data && leadsData.data.length > 0) {
        console.log('📊 Leads are preserved - database is working');
      }
    }
    
    // Check team members
    console.log('👥 Checking team members...');
    const teamResponse = await fetch(`${API_URL}/team`);
    
    if (teamResponse.ok) {
      const teamData = await teamResponse.json();
      console.log('✅ Team members count:', teamData.data?.length || 0);
    }
    
    console.log('');
    console.log('📋 SUMMARY:');
    console.log('- Data should NEVER be deleted during fixes');
    console.log('- Only schema changes (adding columns) should happen');
    console.log('- Existing data must be preserved');
    console.log('- If properties are missing, they need to be restored');
    
  } catch (error) {
    console.error('❌ Error checking properties:', error.message);
  }
}

checkPropertiesData();
