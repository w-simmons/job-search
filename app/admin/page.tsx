export const dynamic = "force-dynamic";
import { db, jobs, jobSources, companies } from "@/lib/db";
import { count, eq, desc, sql } from "drizzle-orm";
import { StatsCard } from "@/components/admin";
import Link from "next/link";

async function getAdminStats() {
  const [jobCount] = await db.select({ count: count() }).from(jobs);
  const [sourceCount] = await db.select({ count: count() }).from(jobSources);
  const [companyCount] = await db.select({ count: count() }).from(companies);
  const [activeSourceCount] = await db
    .select({ count: count() })
    .from(jobSources)
    .where(eq(jobSources.isActive, true));

  return {
    totalJobs: jobCount?.count || 0,
    totalSources: sourceCount?.count || 0,
    activeSources: activeSourceCount?.count || 0,
    totalCompanies: companyCount?.count || 0,
  };
}

async function getRecentSources() {
  return db
    .select()
    .from(jobSources)
    .orderBy(desc(jobSources.lastSyncAt))
    .limit(5);
}

async function getTopCompanies() {
  // Get companies with most jobs (simplified query)
  const jobsByCompany = await db
    .select({
      company: jobs.company,
      count: count(),
    })
    .from(jobs)
    .groupBy(jobs.company)
    .orderBy(desc(count()))
    .limit(10);

  return jobsByCompany;
}

export default async function AdminPage() {
  const [stats, recentSources, topCompanies] = await Promise.all([
    getAdminStats(),
    getRecentSources(),
    getTopCompanies(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Admin Dashboard 🔧</h2>
        <p className="text-gray-600">System overview and quick actions.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <StatsCard title="Total Jobs" value={stats.totalJobs} icon="💼" />
        <StatsCard title="Companies" value={stats.totalCompanies} icon="🏢" />
        <StatsCard title="Job Sources" value={stats.totalSources} icon="🌐" />
        <StatsCard
          title="Active Sources"
          value={`${stats.activeSources}/${stats.totalSources}`}
          icon="✅"
        />
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Quick Actions</h3>
        <div className="flex flex-wrap gap-3">
          <Link
            href="/admin/scrape"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
          >
            🔄 Run Scrape
          </Link>
          <Link
            href="/admin/sources"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            🌐 Manage Sources
          </Link>
          <Link
            href="/admin/companies"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            🏢 Normalize Companies
          </Link>
          <Link
            href="/admin/jobs"
            className="px-4 py-2 border rounded-lg hover:bg-gray-50"
          >
            📝 Bulk Edit Jobs
          </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Source Activity */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Source Activity</h3>
            <Link href="/admin/sources" className="text-sm text-blue-600 hover:underline">
              View all →
            </Link>
          </div>
          {recentSources.length > 0 ? (
            <div className="space-y-3">
              {recentSources.map((source) => (
                <div key={source.id} className="flex items-center justify-between text-sm">
                  <div className="flex items-center gap-2">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        source.isActive ? "bg-green-500" : "bg-gray-400"
                      }`}
                    />
                    <span className="font-medium">{source.name}</span>
                  </div>
                  <div className="text-gray-500">
                    {source.jobCount} jobs
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No sources configured.</p>
          )}
        </div>

        {/* Top Companies */}
        <div className="bg-white rounded-lg border p-6">
          <div className="flex justify-between items-center mb-4">
            <h3 className="font-semibold text-gray-800">Top Companies</h3>
            <Link href="/admin/companies" className="text-sm text-blue-600 hover:underline">
              View all →
            </Link>
          </div>
          {topCompanies.length > 0 ? (
            <div className="space-y-2">
              {topCompanies.map((company, i) => (
                <div key={i} className="flex items-center justify-between text-sm">
                  <span>{company.company}</span>
                  <span className="text-gray-500">{company.count} jobs</span>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-gray-500 text-sm">No jobs yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
