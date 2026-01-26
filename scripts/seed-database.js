// Seed Database Script
// Run this to populate the database with initial data

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Load environment from .env.local (preferred) or .env
const envPath = fs.existsSync(path.join(__dirname, '..', '.env.local'))
  ? path.join(__dirname, '..', '.env.local')
  : path.join(__dirname, '..', '.env');
require('dotenv').config({ path: envPath });

async function seedDatabase() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');

    // Read and execute seed data
    console.log('\n📁 Reading seed-data.sql...');
    const seedSQL = fs.readFileSync(
      path.join(__dirname, '../database/seed-data.sql'),
      'utf8'
    );

    console.log('🔨 Inserting seed data...');
    await client.query(seedSQL);
    console.log('✅ Seed data inserted successfully!');

    console.log('\n🎉 Database seeding completed!');
    console.log('\nDefault admin credentials:');
    console.log('Email: admin@uaemart.com');
    console.log('Password: Admin@123');
    console.log('\n⚠️  Please change the admin password after first login!');

  } catch (error) {
    console.error('❌ Error seeding database:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the seeding
seedDatabase()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
