#!/usr/bin/env node

// Automated Setup Helper
// Run: npm run setup-wizard

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  green: '\x1b[32m',
  blue: '\x1b[34m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(color, text) {
  console.log(`${colors[color] || ''}${text}${colors.reset}`);
}

function question(prompt) {
  return new Promise((resolve) => {
    rl.question(`${colors.blue}❯${colors.reset} ${prompt}`, (answer) => {
      resolve(answer);
    });
  });
}

async function main() {
  log('bright', '\n╔══════════════════════════════════════════════════════════╗');
  log('bright', '║                  UAEMart Setup Wizard                    ║');
  log('bright', '╚══════════════════════════════════════════════════════════╝\n');

  log('yellow', '⚠️  Before starting, you need:');
  log('yellow', '  1. Supabase account (create at https://supabase.com)');
  log('yellow', '  2. Your Supabase project URL');
  log('yellow', '  3. Your Supabase API keys');
  log('yellow', '  4. Your database connection string\n');

  const start = await question('Ready to continue? (y/n): ');
  if (start.toLowerCase() !== 'y') {
    log('red', '❌ Setup cancelled');
    process.exit(0);
  }

  log('bright', '\n📋 STEP 1: Supabase Configuration\n');
  log('yellow', 'Go to: https://app.supabase.com');
  log('yellow', '  1. Select your project');
  log('yellow', '  2. Settings → API');
  log('yellow', '  3. Copy the values below\n');

  const supabaseUrl = await question('Supabase URL (https://...supabase.co): ');
  const anonKey = await question('Anon Key: ');
  const serviceRoleKey = await question('Service Role Key: ');

  log('bright', '\n📋 STEP 2: Database Configuration\n');
  log('yellow', 'Still in Supabase dashboard:');
  log('yellow', '  1. Settings → Database');
  log('yellow', '  2. Copy Connection string (URI)\n');

  const databaseUrl = await question('Database URL (postgresql://...): ');

  log('bright', '\n📋 STEP 3: Application Configuration\n');

  const appUrl = await question('Application URL (default: http://localhost:3000): ') || 'http://localhost:3000';
  const adminEmail = await question('Admin Email (default: admin@uaemart.com): ') || 'admin@uaemart.com';

  log('green', '\n✨ Generating security keys...');
  const jwtSecret = require('crypto').randomBytes(32).toString('hex');
  const nextAuthSecret = require('crypto').randomBytes(32).toString('hex');
  log('green', '✓ JWT Secret generated');
  log('green', '✓ NextAuth Secret generated\n');

  const envContent = `# UAEMart Environment Configuration
# Generated: ${new Date().toISOString()}

# ========================================================
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
NEXT_PUBLIC_DOMAIN=${appUrl.replace(/^https?:\/\//, '')}

# ========================================================
# ADMIN CONFIGURATION
# ========================================================
ADMIN_EMAIL=${adminEmail}

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

  const envPath = path.join(__dirname, '..', '.env.local');
  fs.writeFileSync(envPath, envContent);
  log('green', '✓ .env.local created successfully\n');

  log('bright', '╔══════════════════════════════════════════════════════════╗');
  log('bright', '║                    🎉 Setup Complete!                   ║');
  log('bright', '╚══════════════════════════════════════════════════════════╝\n');

  log('blue', 'Next steps:\n');
  log('blue', '1. Install dependencies:');
  log('bright', '   npm install\n');
  log('blue', '2. Setup database:');
  log('bright', '   npm run db:setup\n');
  log('blue', '3. Start development:');
  log('bright', '   npm run dev\n');
  log('blue', '4. Open browser:');
  log('bright', `   ${appUrl}\n`);

  log('green', '✅ All done! You\'re ready to go!\n');

  rl.close();
}

main().catch(error => {
  log('red', `❌ Error: ${error.message}`);
  process.exit(1);
});
