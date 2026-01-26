#!/bin/bash
# Complete initialization script
# Run: bash scripts/init.sh

set -e

echo "======================================"
echo "🚀 UAEMart Complete Setup"
echo "======================================"
echo ""

# Colors
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
NC='\033[0m'

# Step 1: Environment Setup
echo -e "${BLUE}Step 1: Setting up environment...${NC}"
if [ ! -f ".env.local" ]; then
    echo "Creating .env.local..."
    bash scripts/setup-env.sh
else
    echo -e "${YELLOW}✓ .env.local already exists${NC}"
fi

echo ""
echo -e "${BLUE}Step 2: Installing dependencies...${NC}"
npm install

echo ""
echo -e "${BLUE}Step 3: Setting up database...${NC}"
npm run db:setup

echo ""
echo -e "${GREEN}✅ Setup completed successfully!${NC}"
echo ""
echo -e "${BLUE}To start the development server:${NC}"
echo "npm run dev"
echo ""
echo "Then visit: http://localhost:3000"
