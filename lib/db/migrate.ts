/**
 * Local migration script for SQLite
 * Run: npx tsx lib/db/migrate.ts
 * 
 * For Postgres, use: npm run db:push
 */

import Database from "better-sqlite3";
import { drizzle } from "drizzle-orm/better-sqlite3";
import { migrate } from "drizzle-orm/better-sqlite3/migrator";
import * as schema from "./schema-sqlite";
import * as fs from "fs";
import * as path from "path";

const dbPath = process.env.SQLITE_PATH || "./data/local.db";

// Ensure data directory exists
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

console.log(`🔄 Running migrations on SQLite: ${dbPath}`);

const sqlite = new Database(dbPath);
sqlite.pragma("journal_mode = WAL");

const db = drizzle(sqlite, { schema });

// Check if migrations folder exists
const migrationsExist = fs.existsSync("./drizzle-sqlite/meta/_journal.json");

if (migrationsExist) {
  // Run migrations from drizzle folder
  migrate(db, { migrationsFolder: "./drizzle-sqlite" });
  console.log("✅ Migrations complete!");
} else {
  // No migrations folder, create tables directly
  console.log("📝 No migrations folder found, creating tables directly...");
  createTablesDirectly(sqlite);
  console.log("✅ Tables created!");
}

sqlite.close();

function createTablesDirectly(db: Database.Database) {
  // Create tables using raw SQL (SQLite syntax)
  db.exec(`
    -- Companies
    CREATE TABLE IF NOT EXISTS companies (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      domain TEXT UNIQUE,
      logo TEXT,
      industry TEXT,
      size TEXT,
      headquarters TEXT,
      linkedin_url TEXT,
      description TEXT,
      employee_count INTEGER,
      funding_stage TEXT,
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch())
    );
    CREATE INDEX IF NOT EXISTS company_name_idx ON companies(name);

    -- Job Sources
    CREATE TABLE IF NOT EXISTS job_sources (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL UNIQUE,
      type TEXT NOT NULL,
      base_url TEXT,
      is_active INTEGER DEFAULT 1,
      last_sync_at INTEGER,
      last_success_at INTEGER,
      last_error_at INTEGER,
      last_error TEXT,
      job_count INTEGER DEFAULT 0,
      avg_sync_duration_ms INTEGER,
      config TEXT,
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch())
    );

    -- Jobs
    CREATE TABLE IF NOT EXISTS jobs (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      external_id TEXT NOT NULL,
      source TEXT NOT NULL,
      source_id INTEGER REFERENCES job_sources(id),
      company_id INTEGER REFERENCES companies(id),
      title TEXT NOT NULL,
      company TEXT NOT NULL,
      location TEXT,
      salary TEXT,
      salary_min INTEGER,
      salary_max INTEGER,
      salary_currency TEXT DEFAULT 'USD',
      description TEXT,
      url TEXT NOT NULL,
      posted_at INTEGER,
      scraped_at INTEGER DEFAULT (unixepoch()),
      expires_at INTEGER,
      is_remote INTEGER DEFAULT 0,
      is_hybrid INTEGER DEFAULT 0,
      job_type TEXT,
      experience_level TEXT,
      department TEXT,
      skills TEXT,
      benefits TEXT,
      raw TEXT,
      embedding TEXT
    );
    CREATE UNIQUE INDEX IF NOT EXISTS source_external_idx ON jobs(source, external_id);
    CREATE INDEX IF NOT EXISTS company_idx ON jobs(company);
    CREATE INDEX IF NOT EXISTS title_idx ON jobs(title);
    CREATE INDEX IF NOT EXISTS posted_at_idx ON jobs(posted_at);
    CREATE INDEX IF NOT EXISTS salary_min_idx ON jobs(salary_min);

    -- Saved Searches
    CREATE TABLE IF NOT EXISTS saved_searches (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      name TEXT NOT NULL,
      query TEXT NOT NULL,
      filters TEXT,
      is_active INTEGER DEFAULT 1,
      notify_email INTEGER DEFAULT 0,
      notify_push INTEGER DEFAULT 0,
      frequency TEXT DEFAULT 'daily',
      new_job_count INTEGER DEFAULT 0,
      created_at INTEGER DEFAULT (unixepoch()),
      last_run_at INTEGER,
      last_viewed_at INTEGER
    );

    -- Job Interactions
    CREATE TABLE IF NOT EXISTS job_interactions (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      job_id INTEGER NOT NULL REFERENCES jobs(id) ON DELETE CASCADE,
      action TEXT NOT NULL,
      pipeline_stage TEXT,
      notes TEXT,
      rating INTEGER,
      applied_at INTEGER,
      response_at INTEGER,
      created_at INTEGER DEFAULT (unixepoch()),
      updated_at INTEGER DEFAULT (unixepoch())
    );
    CREATE INDEX IF NOT EXISTS job_action_idx ON job_interactions(job_id, action);
    CREATE INDEX IF NOT EXISTS pipeline_idx ON job_interactions(pipeline_stage);

    -- User Settings
    CREATE TABLE IF NOT EXISTS user_settings (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      key TEXT NOT NULL UNIQUE,
      value TEXT,
      updated_at INTEGER DEFAULT (unixepoch())
    );
  `);
}
