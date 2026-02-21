/**
 * Database connection - automatically switches between SQLite (local) and Postgres (production)
 * 
 * Local dev: uses SQLite file at ./data/local.db
 * Production: uses DATABASE_URL (Neon Postgres)
 */

// Re-export schema based on environment (types are compatible)
export * from "./schema";

// Determine if we're in a build environment (no db needed)
const isBuildTime = process.env.NEXT_PHASE === "phase-production-build";

// Determine environment at module load time
const isProduction = process.env.NODE_ENV === "production";
const usePostgres = isProduction && !!process.env.DATABASE_URL;

// Helper to check which db we're using
export const dbType = usePostgres ? "postgres" : "sqlite" as const;

// Create a chainable mock that returns empty results
function createMockDb() {
  const createChainable = (): any => {
    const handler: ProxyHandler<any> = {
      get(_, prop) {
        if (prop === 'then') {
          // Make it thenable - resolve to empty array
          return (resolve: (value: any) => void) => resolve([]);
        }
        // Return another chainable proxy for method chaining
        return (..._args: unknown[]) => new Proxy({}, handler);
      },
      apply() {
        return new Proxy({}, handler);
      }
    };
    return new Proxy(function() {}, handler);
  };

  return new Proxy({}, {
    get(_, prop) {
      if (prop === 'then') return undefined;
      return createChainable();
    }
  });
}

// Create the database connection
function createDatabase() {
  // During build or production without DB, return mock
  if (isBuildTime || (isProduction && !process.env.DATABASE_URL)) {
    console.log("📊 Using mock database (no DATABASE_URL)");
    return createMockDb();
  }

  if (usePostgres) {
    // Postgres (Neon)
    const { neon } = require("@neondatabase/serverless");
    const { drizzle } = require("drizzle-orm/neon-http");
    const schema = require("./schema");
    
    const url = process.env.DATABASE_URL;
    if (!url) {
      throw new Error("DATABASE_URL is required in production");
    }
    console.log("📊 Using Postgres (Neon)");
    const sql = neon(url);
    return drizzle(sql, { schema });
  } else {
    // SQLite (local dev)
    const Database = require("better-sqlite3");
    const { drizzle } = require("drizzle-orm/better-sqlite3");
    const schema = require("./schema-sqlite");
    const fs = require("fs");
    const path = require("path");
    
    const dbPath = process.env.SQLITE_PATH || "./data/local.db";
    console.log(`📊 Using SQLite at ${dbPath}`);
    
    // Ensure data directory exists
    const dir = path.dirname(dbPath);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    
    const sqlite = new Database(dbPath);
    sqlite.pragma("journal_mode = WAL");
    return drizzle(sqlite, { schema });
  }
}

// Export db instance - typed as any to avoid union type issues
// The actual runtime type depends on the environment
export const db = createDatabase() as any;

// Re-export common drizzle operators for convenience
export { eq, and, or, desc, asc, like, gte, lte, isNull, isNotNull, inArray, notInArray, count, sql } from "drizzle-orm";
