import {
  sqliteTable,
  text,
  integer,
  index,
  uniqueIndex,
} from "drizzle-orm/sqlite-core";

// ============================================
// Companies (normalized)
// ============================================
export const companies = sqliteTable(
  "companies",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    domain: text("domain"),
    logo: text("logo"),
    industry: text("industry"),
    size: text("size"), // 'startup', 'small', 'medium', 'large', 'enterprise'
    headquarters: text("headquarters"),
    linkedinUrl: text("linkedin_url"),
    description: text("description"),
    employeeCount: integer("employee_count"),
    fundingStage: text("funding_stage"),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  },
  (table) => ({
    nameIdx: index("company_name_idx").on(table.name),
    domainIdx: uniqueIndex("company_domain_idx").on(table.domain),
  })
);

// ============================================
// Job Sources (track API/scrape health)
// ============================================
export const jobSources = sqliteTable("job_sources", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull().unique(),
  type: text("type").notNull(), // 'api', 'scrape', 'rss', 'manual'
  baseUrl: text("base_url"),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  lastSyncAt: integer("last_sync_at", { mode: "timestamp" }),
  lastSuccessAt: integer("last_success_at", { mode: "timestamp" }),
  lastErrorAt: integer("last_error_at", { mode: "timestamp" }),
  lastError: text("last_error"),
  jobCount: integer("job_count").default(0),
  avgSyncDurationMs: integer("avg_sync_duration_ms"),
  config: text("config", { mode: "json" }),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// ============================================
// Jobs (main listings)
// ============================================
export const jobs = sqliteTable(
  "jobs",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    externalId: text("external_id").notNull(),
    source: text("source").notNull(),
    sourceId: integer("source_id").references(() => jobSources.id),
    companyId: integer("company_id").references(() => companies.id),
    title: text("title").notNull(),
    company: text("company").notNull(),
    location: text("location"),
    salary: text("salary"),
    salaryMin: integer("salary_min"),
    salaryMax: integer("salary_max"),
    salaryCurrency: text("salary_currency").default("USD"),
    description: text("description"),
    url: text("url").notNull(),
    postedAt: integer("posted_at", { mode: "timestamp" }),
    scrapedAt: integer("scraped_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
    expiresAt: integer("expires_at", { mode: "timestamp" }),
    isRemote: integer("is_remote", { mode: "boolean" }).default(false),
    isHybrid: integer("is_hybrid", { mode: "boolean" }).default(false),
    jobType: text("job_type"),
    experienceLevel: text("experience_level"),
    department: text("department"),
    skills: text("skills", { mode: "json" }).$type<string[]>(),
    benefits: text("benefits", { mode: "json" }).$type<string[]>(),
    raw: text("raw", { mode: "json" }),
    embedding: text("embedding", { mode: "json" }).$type<number[]>(),
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
export const savedSearches = sqliteTable("saved_searches", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  name: text("name").notNull(),
  query: text("query").notNull(),
  filters: text("filters", { mode: "json" }),
  isActive: integer("is_active", { mode: "boolean" }).default(true),
  notifyEmail: integer("notify_email", { mode: "boolean" }).default(false),
  notifyPush: integer("notify_push", { mode: "boolean" }).default(false),
  frequency: text("frequency").default("daily"),
  newJobCount: integer("new_job_count").default(0),
  createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  lastRunAt: integer("last_run_at", { mode: "timestamp" }),
  lastViewedAt: integer("last_viewed_at", { mode: "timestamp" }),
});

// ============================================
// Job Interactions (user actions)
// ============================================
export const jobInteractions = sqliteTable(
  "job_interactions",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    jobId: integer("job_id")
      .references(() => jobs.id, { onDelete: "cascade" })
      .notNull(),
    action: text("action").notNull(),
    pipelineStage: text("pipeline_stage"),
    notes: text("notes"),
    rating: integer("rating"),
    appliedAt: integer("applied_at", { mode: "timestamp" }),
    responseAt: integer("response_at", { mode: "timestamp" }),
    createdAt: integer("created_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
    updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
  },
  (table) => ({
    jobActionIdx: index("job_action_idx").on(table.jobId, table.action),
    pipelineIdx: index("pipeline_idx").on(table.pipelineStage),
  })
);

// ============================================
// User Settings
// ============================================
export const userSettings = sqliteTable("user_settings", {
  id: integer("id").primaryKey({ autoIncrement: true }),
  key: text("key").notNull().unique(),
  value: text("value", { mode: "json" }),
  updatedAt: integer("updated_at", { mode: "timestamp" }).$defaultFn(() => new Date()),
});

// Re-export types from main schema (they're compatible)
export type { 
  SearchFilters, 
  Company, 
  NewCompany, 
  JobSource, 
  NewJobSource,
  Job, 
  NewJob, 
  SavedSearch, 
  NewSavedSearch,
  JobInteraction, 
  NewJobInteraction,
  UserSetting,
  PipelineStage,
} from "./schema";
export { PIPELINE_STAGES } from "./schema";
