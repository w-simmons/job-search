import { defineConfig } from "drizzle-kit";

const isProduction = process.env.NODE_ENV === "production";
const usePostgres = isProduction || !!process.env.DATABASE_URL;

export default defineConfig(
  usePostgres
    ? {
        // Postgres (Neon) for production
        schema: "./lib/db/schema.ts",
        out: "./drizzle",
        dialect: "postgresql",
        dbCredentials: {
          url: process.env.DATABASE_URL!,
        },
      }
    : {
        // SQLite for local development
        schema: "./lib/db/schema-sqlite.ts",
        out: "./drizzle-sqlite",
        dialect: "sqlite",
        dbCredentials: {
          url: process.env.SQLITE_PATH || "./data/local.db",
        },
      }
);
