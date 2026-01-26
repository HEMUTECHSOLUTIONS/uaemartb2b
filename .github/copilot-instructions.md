# 🏢 UAEMart AI Coding Agent Instructions

## Project Overview
- **UAEMart** is a B2B marketplace built with Next.js 14, Supabase PostgreSQL, and React 18.
- The project uses Next.js API routes for backend logic and Supabase for authentication and database.
- Key directories: 
  - `app/` (Next.js pages & API routes)
  - `lib/` (Supabase client, DB helpers, JWT, validation)
  - `database/` (schema, functions, seed data, migrations)
  - `scripts/` (setup, migration, and utility scripts)

## Essential Workflows
- **Install**: `npm install`
- **Setup DB**: `npm run db:setup` (runs scripts/setup-database.js)
- **Dev Server**: `npm run dev` (Next.js dev mode)
- **Migrate**: `npm run db:migrate` (applies SQL in database/migrations/)
- **Seed**: `npm run db:seed`
- **Check env**: `npm run check-env`
- **Quick setup**: `npm run quick-setup` (interactive)

## API & Auth Patterns
- Public API endpoints: `/api/health`, `/api/auth/login`, `/api/auth/register`, `/api/categories`, `/api/companies`, `/api/requirements`
- Protected endpoints require JWT (see `middleware.js`)
- Auth logic in `lib/auth-utils.js` and `middleware.js`
- Supabase client in `lib/supabase.js`

## Database & Migrations
- Schema in `database/schema.sql`, functions in `database/functions.sql`, seed data in `database/seed-data.sql`
- Migrations in `database/migrations/` (numbered, run in order)
- Use `SUPABASE_SERVICE_ROLE_KEY` for privileged DB actions

## Project Conventions
- Use Next.js 14 app directory structure
- API routes in `app/api/` (RESTful, file-based routing)
- JWT-based auth, tokens validated in `middleware.js`
- Input validation in `lib/validators.js`
- Environment config in `.env.local` (see README for required vars)
- Use scripts in `scripts/` for setup and troubleshooting

## Examples
- To add a new API route: create a file in `app/api/{route}/route.js`
- To add a migration: add a numbered SQL file to `database/migrations/`
- To add a DB helper: extend `lib/database.js`

## Troubleshooting
- Port 3000 in use: see README for PowerShell command
- DB connection errors: check `DATABASE_URL` and Supabase status
- Permission errors: verify `SUPABASE_SERVICE_ROLE_KEY`

## References
- See `README.md` for full setup, scripts, and troubleshooting
- Key files: `middleware.js`, `lib/auth-utils.js`, `lib/database.js`, `database/schema.sql`, `scripts/quick-setup.js`
