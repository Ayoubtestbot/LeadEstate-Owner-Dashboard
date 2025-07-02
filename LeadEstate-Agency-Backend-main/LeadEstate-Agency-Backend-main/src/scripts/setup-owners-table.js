const { Pool } = require('pg');
const fs = require('fs');
const path = require('path');
require('dotenv').config();

// Database connection
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: process.env.NODE_ENV === 'production' ? { rejectUnauthorized: false } : false
});

async function setupOwnersTable() {
  try {
    console.log('🔄 Setting up owners table...');
    
    // Read the migration SQL file
    const migrationPath = path.join(__dirname, '../database/migrations/create-owners-table.sql');
    const migrationSQL = fs.readFileSync(migrationPath, 'utf8');
    
    // Execute the migration
    await pool.query(migrationSQL);
    
    console.log('✅ Owners table created successfully!');
    console.log('✅ Default owner account created: owner@leadestate.com / password123');
    
    // Verify the table was created
    const result = await pool.query('SELECT COUNT(*) FROM owners');
    console.log(`📊 Total owners in database: ${result.rows[0].count}`);
    
    // List all owners
    const owners = await pool.query('SELECT id, email, first_name, last_name, role, status, created_at FROM owners');
    console.log('\n📋 Current owners:');
    owners.rows.forEach(owner => {
      console.log(`  - ${owner.first_name} ${owner.last_name} (${owner.email}) - ${owner.role} - ${owner.status}`);
    });
    
  } catch (error) {
    console.error('❌ Error setting up owners table:', error);
    
    if (error.code === '42P07') {
      console.log('ℹ️  Table already exists, checking data...');
      
      try {
        const result = await pool.query('SELECT COUNT(*) FROM owners');
        console.log(`📊 Total owners in database: ${result.rows[0].count}`);
        
        // Check if default owner exists
        const defaultOwner = await pool.query('SELECT * FROM owners WHERE email = $1', ['owner@leadestate.com']);
        if (defaultOwner.rows.length === 0) {
          console.log('🔄 Adding default owner account...');
          
          const bcrypt = require('bcryptjs');
          const hashedPassword = await bcrypt.hash('password123', 12);
          
          await pool.query(`
            INSERT INTO owners (
              email, password_hash, first_name, last_name, role, status, 
              company_name, email_verified_at
            ) VALUES ($1, $2, $3, $4, $5, $6, $7, NOW())
          `, [
            'owner@leadestate.com',
            hashedPassword,
            'Owner',
            'Admin',
            'owner',
            'active',
            'LeadEstate'
          ]);
          
          console.log('✅ Default owner account created!');
        } else {
          console.log('✅ Default owner account already exists');
        }
      } catch (checkError) {
        console.error('❌ Error checking existing data:', checkError);
      }
    }
  } finally {
    await pool.end();
  }
}

// Run the setup
if (require.main === module) {
  setupOwnersTable()
    .then(() => {
      console.log('\n🎉 Database setup completed!');
      process.exit(0);
    })
    .catch((error) => {
      console.error('\n💥 Database setup failed:', error);
      process.exit(1);
    });
}

module.exports = { setupOwnersTable };
