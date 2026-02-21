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

// ============================================
// Companies (normalized)
// ============================================
export const companies = pgTable(
  "companies",
  {
    id: serial("id").primaryKey(),
    name: varchar("name", { length: 255 }).notNull(),
    domain: varchar("domain", { length: 255 }),
    logo: text("logo"),
    industry: varchar("industry", { length: 100 }),
    size: varchar("size", { length: 50 }), // 'startup', 'small', 'medium', 'large', 'enterprise'
    headquarters: varchar("headquarters", { length: 255 }),
    linkedinUrl: text("linkedin_url"),
    description: text("description"),
    employeeCount: integer("employee_count"),
    fundingStage: varchar("funding_stage", { length: 50 }), // 'seed', 'series-a', 'series-b', 'public', etc.
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    nameIdx: index("company_name_idx").on(table.name),
    domainIdx: uniqueIndex("company_domain_idx").on(table.domain),
  })
);

// ============================================
// Job Sources (track API/scrape health)
// ============================================
export const jobSources = pgTable("job_sources", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 100 }).notNull().unique(),
  type: varchar("type", { length: 50 }).notNull(), // 'api', 'scrape', 'rss', 'manual'
  baseUrl: text("base_url"),
  isActive: boolean("is_active").default(true),
  lastSyncAt: timestamp("last_sync_at"),
  lastSuccessAt: timestamp("last_success_at"),
  lastErrorAt: timestamp("last_error_at"),
  lastError: text("last_error"),
  jobCount: integer("job_count").default(0),
  avgSyncDurationMs: integer("avg_sync_duration_ms"),
  config: jsonb("config"), // Source-specific configuration
  createdAt: timestamp("created_at").defaultNow().notNull(),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// Jobs (main listings)
// ============================================
export const jobs = pgTable(
  "jobs",
  {
    id: serial("id").primaryKey(),
    externalId: varchar("external_id", { length: 255 }).notNull(),
    source: varchar("source", { length: 50 }).notNull(),
    sourceId: integer("source_id").references(() => jobSources.id),
    companyId: integer("company_id").references(() => companies.id),
    title: varchar("title", { length: 500 }).notNull(),
    company: varchar("company", { length: 255 }).notNull(), // Denormalized for quick access
    location: varchar("location", { length: 255 }),
    salary: varchar("salary", { length: 100 }),
    salaryMin: integer("salary_min"),
    salaryMax: integer("salary_max"),
    salaryCurrency: varchar("salary_currency", { length: 3 }).default("USD"),
    description: text("description"),
    url: text("url").notNull(),
    postedAt: timestamp("posted_at"),
    scrapedAt: timestamp("scraped_at").defaultNow().notNull(),
    expiresAt: timestamp("expires_at"),
    isRemote: boolean("is_remote").default(false),
    isHybrid: boolean("is_hybrid").default(false),
    jobType: varchar("job_type", { length: 50 }), // 'full-time', 'part-time', 'contract', 'intern'
    experienceLevel: varchar("experience_level", { length: 50 }), // 'entry', 'mid', 'senior', 'staff', 'principal'
    department: varchar("department", { length: 100 }),
    skills: jsonb("skills").$type<string[]>(),
    benefits: jsonb("benefits").$type<string[]>(),
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
    postedAtIdx: index("posted_at_idx").on(table.postedAt),
    salaryMinIdx: index("salary_min_idx").on(table.salaryMin),
  })
);

// ============================================
// Saved Searches / Alerts
// ============================================
export const savedSearches = pgTable("saved_searches", {
  id: serial("id").primaryKey(),
  name: varchar("name", { length: 255 }).notNull(),
  query: text("query").notNull(),
  filters: jsonb("filters").$type<SearchFilters>(),
  isActive: boolean("is_active").default(true),
  notifyEmail: boolean("notify_email").default(false),
  notifyPush: boolean("notify_push").default(false),
  frequency: varchar("frequency", { length: 20 }).default("daily"), // 'realtime', 'daily', 'weekly'
  newJobCount: integer("new_job_count").default(0), // Jobs found since last viewed
  createdAt: timestamp("created_at").defaultNow().notNull(),
  lastRunAt: timestamp("last_run_at"),
  lastViewedAt: timestamp("last_viewed_at"),
});

// ============================================
// Job Interactions (user actions)
// ============================================
export const jobInteractions = pgTable(
  "job_interactions",
  {
    id: serial("id").primaryKey(),
    jobId: integer("job_id")
      .references(() => jobs.id, { onDelete: "cascade" })
      .notNull(),
    action: varchar("action", { length: 50 }).notNull(), // 'viewed', 'saved', 'applied', 'hidden', 'archived'
    pipelineStage: varchar("pipeline_stage", { length: 50 }), // 'interested', 'applied', 'interviewing', 'offer', 'rejected'
    notes: text("notes"),
    rating: integer("rating"), // 1-5 stars
    appliedAt: timestamp("applied_at"),
    responseAt: timestamp("response_at"),
    createdAt: timestamp("created_at").defaultNow().notNull(),
    updatedAt: timestamp("updated_at").defaultNow().notNull(),
  },
  (table) => ({
    jobActionIdx: index("job_action_idx").on(table.jobId, table.action),
    pipelineIdx: index("pipeline_idx").on(table.pipelineStage),
  })
);

// ============================================
// User Settings
// ============================================
export const userSettings = pgTable("user_settings", {
  id: serial("id").primaryKey(),
  key: varchar("key", { length: 100 }).notNull().unique(),
  value: jsonb("value"),
  updatedAt: timestamp("updated_at").defaultNow().notNull(),
});

// ============================================
// Types
// ============================================
export interface SearchFilters {
  locations?: string[];
  remoteOnly?: boolean;
  salaryMin?: number;
  salaryMax?: number;
  jobTypes?: string[];
  experienceLevels?: string[];
  companies?: string[];
  excludeCompanies?: string[];
  skills?: string[];
  postedWithinDays?: number;
}

export type Company = typeof companies.$inferSelect;
export type NewCompany = typeof companies.$inferInsert;
export type JobSource = typeof jobSources.$inferSelect;
export type NewJobSource = typeof jobSources.$inferInsert;
export type Job = typeof jobs.$inferSelect;
export type NewJob = typeof jobs.$inferInsert;
export type SavedSearch = typeof savedSearches.$inferSelect;
export type NewSavedSearch = typeof savedSearches.$inferInsert;
export type JobInteraction = typeof jobInteractions.$inferSelect;
export type NewJobInteraction = typeof jobInteractions.$inferInsert;
export type UserSetting = typeof userSettings.$inferSelect;

// Pipeline stages for Kanban
export const PIPELINE_STAGES = [
  "interested",
  "applied",
  "interviewing",
  "offer",
  "rejected",
] as const;
export type PipelineStage = (typeof PIPELINE_STAGES)[number];
