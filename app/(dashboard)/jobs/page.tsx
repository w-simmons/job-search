import { db, jobs } from "@/lib/db";
import { desc, like, and, eq, gte, or } from "drizzle-orm";
import { JobList } from "@/components/jobs";
import { JobFiltersClient } from "./filters-client";

interface JobsPageProps {
  searchParams: Promise<{
    q?: string;
    location?: string;
    remote?: string;
    salary?: string;
    level?: string;
    type?: string;
    company?: string;
    sort?: string;
    page?: string;
  }>;
}

async function getJobs(params: Awaited<JobsPageProps["searchParams"]>) {
  const conditions = [];

  if (params.q) {
    const q = `%${params.q}%`;
    conditions.push(
      or(
        like(jobs.title, q),
        like(jobs.company, q),
        like(jobs.description, q)
      )
    );
  }

  if (params.location) {
    conditions.push(like(jobs.location, `%${params.location}%`));
  }

  if (params.remote === "true") {
    conditions.push(eq(jobs.isRemote, true));
  }

  if (params.salary) {
    conditions.push(gte(jobs.salaryMin, Number(params.salary)));
  }

  if (params.level) {
    conditions.push(eq(jobs.experienceLevel, params.level));
  }

  if (params.type) {
    conditions.push(eq(jobs.jobType, params.type));
  }

  if (params.company) {
    conditions.push(like(jobs.company, `%${params.company}%`));
  }

  const query = db
    .select()
    .from(jobs)
    .where(conditions.length > 0 ? and(...conditions) : undefined)
    .limit(50);

  // Sort
  const sortField = params.sort || "recent";
  if (sortField === "salary_high") {
    query.orderBy(desc(jobs.salaryMax));
  } else if (sortField === "salary_low") {
    query.orderBy(jobs.salaryMin);
  } else {
    query.orderBy(desc(jobs.postedAt));
  }

  return query;
}

export default async function JobsPage({ searchParams }: JobsPageProps) {
  const params = await searchParams;
  const jobList = await getJobs(params);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">All Jobs</h2>
        <p className="text-gray-600">
          {jobList.length} jobs found
        </p>
      </div>

      <JobFiltersClient initialParams={params} />

      <JobList 
        jobs={jobList} 
        emptyMessage="No jobs match your filters. Try adjusting your search criteria."
      />
    </div>
  );
}
