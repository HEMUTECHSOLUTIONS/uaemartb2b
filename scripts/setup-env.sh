#!/bin/bash
# Setup script to get Supabase & Vercel keys and configure environment
# Run: bash scripts/setup-env.sh

set -e

echo "======================================"
echo "UAEMart - Environment Setup"
echo "======================================"
echo ""

# Colors for output
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Check if .env.local exists
if [ -f ".env.local" ]; then
    echo -e "${YELLOW}⚠️  .env.local already exists${NC}"
    read -p "Do you want to overwrite it? (y/n) " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        echo "Keeping existing .env.local"
        exit 0
    fi
fi

echo -e "${BLUE}Step 1: Supabase Configuration${NC}"
echo "=========================================="
echo "Get these values from: https://app.supabase.com"
echo "  → Select your project"
echo "  → Settings → API"
echo ""

read -p "Enter SUPABASE_URL (https://your-project.supabase.co): " SUPABASE_URL
read -p "Enter SUPABASE_ANON_KEY: " SUPABASE_ANON_KEY
read -p "Enter SUPABASE_SERVICE_ROLE_KEY: " SUPABASE_SERVICE_ROLE_KEY
read -p "Enter DATABASE_URL (postgresql://...): " DATABASE_URL

echo ""
echo -e "${BLUE}Step 2: Security Keys${NC}"
echo "=========================================="
echo "Generating JWT secret..."
JWT_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo -e "${GREEN}✓ JWT_SECRET generated${NC}"

echo "Generating NextAuth secret..."
NEXTAUTH_SECRET=$(node -e "console.log(require('crypto').randomBytes(32).toString('hex'))")
echo -e "${GREEN}✓ NEXTAUTH_SECRET generated${NC}"

echo ""
echo -e "${BLUE}Step 3: Vercel Configuration (Optional)${NC}"
echo "=========================================="
echo "Get these from: https://vercel.com/account/tokens"
echo ""

read -p "Enter VERCEL_TOKEN (leave empty to skip): " VERCEL_TOKEN
read -p "Enter VERCEL_ORG_ID (leave empty to skip): " VERCEL_ORG_ID
read -p "Enter VERCEL_PROJECT_ID (leave empty to skip): " VERCEL_PROJECT_ID

echo ""
echo -e "${BLUE}Step 4: Application URLs${NC}"
echo "=========================================="

read -p "Enter NEXT_PUBLIC_APP_URL (default: http://localhost:3000): " APP_URL
APP_URL=${APP_URL:-"http://localhost:3000"}

read -p "Enter NEXT_PUBLIC_PROD_URL (leave empty for local dev): " PROD_URL

echo ""
echo -e "${BLUE}Step 5: Admin Email${NC}"
echo "=========================================="

read -p "Enter ADMIN_EMAIL (default: admin@uaemart.com): " ADMIN_EMAIL
ADMIN_EMAIL=${ADMIN_EMAIL:-"admin@uaemart.com"}

echo ""
echo -e "${BLUE}Creating .env.local...${NC}"
echo "=========================================="

# Create .env.local
cat > .env.local << EOF
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
NEXT_PUBLIC_DOMAIN=${APP_URL#*://}

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
EOF

echo -e "${GREEN}✓ .env.local created successfully!${NC}"
echo ""
echo -e "${BLUE}Next Steps:${NC}"
echo "=========================================="
echo "1. Install dependencies: npm install"
echo "2. Setup database: npm run db:setup"
echo "3. Start development: npm run dev"
echo "4. Visit: http://localhost:3000"
echo ""
echo -e "${GREEN}✓ Setup completed!${NC}"
