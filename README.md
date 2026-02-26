# Fortress Key

Fortress Key is a full-stack password vault app built with Next.js, Prisma, PostgreSQL, and NextAuth.

## Tech Stack

- Next.js 15 (App Router)
- React 19 + TypeScript
- Prisma ORM
- PostgreSQL 16
- NextAuth
- Tailwind CSS 4
- Resend (email)

## Prerequisites

- Node.js 20+
- pnpm
- Docker (for local Postgres via `docker-compose`)

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
RESEND_API_KEY="your-resend-api-key"
EMAIL_FROM="noreply@example.com"
NODE_ENV="development"
```

3. Start PostgreSQL:

```bash
docker compose up -d
```

4. Apply database migrations:

```bash
pnpm prisma migrate dev
```

5. (Optional) Seed data:

```bash
pnpm seed
```

6. Start the app:

```bash
pnpm dev
```

Open `http://localhost:3000`.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm seed` - Run Prisma seed script

## Database

A local PostgreSQL service is defined in [`docker-compose.yml`](./docker-compose.yml).

- Container: `fortress-postgres`
- Port: `5432`
- Database: `fortressdb`
- User: `fortressuser`

## Project Notes

- Prisma schema lives at `prisma/schema.prisma`.
- Auth routes and handlers are under `app/api/auth`.
- Vault-specific notes are in `VAULT_README.md`.
