# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Common Development Commands

### Development Server
- `pnpm dev` - Start development server with Turbopack
- `pnpm build` - Build production version with Turbopack
- `pnpm start` - Start production server

### Database
- `docker compose up -d` - Start PostgreSQL database container
- `pnpm db:seed` - Seed database with admin user
- `npx prisma migrate dev` - Run database migrations
- `npx prisma migrate deploy` - Deploy migrations (production)
- `npx prisma generate` - Generate Prisma client after schema changes
- `npx prisma db push` - Push schema changes directly to database
- `npx prisma studio` - Open Prisma Studio database viewer

### Linting
- `pnpm lint` - Run ESLint

## Architecture

**Stack**: Next.js 15 with TypeScript, Prisma, NextAuth, PostgreSQL, Tailwind CSS

**Key Directories**:
- `/app/(main)/` - Protected routes requiring authentication (dashboard, vault, profile, settings)
- `/app/auth/` - Public authentication pages (login, register, forgot-password)
- `/app/api/auth/` - Authentication API routes
- `/lib/` - Shared utilities and database connection
- `/components/` - Reusable React components
- `/emails/` - React email templates
- `/prisma/` - Database schema and migrations

**Authentication**: NextAuth with JWT strategy, 15-minute session expiration, credentials provider

**Database**: PostgreSQL with Prisma ORM. Custom client output to `lib/generated/prisma/`

**Key Features**:
- Password manager with encrypted credential storage
- OTP-based password reset flow
- Profile image upload with Cloudinary
- Email notifications using Resend
- Responsive UI with dark mode support

## Environment Variables

Required:
- `DATABASE_URL` - PostgreSQL connection string
- `NEXTAUTH_SECRET` - NextAuth JWT secret
- `RESEND_API_KEY` - Email service API key
- `EMAIL_FROM` - Sender email address

Optional:
- `CLOUDINARY_*` - Profile image upload (currently commented out)

## Database Setup

1. Start database: `docker compose up -d`
2. Run migrations: `npx prisma migrate dev`
3. Seed initial data: `pnpm db:seed` (creates admin@fortress-key.com with password "Password@true.com")

## Testing Accounts

Default seeded admin user:
- Email: admin@fortress-key.com  
- Password: Password@true.com