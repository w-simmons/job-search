import { db, jobs } from "@/lib/db";
import { desc, count } from "drizzle-orm";
import Link from "next/link";

async function getJobsWithStats() {
  const [totalCount] = await db.select({ count: count() }).from(jobs);
  const recentJobs = await db
    .select()
    .from(jobs)
    .orderBy(desc(jobs.scrapedAt))
    .limit(50);
  
  return { totalCount: totalCount?.count || 0, recentJobs };
}

async function getJobsBySource() {
  return db
    .select({
      source: jobs.source,
      count: count(),
    })
    .from(jobs)
    .groupBy(jobs.source)
    .orderBy(desc(count()));
}

export default async function AdminJobsPage() {
  const [{ totalCount, recentJobs }, sourceStats] = await Promise.all([
    getJobsWithStats(),
    getJobsBySource(),
  ]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Manage Jobs 📝</h2>
          <p className="text-gray-600">
            {totalCount.toLocaleString()} total jobs in database
          </p>
        </div>
        <div className="flex gap-2">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50">
            Export CSV
          </button>
          <button className="px-4 py-2 bg-red-100 text-red-700 rounded-lg hover:bg-red-200">
            🗑️ Clean Duplicates
          </button>
        </div>
      </div>

      {/* Source breakdown */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Jobs by Source</h3>
        <div className="flex flex-wrap gap-3">
          {sourceStats.map((stat) => (
            <div
              key={stat.source}
              className="px-3 py-2 bg-gray-50 rounded-lg text-sm"
            >
              <span className="font-medium">{stat.source}</span>
              <span className="ml-2 text-gray-500">{stat.count}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Bulk Actions */}
      <div className="bg-white rounded-lg border p-4">
        <h3 className="font-semibold text-gray-800 mb-3">Bulk Actions</h3>
        <div className="flex flex-wrap gap-3">
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
            ✏️ Re-extract skills
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
            🏢 Normalize companies
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
            📍 Geocode locations
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
            🧮 Generate embeddings
          </button>
          <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 text-sm">
            🗑️ Remove expired
          </button>
        </div>
      </div>

      {/* Job List */}
      <div className="bg-white rounded-lg border overflow-hidden">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Recent Jobs</h3>
          <input
            type="text"
            placeholder="Search jobs..."
            className="px-3 py-1.5 border rounded text-sm w-64"
          />
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead className="bg-gray-50 text-gray-600">
              <tr>
                <th className="text-left p-3">
                  <input type="checkbox" className="rounded" />
                </th>
                <th className="text-left p-3">Title</th>
                <th className="text-left p-3">Company</th>
                <th className="text-left p-3">Source</th>
                <th className="text-left p-3">Scraped</th>
                <th className="text-left p-3">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {recentJobs.map((job) => (
                <tr key={job.id} className="hover:bg-gray-50">
                  <td className="p-3">
                    <input type="checkbox" className="rounded" />
                  </td>
                  <td className="p-3">
                    <Link
                      href={`/jobs/${job.id}`}
                      className="text-blue-600 hover:underline"
                    >
                      {job.title.slice(0, 40)}
                      {job.title.length > 40 ? "..." : ""}
                    </Link>
                  </td>
                  <td className="p-3">{job.company}</td>
                  <td className="p-3">
                    <span className="px-2 py-0.5 bg-gray-100 rounded text-xs">
                      {job.source}
                    </span>
                  </td>
                  <td className="p-3 text-gray-500">
                    {job.scrapedAt
                      ? new Date(job.scrapedAt).toLocaleDateString()
                      : "—"}
                  </td>
                  <td className="p-3">
                    <button className="text-gray-400 hover:text-red-600">
                      🗑️
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        {recentJobs.length === 0 && (
          <div className="p-8 text-center text-gray-500">No jobs yet.</div>
        )}
      </div>
    </div>
  );
}
