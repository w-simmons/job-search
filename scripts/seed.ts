/**
 * Seed script - Populates database with realistic dummy job data
 * Run: npx tsx scripts/seed.ts
 */

import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import { jobs } from "../lib/db/schema";

const DATABASE_URL = process.env.DATABASE_URL;
if (!DATABASE_URL) {
  console.error("DATABASE_URL not set");
  process.exit(1);
}

const sql = neon(DATABASE_URL);
const db = drizzle(sql);

// Realistic company data
const companies = [
  { name: "Anthropic", domain: "anthropic.com", industry: "AI/ML", employees: 800 },
  { name: "OpenAI", domain: "openai.com", industry: "AI/ML", employees: 1500 },
  { name: "Stripe", domain: "stripe.com", industry: "Fintech", employees: 8000 },
  { name: "Notion", domain: "notion.so", industry: "Productivity", employees: 500 },
  { name: "Linear", domain: "linear.app", industry: "DevTools", employees: 80 },
  { name: "Vercel", domain: "vercel.com", industry: "DevTools", employees: 400 },
  { name: "Figma", domain: "figma.com", industry: "Design", employees: 1200 },
  { name: "Retool", domain: "retool.com", industry: "DevTools", employees: 350 },
  { name: "Rippling", domain: "rippling.com", industry: "HR Tech", employees: 2500 },
  { name: "Ramp", domain: "ramp.com", industry: "Fintech", employees: 800 },
  { name: "Scale AI", domain: "scale.com", industry: "AI/ML", employees: 700 },
  { name: "Anduril", domain: "anduril.com", industry: "Defense Tech", employees: 2000 },
  { name: "Databricks", domain: "databricks.com", industry: "Data/AI", employees: 6000 },
  { name: "Airtable", domain: "airtable.com", industry: "Productivity", employees: 900 },
  { name: "Plaid", domain: "plaid.com", industry: "Fintech", employees: 1000 },
  { name: "Faire", domain: "faire.com", industry: "Marketplace", employees: 1200 },
  { name: "Brex", domain: "brex.com", industry: "Fintech", employees: 1100 },
  { name: "Webflow", domain: "webflow.com", industry: "Design", employees: 600 },
  { name: "Mercury", domain: "mercury.com", industry: "Fintech", employees: 500 },
  { name: "PostHog", domain: "posthog.com", industry: "Analytics", employees: 70 },
];

// Job title templates
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

// Locations
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

// Salary ranges by level
const salaryByLevel: Record<string, { min: number; max: number }> = {
  mid: { min: 120000, max: 180000 },
  senior: { min: 180000, max: 280000 },
  staff: { min: 250000, max: 400000 },
  principal: { min: 350000, max: 500000 },
  manager: { min: 200000, max: 350000 },
  director: { min: 280000, max: 450000 },
  executive: { min: 350000, max: 600000 },
};

// Skills by department
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

// Job sources
const sources = ["linkedin", "greenhouse", "lever", "indeed", "builtin", "wellfound"];

// Generate job description
function generateDescription(company: typeof companies[0], job: typeof jobTitles[0]): string {
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

// Random helpers
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

// Main seed function
async function seed() {
  console.log("🌱 Seeding database with dummy job data...\n");

  const jobsToInsert = [];

  // Generate ~200 jobs
  for (let i = 0; i < 200; i++) {
    const company = randomFrom(companies);
    const jobInfo = randomFrom(jobTitles);
    const location = randomFrom(locations);
    const source = randomFrom(sources);
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
      jobType: "full-time",
      experienceLevel: jobInfo.level,
      skills: skills.slice(0, randomInt(3, 7)),
      raw: {
        companyDomain: company.domain,
        industry: company.industry,
        employeeCount: company.employees,
        department: jobInfo.dept,
      },
    });
  }

  // Insert in batches
  const batchSize = 50;
  let inserted = 0;

  for (let i = 0; i < jobsToInsert.length; i += batchSize) {
    const batch = jobsToInsert.slice(i, i + batchSize);
    await db.insert(jobs).values(batch);
    inserted += batch.length;
    console.log(`  Inserted ${inserted}/${jobsToInsert.length} jobs...`);
  }

  console.log("\n✅ Seeding complete!");
  console.log(`   - ${jobsToInsert.length} jobs created`);
  console.log(`   - ${companies.length} companies represented`);
  console.log(`   - ${sources.length} sources used`);
}

seed().catch(console.error);
