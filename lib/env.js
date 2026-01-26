// Environment Variable Validation
// Path: lib/env.js

const requiredEnvVars = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'JWT_SECRET',
];

const optionalEnvVars = [
  'DATABASE_URL',
  'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
  'STRIPE_PUBLIC_KEY',
  'STRIPE_SECRET_KEY',
];

export function validateEnv() {
  const missingVars = [];

  requiredEnvVars.forEach((envVar) => {
    if (!process.env[envVar]) {
      missingVars.push(envVar);
    }
  });

  if (missingVars.length > 0) {
    throw new Error(
      `Missing required environment variables:\n${missingVars
        .map((v) => `  - ${v}`)
        .join('\n')}\n\nSee .env.local.example for required setup.`
    );
  }

  return {
    supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
    supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
    jwtSecret: process.env.JWT_SECRET,
    appUrl: process.env.NEXT_PUBLIC_APP_URL || 'http://localhost:3000',
    apiUrl: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3000/api',
  };
}

export const env = {
  // Supabase
  supabaseUrl: process.env.NEXT_PUBLIC_SUPABASE_URL,
  supabaseAnonKey: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  supabaseServiceRole: process.env.SUPABASE_SERVICE_ROLE_KEY,
  databaseUrl: process.env.DATABASE_URL,

  // Auth
  jwtSecret: process.env.JWT_SECRET,
  nextAuthSecret: process.env.NEXTAUTH_SECRET,
  nextAuthUrl: process.env.NEXTAUTH_URL,

  // URLs
  appUrl: process.env.NEXT_PUBLIC_APP_URL,
  apiUrl: process.env.NEXT_PUBLIC_API_URL,
  prodUrl: process.env.NEXT_PUBLIC_PROD_URL,

  // Vercel
  vercelToken: process.env.VERCEL_TOKEN,
  vercelOrgId: process.env.VERCEL_ORG_ID,
  vercelProjectId: process.env.VERCEL_PROJECT_ID,

  // Storage
  uploadBucket: process.env.NEXT_PUBLIC_SUPABASE_BUCKET,
  maxFileSize: parseInt(process.env.NEXT_PUBLIC_MAX_FILE_SIZE || '5242880'),

  // Features
  enableRegistration: process.env.NEXT_PUBLIC_ENABLE_REGISTRATION === 'true',
  enablePayments: process.env.NEXT_PUBLIC_ENABLE_PAYMENTS === 'true',
  enableSubscriptions: process.env.NEXT_PUBLIC_ENABLE_SUBSCRIPTIONS === 'true',

  // Admin
  adminEmail: process.env.ADMIN_EMAIL,

  // Node
  nodeEnv: process.env.NODE_ENV || 'development',
  isDev: process.env.NODE_ENV !== 'production',
  isProd: process.env.NODE_ENV === 'production',
};
