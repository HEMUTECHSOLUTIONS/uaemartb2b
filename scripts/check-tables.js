const { Client } = require('pg');

async function checkTables() {
  const client = new Client({
    connectionString: process.env.DATABASE_URL,
  });

  try {
    console.log('\n🔄 Connecting to database...');
    await client.connect();
    console.log('✅ Connected!\n');

    // Get all tables
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public' 
      ORDER BY table_name
    `);

    console.log('📊 Existing Tables:');
    tablesRes.rows.forEach(r => console.log(`  ✓ ${r.table_name}`));

    // Check for critical tables
    const criticalTables = [
      'users',
      'categories', 
      'companies',
      'products',
      'product_images',
      'requirements',
      'requirement_responses',
      'reviews',
      'inquiries',
      'subscriptions',
      'notifications',
      'saved_companies',
      'documents',
      'admin_logs'
    ];

    console.log('\n✅ Critical Tables Check:');
    for (const table of criticalTables) {
      const exists = tablesRes.rows.some(r => r.table_name === table);
      console.log(`  ${exists ? '✓' : '✗'} ${table}`);
    }

    // Count rows in each table
    console.log('\n📈 Row Counts:');
    for (const table of criticalTables) {
      const countRes = await client.query(`SELECT COUNT(*) as count FROM ${table}`);
      console.log(`  - ${table}: ${countRes.rows[0].count} rows`);
    }

    await client.end();
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

checkTables();
