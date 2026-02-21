/**
 * Seed script - Populates database with realistic dummy job data
 * Works with both SQLite (local) and Postgres (production)
 * 
 * Run: npx tsx scripts/seed.ts
 */

import Database from "better-sqlite3";
import { drizzle as drizzleSqlite } from "drizzle-orm/better-sqlite3";
import { drizzle as drizzlePg } from "drizzle-orm/neon-http";
import { neon } from "@neondatabase/serverless";
import * as sqliteSchema from "../lib/db/schema-sqlite";
import * as pgSchema from "../lib/db/schema";
import * as fs from "fs";
import * as path from "path";

// Determine environment
const usePostgres = !!process.env.DATABASE_URL;

// Create db connection
let db: ReturnType<typeof drizzleSqlite> | ReturnType<typeof drizzlePg>;

if (usePostgres) {
  console.log("📊 Seeding Postgres database...");
  const sql = neon(process.env.DATABASE_URL!);
  db = drizzlePg(sql, { schema: pgSchema });
} else {
  console.log("📊 Seeding SQLite database...");
  const dbPath = process.env.SQLITE_PATH || "./data/local.db";
  
  // Ensure data directory exists
  const dir = path.dirname(dbPath);
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
  
  const sqlite = new Database(dbPath);
  sqlite.pragma("journal_mode = WAL");
  db = drizzleSqlite(sqlite, { schema: sqliteSchema });
}

// Use the appropriate schema
const schema = usePostgres ? pgSchema : sqliteSchema;
const { jobs, jobSources, companies, savedSearches } = schema;

// ============================================
// Seed Data
// ============================================

const companyData = [
  { name: "Anthropic", domain: "anthropic.com", industry: "AI/ML", size: "medium", employeeCount: 800 },
  { name: "OpenAI", domain: "openai.com", industry: "AI/ML", size: "medium", employeeCount: 1500 },
  { name: "Stripe", domain: "stripe.com", industry: "Fintech", size: "large", employeeCount: 8000 },
  { name: "Notion", domain: "notion.so", industry: "Productivity", size: "medium", employeeCount: 500 },
  { name: "Linear", domain: "linear.app", industry: "DevTools", size: "startup", employeeCount: 80 },
  { name: "Vercel", domain: "vercel.com", industry: "DevTools", size: "medium", employeeCount: 400 },
  { name: "Figma", domain: "figma.com", industry: "Design", size: "large", employeeCount: 1200 },
  { name: "Retool", domain: "retool.com", industry: "DevTools", size: "medium", employeeCount: 350 },
  { name: "Rippling", domain: "rippling.com", industry: "HR Tech", size: "large", employeeCount: 2500 },
  { name: "Ramp", domain: "ramp.com", industry: "Fintech", size: "medium", employeeCount: 800 },
  { name: "Scale AI", domain: "scale.com", industry: "AI/ML", size: "medium", employeeCount: 700 },
  { name: "Anduril", domain: "anduril.com", industry: "Defense Tech", size: "large", employeeCount: 2000 },
  { name: "Databricks", domain: "databricks.com", industry: "Data/AI", size: "large", employeeCount: 6000 },
  { name: "Airtable", domain: "airtable.com", industry: "Productivity", size: "medium", employeeCount: 900 },
  { name: "Plaid", domain: "plaid.com", industry: "Fintech", size: "large", employeeCount: 1000 },
  { name: "Faire", domain: "faire.com", industry: "Marketplace", size: "large", employeeCount: 1200 },
  { name: "Brex", domain: "brex.com", industry: "Fintech", size: "large", employeeCount: 1100 },
  { name: "Webflow", domain: "webflow.com", industry: "Design", size: "medium", employeeCount: 600 },
  { name: "Mercury", domain: "mercury.com", industry: "Fintech", size: "medium", employeeCount: 500 },
  { name: "PostHog", domain: "posthog.com", industry: "Analytics", size: "startup", employeeCount: 70 },
];

const jobTitles = [
  { title: "Senior Software Engineer", level: "senior", dept: "engineering" },
  { title: "Staff Engineer", level: "staff", dept: "engineering" },
  { title: "Principal Engineer", level: "principal", dept: "engineering" },
  { title: "Engineering Manager", level: "manager", dept: "engineering" },
  { title: "Frontend Engineer", level: "mid", dept: "engineering" },
  { title: "Backend Engineer", level: "mid", dept: "engineering" },
  { title: "Full Stack Engineer", level: "mid", dept: "engineering" },
  { title: "Machine Learning Engineer", level: "senior", dept: "ml" },
  { title: "Data Scientist", level: "mid", dept: "data" },
  { title: "Product Manager", level: "mid", dept: "product" },
  { title: "Senior Product Manager", level: "senior", dept: "product" },
  { title: "Product Designer", level: "mid", dept: "design" },
  { title: "Senior Product Designer", level: "senior", dept: "design" },
  { title: "Head of People", level: "executive", dept: "people" },
  { title: "Director of Engineering", level: "director", dept: "engineering" },
  { title: "VP of Engineering", level: "executive", dept: "engineering" },
  { title: "Chief of Staff", level: "executive", dept: "operations" },
  { title: "Technical Recruiter", level: "mid", dept: "people" },
  { title: "DevOps Engineer", level: "senior", dept: "infrastructure" },
  { title: "Site Reliability Engineer", level: "senior", dept: "infrastructure" },
];

const locations = [
  { city: "San Francisco, CA", remote: false },
  { city: "New York, NY", remote: false },
  { city: "Seattle, WA", remote: false },
  { city: "Austin, TX", remote: false },
  { city: "Los Angeles, CA", remote: false },
  { city: "Remote (US)", remote: true },
  { city: "San Francisco, CA (Hybrid)", remote: false },
  { city: "New York, NY (Hybrid)", remote: false },
];

const salaryByLevel: Record<string, { min: number; max: number }> = {
  mid: { min: 120000, max: 180000 },
  senior: { min: 180000, max: 280000 },
  staff: { min: 250000, max: 400000 },
  principal: { min: 350000, max: 500000 },
  manager: { min: 200000, max: 350000 },
  director: { min: 280000, max: 450000 },
  executive: { min: 350000, max: 600000 },
};

const skillsByDept: Record<string, string[]> = {
  engineering: ["TypeScript", "React", "Node.js", "PostgreSQL", "AWS", "Docker", "Kubernetes", "GraphQL", "Go", "Python"],
  ml: ["Python", "PyTorch", "TensorFlow", "LLMs", "RAG", "Vector Databases", "CUDA", "Transformers", "MLOps"],
  data: ["Python", "SQL", "Spark", "dbt", "Snowflake", "Looker", "Statistics", "A/B Testing"],
  product: ["Roadmapping", "User Research", "Analytics", "SQL", "Figma", "Agile", "Stakeholder Management"],
  design: ["Figma", "Design Systems", "Prototyping", "User Research", "Accessibility", "Motion Design"],
  people: ["Recruiting", "HRIS", "Compensation", "Culture", "DEI", "Performance Management"],
  infrastructure: ["AWS", "GCP", "Terraform", "Kubernetes", "CI/CD", "Observability", "Linux"],
  operations: ["Strategy", "Cross-functional Leadership", "Analytics", "Process Improvement"],
};

const sourceNames = ["linkedin", "greenhouse", "lever", "indeed", "builtin", "wellfound"];

// Helpers
function randomFrom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomDate(daysBack: number): Date {
  const now = new Date();
  const daysAgo = randomInt(0, daysBack);
  return new Date(now.getTime() - daysAgo * 24 * 60 * 60 * 1000);
}

function generateExternalId(): string {
  return Math.random().toString(36).substring(2, 15);
}

function generateDescription(company: typeof companyData[0], job: typeof jobTitles[0]): string {
  return `
## About ${company.name}

${company.name} is a leading company in the ${company.industry} space, building products that matter. We're looking for exceptional people to join our team.

## About the Role

We're hiring a ${job.title} to join our ${job.dept} team. You'll work on challenging problems at scale, collaborating with talented colleagues to ship impactful work.

## What You'll Do

- Build and maintain high-quality software systems
- Collaborate with cross-functional teams
- Mentor other engineers and contribute to engineering culture
- Drive technical decisions and architecture

## What We're Looking For

- Strong problem-solving skills
- Experience with relevant technologies
- Excellent communication skills
- Passion for building great products

## Benefits

- Competitive salary and equity
- Health, dental, and vision insurance
- Flexible PTO
- Remote-friendly culture
- Learning and development budget
`.trim();
}

// Main seed function
async function seed() {
  console.log("\n🌱 Starting seed...\n");

  // 1. Seed job sources
  console.log("📡 Creating job sources...");
  const sourcesToInsert = sourceNames.map(name => ({
    name,
    type: name === "greenhouse" || name === "lever" ? "api" : "scrape",
    baseUrl: `https://${name}.com`,
    isActive: true,
    jobCount: 0,
  }));

  // Insert sources (SQLite compatible)
  for (const source of sourcesToInsert) {
    try {
      await (db as any).insert(jobSources).values(source).onConflictDoNothing();
    } catch (e) {
      // Ignore duplicate errors
    }
  }
  console.log(`   ✓ ${sourcesToInsert.length} sources`);

  // 2. Seed companies
  console.log("🏢 Creating companies...");
  for (const company of companyData) {
    try {
      await (db as any).insert(companies).values(company).onConflictDoNothing();
    } catch (e) {
      // Ignore duplicate errors
    }
  }
  console.log(`   ✓ ${companyData.length} companies`);

  // 3. Seed jobs
  console.log("💼 Creating jobs...");
  const jobsToInsert = [];

  for (let i = 0; i < 200; i++) {
    const company = randomFrom(companyData);
    const jobInfo = randomFrom(jobTitles);
    const location = randomFrom(locations);
    const source = randomFrom(sourceNames);
    const salary = salaryByLevel[jobInfo.level];
    const skills = skillsByDept[jobInfo.dept] || [];

    const salaryMin = salary.min + randomInt(-20000, 20000);
    const salaryMax = salary.max + randomInt(-20000, 40000);

    jobsToInsert.push({
      externalId: generateExternalId(),
      source,
      title: jobInfo.title,
      company: company.name,
      location: location.city,
      salary: `$${Math.round(salaryMin / 1000)}k - $${Math.round(salaryMax / 1000)}k`,
      salaryMin,
      salaryMax,
      description: generateDescription(company, jobInfo),
      url: `https://${company.domain}/careers/${generateExternalId()}`,
      postedAt: randomDate(30),
      isRemote: location.remote,
      isHybrid: location.city.includes("Hybrid"),
      jobType: "full-time",
      experienceLevel: jobInfo.level,
      department: jobInfo.dept,
      skills: skills.slice(0, randomInt(3, 7)),
      raw: {
        companyDomain: company.domain,
        industry: company.industry,
        employeeCount: company.employeeCount,
        department: jobInfo.dept,
      },
    });
  }

  // Insert jobs in batches
  const batchSize = 50;
  let inserted = 0;

  for (let i = 0; i < jobsToInsert.length; i += batchSize) {
    const batch = jobsToInsert.slice(i, i + batchSize);
    await (db as any).insert(jobs).values(batch);
    inserted += batch.length;
    console.log(`   ${inserted}/${jobsToInsert.length} jobs...`);
  }

  // 4. Create sample saved searches
  console.log("🔔 Creating saved searches...");
  const searchesToInsert = [
    { name: "Senior Engineer at AI", query: "Senior Engineer AI", isActive: true, frequency: "daily" },
    { name: "Remote Staff+", query: "Staff Engineer Remote", isActive: true, frequency: "daily" },
    { name: "Product Manager Fintech", query: "Product Manager Fintech", isActive: false, frequency: "weekly" },
  ];

  for (const search of searchesToInsert) {
    try {
      await (db as any).insert(savedSearches).values(search);
    } catch (e) {
      // Ignore errors
    }
  }
  console.log(`   ✓ ${searchesToInsert.length} saved searches`);

  console.log("\n✅ Seed complete!");
  console.log(`   - ${jobsToInsert.length} jobs`);
  console.log(`   - ${companyData.length} companies`);
  console.log(`   - ${sourcesToInsert.length} sources`);
  console.log(`   - ${searchesToInsert.length} saved searches`);
}

seed().catch(console.error);
