# Fortress Key

Fortress Key is a full-stack password vault / manager. Credentials are encrypted server-side with **AES-256-GCM** (PBKDF2 key derivation, 100,000 iterations, per-user salt, random IV per credential) and stored in PostgreSQL.

## Features

- **Encrypted vault** — store, search, filter, and organize login credentials
- **Password generator** — create strong passwords with configurable rules
- **Security audit** — review credential health and strength
- **Categories** — system defaults (Social Media, Banking, Work, Personal) plus custom categories
- **Auth & account** — register, login, profile management, and password reset via email OTP
- **Profile pictures** — image upload via Cloudinary

## Tech Stack

- Next.js 15 (App Router) + React 19 + TypeScript 5
- Prisma ORM + PostgreSQL 16
- NextAuth (credentials provider, JWT sessions)
- Tailwind CSS 4
- Framer Motion (animations)
- Resend + React Email (transactional email)
- Cloudinary (image uploads)

## Prerequisites

- Node.js 20+
- pnpm
- Docker (for local Postgres via `docker compose`)

## Local Setup

1. Install dependencies:

   ```bash
   pnpm install
   ```

2. Create `.env` in the project root:

   ```env
   DATABASE_URL="postgresql://fortressuser:fortresspass@localhost:5432/fortressdb?schema=public"
   NEXTAUTH_SECRET="replace-with-a-secure-random-string"
   NEXTAUTH_URL="http://localhost:3000"
   ENCRYPTION_KEY="replace-with-a-secure-random-string"

   # Optional — email (password reset) and image uploads
   RESEND_API_KEY="your-resend-api-key"
   EMAIL_FROM="noreply@example.com"
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"

   NODE_ENV="development"
   ```

   > `ENCRYPTION_KEY` is the master secret used to derive per-user encryption keys for the vault. Keep it stable and secret — rotating it makes existing credentials undecryptable.

3. Start PostgreSQL:

   ```bash
   docker compose up -d
   ```

4. Apply database migrations:

   ```bash
   npx prisma migrate dev
   ```

5. (Optional) Seed data:

   ```bash
   pnpm seed
   ```

   The seed creates a test account: `admin@fortress-key.com` / `Password@true.com`

6. Start the app:

   ```bash
   pnpm dev
   ```

   Open `http://localhost:3000`.

## Available Scripts

- `pnpm dev` — Start dev server (Turbopack)
- `pnpm build` — Build for production
- `pnpm start` — Start production server
- `pnpm lint` — Run ESLint
- `pnpm seed` — Run Prisma seed script (`prisma/seed.ts`)

### Database (Prisma)

- `npx prisma migrate dev` — Run migrations
- `npx prisma studio` — Open Prisma Studio GUI
- `npx prisma generate` — Regenerate the Prisma client

## Project Structure

- **`app/(main)/`** — Protected pages: dashboard, vault, password-generator, profile, settings, security-audit, image. Auth enforced by `middleware.ts`.
- **`app/auth/`** — Public auth pages: login, register, forgot-password.
- **`app/api/`** — API routes: auth, credentials CRUD, categories, password generation, email.
- **`lib/`** — Shared utilities (typed fetch wrapper, server-side auth, Prisma singleton, credentials API client, password generator).
- **`components/`** — UI, navigation, auth forms, modals.
- **`prisma/`** — Schema, migrations, seed script.
- **`emails/`** — React Email templates.

## Database

A local PostgreSQL service is defined in [`docker-compose.yml`](./docker-compose.yml).

- Container: `fortress-postgres`
- Port: `5432`
- Database: `fortressdb`
- User: `fortressuser`

Models: `User`, `Credential`, `Category`, `UserOTP`. See `prisma/schema.prisma`.

## Documentation

- Vault encryption architecture and API endpoints: [`VAULT_README.md`](./VAULT_README.md)
- Claude Code guidance: [`CLAUDE.md`](./CLAUDE.md)
