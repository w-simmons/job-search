import {
  pgTable,
  serial,
  text,
  timestamp,
  varchar,
  integer,
  boolean,
  jsonb,
  index,
  uniqueIndex,
} from "drizzle-orm/pg-core";

// Job listings from various sources
export const jobs = pgTable(
  "jobs",
  {
    id: serial("id").primaryKey(),
    externalId: varchar("external_id", { length: 255 }).notNull(),
    source: varchar("source", { length: 50 }).notNull(), // 'linkedin', 'indeed', 'greenhouse', etc.
    title: varchar("title", { length: 500 }).notNull(),
    company: varchar("company", { length: 255 }).notNull(),
    location: varchar("location", { length: 255 }),
    salary: varchar("salary", { length: 100 }),
    salaryMin: integer("salary_min"),
    salaryMax: integer("salary_max"),
    description: text("description"),
    url: text("url").notNull(),
    postedAt: timestamp("posted_at"),
    scrapedAt: timestamp("scraped_at").defaultNow().notNull(),
    isRemote: boolean("is_remote").default(false),
    jobType: varchar("job_type", { length: 50 }), // 'full-time', 'part-time', 'contract'
    experienceLevel: varchar("experience_level", { length: 50 }),
    skills: jsonb("skills").$type<string[]>(),
    raw: jsonb("raw"), // Original API/scrape response
    embedding: jsonb("embedding").$type<number[]>(), // For semantic search
  },
  (table) => ({
    sourceExternalIdx: uniqueIndex("source_external_idx").on(
      table.source,
      table.externalId
    ),
    companyIdx: index("company_idx").on(table.company),
    titleIdx: index("title_idx").on(table.title),
  })
);

// Saved searches / alerts
export const savedSearches = pgTable("saved_searches", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  query: text("query").notNull(),
  filters: jsonb("filters"),
  isActive: boolean("is_active").default(true),
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastRunAt: timestamp("last_run_at"),
});

// User interactions with jobs
export const jobInteractions = pgTable(
  "job_interactions",
  {
    id: serial("id").primaryKey(),
    jobId: integer("job_id")
      .references(() => jobs.id)
      .notNull(),
    action: varchar("action", { length: 50 }).notNull(), // 'viewed', 'saved', 'applied', 'hidden'
    notes: text("notes"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
  },
  (table) => ({
    jobActionIdx: index("job_action_idx").on(table.jobId, table.action),
  })
);

// Types
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type SavedSearch = typeof savedSearches.$inferSelect;
export type JobInteraction = typeof jobInteractions.$inferSelect;
