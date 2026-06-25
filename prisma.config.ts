import path from "node:path";
import { defineConfig } from "prisma/config";

// Prisma stops auto-loading .env once a config file is present, so load it
// ourselves. Node's built-in loader avoids adding a dotenv dependency.
try {
  process.loadEnvFile();
} catch {
  // No .env file (e.g. CI) — env vars are expected to be set already.
}

export default defineConfig({
  schema: path.join("prisma", "schema.prisma"),

  migrations: {
    path: path.join("db", "migrations"),
  },

  views: {
    path: path.join("db", "views"),
  },

  typedSql: {
    path: path.join("db", "queries"),
  },

  seed: {
    run: "tsx prisma/seed.ts",
  },
} as any);
