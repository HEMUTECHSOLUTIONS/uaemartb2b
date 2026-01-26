#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const envLocalPath = path.join(__dirname, '..', '.env.local');

console.log('\n🔍 Checking environment configuration...\n');

if (!fs.existsSync(envLocalPath)) {
  console.log('❌ .env.local file not found!');
  console.log('📝 Run this command to create it:\n');
  console.log('   npm run quick-setup\n');
  process.exit(1);
}

const envContent = fs.readFileSync(envLocalPath, 'utf8');
const lines = envContent.split('\n');

const required = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'DATABASE_URL',
  'JWT_SECRET'
];

let hasErrors = false;
let missingKeys = [];
let emptyKeys = [];

required.forEach(key => {
  const line = lines.find(l => l.trim().startsWith(key + '=') && !l.trim().startsWith('#'));
  
  if (!line) {
    missingKeys.push(key);
    hasErrors = true;
  } else {
    const value = line.split('=')[1]?.trim() || '';
    if (!value) {
      emptyKeys.push(key);
      hasErrors = true;
    }
  }
});

console.log('✅ Configuration file found: .env.local\n');

if (missingKeys.length > 0) {
  console.log('❌ Missing variables:');
  missingKeys.forEach(key => {
    console.log(`   • ${key}`);
  });
  console.log();
}

if (emptyKeys.length > 0) {
  console.log('⚠️  Empty variables (need values):');
  emptyKeys.forEach(key => {
    console.log(`   • ${key}`);
  });
  console.log();
}

if (hasErrors) {
  console.log('📋 To fix:\n');
  console.log('   Option 1 (Easy): Run interactive setup');
  console.log('   $ npm run quick-setup\n');
  console.log('   Option 2 (Manual): Edit .env.local and replace placeholder values');
  console.log('   Get credentials from: https://app.supabase.com\n');
  process.exit(1);
} else {
  console.log('✅ All required variables are configured!\n');
  process.exit(0);
}
