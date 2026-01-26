// Simple Setup Script - No Dependencies
// Path: scripts/simple-setup.js
// Run: node scripts/simple-setup.js

console.log('====================================');
console.log('UAEMart - Simple Setup');
console.log('====================================\n');

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(prompt, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  console.log('📝 Creating .env.local file...\n');

  const supabaseUrl = await question('Enter SUPABASE_URL (https://your-project.supabase.co): ');
  const anonKey = await question('Enter SUPABASE_ANON_KEY: ');
  const serviceRoleKey = await question('Enter SERVICE_ROLE_KEY: ');
  const databaseUrl = await question('Enter DATABASE_URL (postgresql://...): ');

  const appUrl = await question('Enter APP_URL (default: http://localhost:3000): ') || 'http://localhost:3000';

  const jwtSecret = require('crypto').randomBytes(32).toString('hex');
  const nextAuthSecret = require('crypto').randomBytes(32).toString('hex');

  const envContent = `# ========================================================
# SUPABASE CONFIGURATION
# ========================================================
NEXT_PUBLIC_SUPABASE_URL=${supabaseUrl}
NEXT_PUBLIC_SUPABASE_ANON_KEY=${anonKey}
SUPABASE_SERVICE_ROLE_KEY=${serviceRoleKey}

# ========================================================
# DATABASE CONNECTION
# ========================================================
DATABASE_URL=${databaseUrl}

# ========================================================
# AUTHENTICATION & SECURITY
# ========================================================
JWT_SECRET=${jwtSecret}
NEXTAUTH_SECRET=${nextAuthSecret}
NEXTAUTH_URL=${appUrl}

# ========================================================
# APPLICATION URLs
# ========================================================
NEXT_PUBLIC_APP_URL=${appUrl}
NEXT_PUBLIC_API_URL=${appUrl}/api
NEXT_PUBLIC_DOMAIN=${appUrl.replace('http://', '').replace('https://', '')}

# ========================================================
# ADMIN CONFIGURATION
# ========================================================
ADMIN_EMAIL=admin@uaemart.com

# ========================================================
# FEATURE FLAGS
# ========================================================
NEXT_PUBLIC_ENABLE_REGISTRATION=true
NEXT_PUBLIC_ENABLE_SELLER_REGISTRATION=true
NEXT_PUBLIC_ENABLE_REVIEWS=true
NEXT_PUBLIC_ENABLE_SUBSCRIPTIONS=false
NEXT_PUBLIC_ENABLE_PAYMENTS=false

# ========================================================
# ENVIRONMENT MODE
# ========================================================
NODE_ENV=development
NEXT_PUBLIC_ENV=development
`;

  fs.writeFileSync(path.join(__dirname, '..', '.env.local'), envContent);
  console.log('\n✅ .env.local created successfully!');
  console.log('\nNext steps:');
  console.log('1. npm install');
  console.log('2. npm run db:setup');
  console.log('3. npm run dev');
  
  rl.close();
}

main().catch(console.error);
