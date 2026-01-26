// Run Database Migrations Script
// Run this to execute migration files in order

const fs = require('fs');
const path = require('path');
const { Client } = require('pg');

// Load environment from .env.local (preferred) or .env
const envPath = fs.existsSync(path.join(__dirname, '..', '.env.local'))
  ? path.join(__dirname, '..', '.env.local')
  : path.join(__dirname, '..', '.env');
require('dotenv').config({ path: envPath });

async function runMigrations() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('Connecting to database...');
    await client.connect();
    console.log('Connected successfully!');

    // Get all migration files
    const migrationsDir = path.join(__dirname, '../database/migrations');
    const files = fs.readdirSync(migrationsDir).sort();

    console.log(`\n📁 Found ${files.length} migration files\n`);

    // Execute each migration
    for (const file of files) {
      if (file.endsWith('.sql')) {
        console.log(`🔨 Running migration: ${file}`);
        const migrationSQL = fs.readFileSync(
          path.join(migrationsDir, file),
          'utf8'
        );

        await client.query(migrationSQL);
        console.log(`✅ Completed: ${file}`);
      }
    }

    console.log('\n🎉 All migrations completed successfully!');

  } catch (error) {
    console.error('❌ Error running migrations:', error);
    throw error;
  } finally {
    await client.end();
  }
}

// Run the migrations
runMigrations()
  .then(() => process.exit(0))
  .catch(() => process.exit(1));
