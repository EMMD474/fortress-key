# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fortress Key is a full-stack password vault/manager built with Next.js 15 (App Router), React 19, TypeScript 5, and PostgreSQL 16 via Prisma ORM. Credentials are encrypted with AES-256-GCM using PBKDF2 key derivation (100,000 iterations, per-user salt, random IV per credential).

## Commands

```bash
pnpm dev              # Start dev server (Turbopack)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # ESLint
pnpm seed             # Seed database (tsx prisma/seed.ts)

# Database
npx prisma migrate dev       # Run migrations
npx prisma studio            # Open Prisma Studio GUI
npx prisma generate          # Regenerate Prisma client

# Docker (PostgreSQL)
docker compose up -d         # Start PostgreSQL container
docker compose down          # Stop container
```

## Architecture

### Routing

- **`app/(main)/`** — Protected route group (dashboard, vault, password-generator, profile, settings, security-audit, image). Auth enforced by `middleware.ts` using NextAuth's `withAuth`.
- **`app/auth/`** — Public auth pages (login, register, forgot-password).
- **`app/api/`** — API routes for auth, credentials CRUD, categories, password generation, and email sending.

### Authentication

NextAuth with credentials provider (email/password), JWT strategy, 15-minute session expiry. Master password hashed with bcryptjs. Session types are augmented in `types/next-auth.d.ts` to include `id`, `firstName`, `lastName`, `userName`.

### Encryption (Vault)

Credentials API routes (`app/api/credentials/`) handle encryption/decryption server-side:
- AES-256-GCM with PBKDF2 key derivation from `ENCRYPTION_KEY` env var + user-specific salt
- Each credential gets a random IV; encrypted data stored as `Bytes` in Prisma
- See `VAULT_README.md` for full encryption architecture and API endpoint documentation

### Key Directories

- **`lib/`** — Shared utilities: `api.ts` (typed fetch wrapper), `authenticate.ts` (server-side session check), `prismaConnect.ts` (singleton client), `credentialsApi.ts` (credentials API client class), `generatePassword.ts`
- **`components/`** — UI components, navigation (NavBar, SideNav, BottomNavBar), auth forms, modals, AddCredentials form
- **`context/`** — React context providers: SessionProvider wrapper (`provider.tsx`), password modal state, sidebar state
- **`prisma/`** — Schema, migrations, seed script
- **`emails/`** — React Email templates (used with Resend)

### Database Schema (Prisma)

Four models: `User`, `Credential`, `Category`, `UserOTP`. Categories can be system-wide (seeded defaults: Social Media, Banking, Work, Personal) or user-created. OTPs support password reset flow with expiry and used-flag.

### Styling

Tailwind CSS 4 via PostCSS. Dark mode support with CSS variables. Geist font family. Animations via Framer Motion.

## Environment Variables

Requires `.env` with: `DATABASE_URL` (PostgreSQL connection string), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, `ENCRYPTION_KEY`, and optionally `RESEND_API_KEY`, Cloudinary config.

## Testing Account

Seed creates: `admin@fortress-key.com` / `Password@true.com`
