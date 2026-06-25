# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Fortress Key is a full-stack, **zero-knowledge (end-to-end encrypted)** password vault/manager built with Next.js 15 (App Router), React 19, TypeScript 5, and PostgreSQL 16 via Prisma ORM. All encryption and decryption happen **in the user's browser**; the server only ever stores and serves opaque ciphertext. See `docs/ENCRYPTION_DESIGN.md` for the full crypto architecture (this supersedes the older server-side notes in `VAULT_README.md`).

## Commands

```bash
pnpm dev              # Start dev server (Turbopack)
pnpm build            # Production build
pnpm start            # Start production server
pnpm lint             # ESLint
pnpm test             # Run crypto/unit tests (vitest run)
pnpm test:watch       # Watch mode (vitest)
pnpm seed             # Seed database (tsx prisma/seed.ts)

# Database
npx prisma migrate dev       # Run migrations
npx prisma migrate deploy    # Apply migrations (CI/prod)
npx prisma studio            # Open Prisma Studio GUI
npx prisma generate          # Regenerate Prisma client

# Docker (PostgreSQL)
docker compose up -d         # Start PostgreSQL container
docker compose down          # Stop container
```

Migrations live in **`db/migrations/`** (configured via `prisma.config.ts`, not the default `prisma/migrations/`). `prisma.config.ts` also loads `.env` itself via `process.loadEnvFile()`, since Prisma stops auto-loading env vars once a config file is present.

## Architecture

### Routing

- **`app/(main)/`** — Protected route group (dashboard, vault, password-generator, profile, settings, security-audit). Auth enforced by `middleware.ts` using NextAuth's `withAuth`.
- **`app/auth/`** — Public auth pages (login, register, forgot-password / recovery).
- **`app/api/`** — API routes: auth (`register`, `salt`, `vault-key`, `recovery-material`, `reset-password`, `update-profile`, `[...nextauth]`), credentials CRUD, categories, password generation, and email (`send`).

### Authentication & key flows

NextAuth with credentials provider, JWT strategy, 15-minute session expiry. The master password **never reaches the server**. Instead the browser derives an auth verifier (`authHash = HKDF(masterKey, "auth")`) and sends only that; the server hashes it again with bcrypt (`lib/server/verifier.ts`) before storing in `User.authHash`. Session types are augmented in `types/next-auth.d.ts` to include `id`, `firstName`, `lastName`, `userName`.

Login/unlock fetches the user's public `salt` + `kdfParams`, re-derives the Master Key client-side, verifies via NextAuth, then unwraps the Vault Key (held in browser memory only) to decrypt credentials. Recovery uses a one-time Recovery Key shown at signup.

### Encryption (zero-knowledge, client-side)

All crypto lives in **`lib/crypto/`** and runs in the browser. The server is a dumb, secure blob store — it has no `deriveKey`/`encrypt`/`decrypt` and never sees plaintext or the master password.

Key hierarchy (see `docs/ENCRYPTION_DESIGN.md` §2):
- **Argon2id** (WASM via `hash-wasm`) derives the Master Key from the master password + per-user `salt`; params stored per-user in `kdfParams`.
- A random 256-bit **Vault Key** encrypts every credential. The server stores it *wrapped* (encrypted) twice: once under the Master Key, once under the Recovery Key — so changing the master password or recovering never re-encrypts the whole vault.
- **AES-256-GCM** for encryption and key wrapping (random 96-bit IV, 128-bit auth tag stored and verified).
- **HKDF-SHA256** splits the auth verifier from the Master Key (key-separation rule).

`lib/crypto/index.ts` re-exports the isomorphic primitives; `clientAuth` and `vaultSession` are browser-only and imported directly.

### Key Directories

- **`lib/`** — `api.ts` (typed fetch wrapper), `authenticate.ts` (server-side session check), `prismaConnect.ts` (singleton client), `credentialsApi.ts` (credentials API client class), `generatePassword.ts`, `email.ts`, `generateOTP.ts`
- **`lib/crypto/`** — browser crypto module: `argon2`, `aesgcm`, `hkdf`, `vault`, `recoveryKey`, `random`, `encoding`, `wire`, `clientAuth`, `vaultSession`, plus `crypto.test.ts` (round-trip + tamper tests)
- **`lib/server/`** — server helpers: `verifier.ts` (bcrypt auth-verifier hashing), `saltParams.ts`, `session.ts`, `credentialSchemas.ts` (Zod), `wire.ts`
- **`components/`** — UI components, navigation, auth forms, modals (`AddCredentials`, `RecoveryKeyDisplay`, `ImportExportModal`)
- **`context/`** — React context providers: SessionProvider wrapper (`provider.tsx`), password modal state, sidebar state
- **`prisma/`** — schema and seed script (migrations live in `db/migrations/`)
- **`emails/`** — React Email templates (used with Resend)

### Database Schema (Prisma)

Four models: `User`, `Credential`, `Category`, `UserOTP`.
- **`User`** carries the zero-knowledge key material: `salt`, `kdfParams` (Json), `authHash` (replaces the old `masterHash`), and two wrapped copies of the Vault Key — `wrappedVaultKey`/`wrappedRecoveryKey` each with their `*Iv` and `*Tag` columns.
- **`Credential`** stores `encryptedData`, `iv`, and `tag` (GCM auth tag) as `Bytes`; `label` stays plaintext for listing — never put secrets in it. Indexed on `userId` and `categoryId`.
- **`Category`** — system-wide (seeded defaults: Social Media, Banking, Work, Personal) or user-created.
- **`UserOTP`** — OTP records with expiry/used-flag (legacy reset-password path; the Recovery Key flow is the primary recovery mechanism).

### Styling

Tailwind CSS 4 via PostCSS. Dark mode support with CSS variables. Geist font family. Animations via Framer Motion.

## Environment Variables

`.env` provides `DATABASE_URL` (PostgreSQL connection string), `NEXTAUTH_SECRET`, `NEXTAUTH_URL`, and optionally `RESEND_API_KEY` / Cloudinary config. Docker Postgres credentials (`POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, `POSTGRES_PORT`) are also read from `.env` by `docker-compose.yml`.

> The legacy `ENCRYPTION_KEY` is no longer used — credentials are encrypted client-side, so the server holds no encryption key.

## Testing Account

Seed creates: `admin@fortress-key.com` / `Password@true.com`
