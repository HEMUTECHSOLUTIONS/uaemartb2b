// Database Setup Script
// Run this to create all tables in Supabase

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Load environment from .env.local (preferred) or .env
const envPath = fs.existsSync(path.join(__dirname, '..', '.env.local'))
  ? path.join(__dirname, '..', '.env.local')
  : path.join(__dirname, '..', '.env');
require('dotenv').config({ path: envPath });

async function setupDatabase() {
  // Validate required environment variables
  const requiredEnvVars = ['DATABASE_URL'];
  const missing = requiredEnvVars.filter(key => !process.env[key]);
  
  if (missing.length > 0) {
    console.log('\n❌ Missing required environment variables:');
    missing.forEach(key => console.log(`   • ${key}`));
    console.log('\n📋 To fix:');
    console.log('   1. Run: npm run quick-setup');
    console.log('   2. Paste your Supabase credentials');
    console.log('   3. Try again: npm run db:setup\n');
    process.exit(1);
  }

  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('\n🔄 Connecting to Supabase database...');
    await client.connect();
    console.log('✅ Connected successfully!\n');

    // Optional: reset schema if RESET_DB=true
    if (process.env.RESET_DB === 'true') {
      console.log('⚠️  RESET_DB=true detected → Dropping and recreating public schema...');
      await client.query('DROP SCHEMA IF EXISTS public CASCADE; CREATE SCHEMA public; GRANT ALL ON SCHEMA public TO postgres; GRANT ALL ON SCHEMA public TO public;');
      console.log('✅ Schema reset complete.');
    }

    // Read and execute schema file
    console.log('📁 Reading schema.sql...');
    const schemaSQL = fs.readFileSync(
      path.join(__dirname, '../database/schema.sql'),
      'utf8'
    );

    console.log('🔨 Creating tables and indexes...');
    await client.query(schemaSQL);
    console.log('✅ Schema created successfully!');

    // Read and execute functions file
    console.log('\n📁 Reading functions.sql...');
    const functionsSQL = fs.readFileSync(
      path.join(__dirname, '../database/functions.sql'),
      'utf8'
    );

    console.log('🔨 Creating database functions...');
    await client.query(functionsSQL);
    console.log('✅ Functions created successfully!');

    // Read and execute seed data
    console.log('\n📁 Reading seed-data.sql...');
    const seedSQL = fs.readFileSync(
      path.join(__dirname, '../database/seed-data.sql'),
      'utf8'
    );

    console.log('🔨 Inserting seed data...');
    await client.query(seedSQL);
    console.log('✅ Seed data inserted successfully!');

    console.log('\n🎉 Database setup completed successfully!');
    console.log('\nDefault admin credentials:');
    console.log('Email: admin@uaemart.com');
    console.log('Password: Admin@123');
    console.log('\n⚠️  Please change the admin password after first login!');

  } catch (error) {
    console.error('❌ Error setting up database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the setup
setupDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
