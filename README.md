# Fortress Key

Fortress Key is a full-stack, **end-to-end encrypted** password vault / manager. Credentials are encrypted and decrypted entirely in the browser (**zero-knowledge**): the server only ever stores opaque ciphertext and never sees your master password or any plaintext. Built on Next.js + PostgreSQL.

> **🔐 Architecture status:** The zero-knowledge model described below is the committed design and is being implemented now (Argon2id + AES-256-GCM, client-side). See [`docs/ENCRYPTION_DESIGN.md`](./docs/ENCRYPTION_DESIGN.md) for the full spec. Earlier server-side encryption notes in `VAULT_README.md` are **superseded**.

## Features

- **Zero-knowledge encryption** — credentials are encrypted/decrypted in your browser; the server never sees plaintext or your master password
- **Encrypted vault** — store, search, filter, and organize login credentials
- **Password generator** — create strong passwords with configurable rules
- **Security audit** — review credential health and strength
- **Categories** — system defaults (Social Media, Banking, Work, Personal) plus custom categories
- **Account recovery** — a recovery key issued at signup restores access if the master password is forgotten
- **Profile pictures** — image upload via Cloudinary

## Tech Stack

- Next.js 15 (App Router) + React 19 + TypeScript 5
- Prisma ORM + PostgreSQL 16
- NextAuth (credentials provider, JWT sessions)
- Tailwind CSS 4
- Framer Motion (animations)
- Resend + React Email (transactional email)
- Cloudinary (image uploads)

## Security Model (Zero-Knowledge)

All credential encryption happens **client-side**. The server is a secure blob store — it cannot read any password, even in memory.

- **Key derivation:** `Argon2id` (memory-hard) turns the master password + a per-user salt into a **Master Key**, which never leaves the browser.
- **Key hierarchy:** a random **Vault Key** actually encrypts credentials (`AES-256-GCM`, fresh IV + auth tag each). The server stores two *wrapped* (encrypted) copies of the Vault Key — one under the Master Key, one under the Recovery Key.
- **Authentication:** the server verifies a derived `authHash` (re-hashed again server-side), never the master password.
- **Recovery:** a one-time **recovery key** shown at signup can unwrap the Vault Key to set a new master password. Lose both the master password **and** the recovery key and the data is unrecoverable by design — there is no server-side backdoor.

Diagrams: [`docs/ENCRYPTION_FLOWS.html`](./docs/ENCRYPTION_FLOWS.html) · full spec: [`docs/ENCRYPTION_DESIGN.md`](./docs/ENCRYPTION_DESIGN.md).

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

   # Optional — email and image uploads
   RESEND_API_KEY="your-resend-api-key"
   EMAIL_FROM="noreply@example.com"
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME="your-cloud-name"

   NODE_ENV="development"
   ```

   > Under the zero-knowledge model the server holds **no** credential encryption key — keys are derived in the browser from the user's master password, so there is no `ENCRYPTION_KEY` secret to manage. `NEXTAUTH_SECRET` only signs session tokens; it cannot decrypt any vault data.

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

- Encryption design (zero-knowledge spec): [`docs/ENCRYPTION_DESIGN.md`](./docs/ENCRYPTION_DESIGN.md)
- Encryption flow diagrams: [`docs/ENCRYPTION_FLOWS.html`](./docs/ENCRYPTION_FLOWS.html)
- System architecture overview: [`ARCHITECTURE.html`](./ARCHITECTURE.html)
- Claude Code guidance: [`CLAUDE.md`](./CLAUDE.md)
- _Superseded:_ [`VAULT_README.md`](./VAULT_README.md) — original server-side encryption notes, kept for history

> **Note:** account recovery uses the recovery-key flow above, which replaces the older email-OTP password reset. The `UserOTP` model will be removed or repurposed during implementation.
