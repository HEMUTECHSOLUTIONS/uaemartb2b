# 🏢 UAEMart - B2B Marketplace

Professional B2B marketplace platform built with **Next.js 14**, **Supabase PostgreSQL**, and modern web technologies.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- npm or yarn
- Supabase account (free at [supabase.com](https://supabase.com))

### Installation

```bash
# 1. Install dependencies
npm install

# 2. Create .env.local with your Supabase credentials
# Copy values from your Supabase dashboard:
# - NEXT_PUBLIC_SUPABASE_URL (Settings → API)
# - NEXT_PUBLIC_SUPABASE_ANON_KEY (Settings → API)
# - SUPABASE_SERVICE_ROLE_KEY (Settings → API)
# - DATABASE_URL (Settings → Database)

# 3. Setup database
npm run db:setup

# 4. Start development server
npm run dev
```

Visit: **http://localhost:3000**

## 📦 Tech Stack

- **Frontend**: Next.js 14, React 18
- **Backend**: Next.js API Routes
- **Database**: PostgreSQL (Supabase)
- **Authentication**: JWT
- **Deployment**: Vercel

## 📂 Project Structure

```
├── app/
│   ├── api/              # API routes
│   ├── layout.js         # Root layout
│   └── page.js           # Home page
├── lib/
│   ├── supabase.js       # Supabase client
│   ├── database.js       # DB helpers
│   ├── auth-utils.js     # JWT utilities
│   └── validators.js     # Input validation
├── database/
│   ├── schema.sql        # Database schema
│   ├── functions.sql     # PostgreSQL functions
│   └── seed-data.sql     # Initial data
├── scripts/
│   ├── setup-database.js # Setup script
│   ├── quick-setup.js    # Interactive setup
│   └── check-env.js      # Env validation
├── middleware.js         # JWT middleware
└── next.config.js        # Next.js config
```

## 🔐 API Endpoints

### Public Routes
- `GET /api/health` - Health check
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User login
- `GET /api/categories` - List all categories
- `GET /api/companies` - Search companies
- `GET /api/requirements` - List buyer requirements

### Protected Routes (Require JWT)
- `POST /api/companies/create` - Create company
- `GET /api/profile` - Get user profile
- `PUT /api/profile` - Update profile
- `GET /api/dashboard` - User dashboard

## 🗄️ Database Schema

### Core Tables
- **users** - User accounts (buyer, seller, admin)
- **companies** - Seller company profiles
- **products** - Product listings
- **categories** - Product categories
- **requirements** - Buyer requirements/RFQs
- **reviews** - Company reviews and ratings
- **requirement_responses** - Seller responses to RFQs
- **notifications** - User notifications
- **inquiries** - Product inquiries
- **subscriptions** - Seller subscriptions

## 📝 Environment Variables

Required variables in `.env.local`:

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
DATABASE_URL=postgresql://postgres:password@db.your-project.supabase.co:5432/postgres

# Security
JWT_SECRET=your-32-character-secret
NEXTAUTH_SECRET=your-32-character-secret

# URLs
NEXTAUTH_URL=http://localhost:3000
NEXT_PUBLIC_APP_URL=http://localhost:3000
NEXT_PUBLIC_API_URL=http://localhost:3000/api
```

## 🔑 Default Admin Account

```
Email: admin@uaemart.com
Password: Admin@123
```

⚠️ **Change password after first login!**

## 📜 Available Scripts

```bash
npm run dev              # Start development server
npm run build            # Build for production
npm start                # Start production server
npm run check-env        # Validate environment
npm run quick-setup      # Interactive setup wizard
npm run db:setup         # Initialize database
npm run db:migrate       # Run migrations
npm run db:seed          # Seed database
```

## 🐛 Troubleshooting

### Port 3000 already in use
```bash
# Kill process using port 3000
Get-NetTCPConnection -LocalPort 3000 | Stop-Process -Force
npm run dev
```

### Database connection error
- Verify DATABASE_URL includes URL-encoded password (e.g., `%40` for `@`)
- Check Supabase project is active
- Wait 2-3 minutes for new Supabase projects to initialize

### Permission denied for table
- Ensure SUPABASE_SERVICE_ROLE_KEY is correct
- Check database hasn't been reset outside of the setup script

## 📚 Documentation

- [Next.js Docs](https://nextjs.org/docs)
- [Supabase Docs](https://supabase.com/docs)
- [PostgreSQL Docs](https://www.postgresql.org/docs/)

## 📄 License

MIT
