import { db, jobs, jobInteractions, savedSearches, jobSources, count, desc, eq, sql, type Job } from "@/lib/db";
import { StatsCard } from "@/components/admin";
import { JobCard } from "@/components/jobs";
import Link from "next/link";

async function getStats() {
  // These queries work with both SQLite and Postgres
  const [jobCount] = await db.select({ count: count() }).from(jobs);
  const [savedCount] = await db.select({ count: count() }).from(savedSearches);
  const [sourceCount] = await db.select({ count: count() }).from(jobSources);
  const [interactionCount] = await db.select({ count: count() })
    .from(jobInteractions)
    .where(eq(jobInteractions.action, "applied"));

  return {
    totalJobs: jobCount?.count || 0,
    savedSearches: savedCount?.count || 0,
    activeSources: sourceCount?.count || 0,
    applications: interactionCount?.count || 0,
  };
}

async function getRecentJobs() {
  return db.select().from(jobs).orderBy(desc(jobs.scrapedAt)).limit(5);
}

async function getPipelineJobs() {
  const result = await db
    .select()
    .from(jobInteractions)
    .where(sql`${jobInteractions.pipelineStage} IS NOT NULL`)
    .limit(10);
  return result.length;
}

export default async function DashboardPage() {
  const [stats, recentJobs, pipelineCount] = await Promise.all([
    getStats(),
    getRecentJobs(),
    getPipelineJobs(),
  ]);

  return (
    <div className="space-y-6">
      {/* Welcome */}
      <div>
        <h2 className="text-2xl font-bold text-gray-800">Welcome back! 👋</h2>
        <p className="text-gray-600 mt-1">
          Here&apos;s what&apos;s happening with your job search.
        </p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard
          title="Total Jobs"
          value={stats.totalJobs}
          icon="💼"
        />
        <StatsCard
          title="In Pipeline"
          value={pipelineCount}
          icon="📋"
        />
        <StatsCard
          title="Applications"
          value={stats.applications}
          icon="📝"
        />
        <StatsCard
          title="Saved Searches"
          value={stats.savedSearches}
          icon="🔔"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/jobs"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            🔍 Browse Jobs
          </Link>
          <Link
            href="/discover"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            ✨ New Matches
          </Link>
          <Link
            href="/pipeline"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            📋 View Pipeline
          </Link>
          <Link
            href="/searches"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors"
          >
            ➕ New Search
          </Link>
        </div>
      </div>

      {/* Recent Jobs */}
      <div>
        <div className="flex justify-between items-center mb-4">
          <h3 className="font-semibold text-gray-800">Recently Added Jobs</h3>
          <Link href="/jobs" className="text-sm text-blue-600 hover:underline">
            View all →
          </Link>
        </div>
        <div className="space-y-3">
          {recentJobs.length > 0 ? (
            recentJobs.map((job: Job) => (
              <JobCard key={job.id} job={job} showActions={false} />
            ))
          ) : (
            <div className="text-center py-8 text-gray-500 bg-white rounded-lg border">
              <p className="text-4xl mb-2">📭</p>
              <p>No jobs yet. Run a scrape to get started!</p>
              <Link
                href="/admin/scrape"
                className="mt-2 inline-block text-blue-600 hover:underline"
              >
                Go to Scrape Tools →
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
