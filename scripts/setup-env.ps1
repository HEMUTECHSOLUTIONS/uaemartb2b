// Windows PowerShell Setup Script
// Path: scripts/setup-env.ps1
// Run: powershell -ExecutionPolicy Bypass -File scripts/setup-env.ps1

Write-Host "======================================" -ForegroundColor Cyan
Write-Host "UAEMart - Environment Setup" -ForegroundColor Cyan
Write-Host "======================================" -ForegroundColor Cyan
Write-Host ""

# Check if .env.local exists
if (Test-Path ".env.local") {
    Write-Host "⚠️  .env.local already exists" -ForegroundColor Yellow
    $response = Read-Host "Do you want to overwrite it? (y/n)"
    if ($response -ne "y" -and $response -ne "Y") {
        Write-Host "Keeping existing .env.local"
        exit
    }
}

Write-Host "Step 1: Supabase Configuration" -ForegroundColor Blue
Write-Host "==========================================" -ForegroundColor Blue
Write-Host "Get these values from: https://app.supabase.com"
Write-Host "  → Select your project"
Write-Host "  → Settings → API"
Write-Host ""

$SUPABASE_URL = Read-Host "Enter SUPABASE_URL (https://your-project.supabase.co)"
$SUPABASE_ANON_KEY = Read-Host "Enter SUPABASE_ANON_KEY"
$SUPABASE_SERVICE_ROLE_KEY = Read-Host "Enter SUPABASE_SERVICE_ROLE_KEY"
$DATABASE_URL = Read-Host "Enter DATABASE_URL (postgresql://...)"

Write-Host ""
Write-Host "Step 2: Security Keys" -ForegroundColor Blue
Write-Host "==========================================" -ForegroundColor Blue
Write-Host "Generating JWT secret..."
$JWT_SECRET = [System.Guid]::NewGuid().ToString("N") + [System.Guid]::NewGuid().ToString("N")
Write-Host "✓ JWT_SECRET generated" -ForegroundColor Green

Write-Host "Generating NextAuth secret..."
$NEXTAUTH_SECRET = [System.Guid]::NewGuid().ToString("N") + [System.Guid]::NewGuid().ToString("N")
Write-Host "✓ NEXTAUTH_SECRET generated" -ForegroundColor Green

Write-Host ""
Write-Host "Step 3: Vercel Configuration (Optional)" -ForegroundColor Blue
Write-Host "==========================================" -ForegroundColor Blue
Write-Host "Get these from: https://vercel.com/account/tokens"
Write-Host ""

$VERCEL_TOKEN = Read-Host "Enter VERCEL_TOKEN (leave empty to skip)"
$VERCEL_ORG_ID = Read-Host "Enter VERCEL_ORG_ID (leave empty to skip)"
$VERCEL_PROJECT_ID = Read-Host "Enter VERCEL_PROJECT_ID (leave empty to skip)"

Write-Host ""
Write-Host "Step 4: Application URLs" -ForegroundColor Blue
Write-Host "==========================================" -ForegroundColor Blue

$APP_URL = Read-Host "Enter NEXT_PUBLIC_APP_URL (default: http://localhost:3000)"
if ([string]::IsNullOrEmpty($APP_URL)) {
    $APP_URL = "http://localhost:3000"
}

$PROD_URL = Read-Host "Enter NEXT_PUBLIC_PROD_URL (leave empty for local dev)"

Write-Host ""
Write-Host "Step 5: Admin Email" -ForegroundColor Blue
Write-Host "==========================================" -ForegroundColor Blue

$ADMIN_EMAIL = Read-Host "Enter ADMIN_EMAIL (default: admin@uaemart.com)"
if ([string]::IsNullOrEmpty($ADMIN_EMAIL)) {
    $ADMIN_EMAIL = "admin@uaemart.com"
}

Write-Host ""
Write-Host "Creating .env.local..." -ForegroundColor Blue
Write-Host "==========================================" -ForegroundColor Blue

$envContent = @"
# ========================================================
# SUPABASE CONFIGURATION
# ========================================================
NEXT_PUBLIC_SUPABASE_URL=$SUPABASE_URL
NEXT_PUBLIC_SUPABASE_ANON_KEY=$SUPABASE_ANON_KEY
SUPABASE_SERVICE_ROLE_KEY=$SUPABASE_SERVICE_ROLE_KEY

# ========================================================
# DATABASE CONNECTION
# ========================================================
DATABASE_URL=$DATABASE_URL

# ========================================================
# AUTHENTICATION & SECURITY
# ========================================================
JWT_SECRET=$JWT_SECRET
NEXTAUTH_SECRET=$NEXTAUTH_SECRET
NEXTAUTH_URL=$APP_URL

# ========================================================
# APPLICATION URLs
# ========================================================
NEXT_PUBLIC_APP_URL=$APP_URL
NEXT_PUBLIC_API_URL=$APP_URL/api
NEXT_PUBLIC_DOMAIN=$($APP_URL -replace 'http[s]?://', '')

# ========================================================
# VERCEL DEPLOYMENT
# ========================================================
VERCEL_TOKEN=$VERCEL_TOKEN
VERCEL_ORG_ID=$VERCEL_ORG_ID
VERCEL_PROJECT_ID=$VERCEL_PROJECT_ID
NEXT_PUBLIC_PROD_URL=$PROD_URL

# ========================================================
# ADMIN CONFIGURATION
# ========================================================
ADMIN_EMAIL=$ADMIN_EMAIL

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
"@

$envContent | Out-File -FilePath ".env.local" -Encoding UTF8 -Force

Write-Host "✓ .env.local created successfully!" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Blue
Write-Host "==========================================" -ForegroundColor Blue
Write-Host "1. Install dependencies: npm install"
Write-Host "2. Setup database: npm run db:setup"
Write-Host "3. Start development: npm run dev"
Write-Host "4. Visit: http://localhost:3000"
Write-Host ""
Write-Host "✓ Setup completed!" -ForegroundColor Green
