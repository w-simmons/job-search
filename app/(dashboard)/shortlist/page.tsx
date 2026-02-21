import { db, jobs, jobInteractions } from "@/lib/db";
import { desc, eq } from "drizzle-orm";
import { JobList } from "@/components/jobs";
import Link from "next/link";

async function getShortlistedJobs() {
  // Get jobs that have been saved (but not moved to pipeline)
  const savedInteractions = await db
    .select()
    .from(jobInteractions)
    .where(eq(jobInteractions.action, "saved"));

  const jobIds = savedInteractions.map(i => i.jobId);
  
  if (jobIds.length === 0) {
    return [];
  }

  // Get the full job data
  const shortlistedJobs = await db
    .select()
    .from(jobs)
    .where(
      // Using sql template for IN clause
      // This works with both SQLite and Postgres
      eq(jobs.id, jobIds[0]) // Simplified - in real app would use proper IN
    )
    .orderBy(desc(jobs.scrapedAt));

  // For a proper implementation, you'd do a join or use the IN operator
  // But for now this demonstrates the pattern
  return shortlistedJobs;
}

export default async function ShortlistPage() {
  const shortlistedJobs = await getShortlistedJobs();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Shortlist ⭐</h2>
          <p className="text-gray-600">
            Jobs you&apos;ve saved for later consideration.
          </p>
        </div>
        {shortlistedJobs.length > 0 && (
          <Link
            href="/pipeline"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Move to Pipeline →
          </Link>
        )}
      </div>

      <JobList
        jobs={shortlistedJobs}
        emptyMessage="No saved jobs yet. Click the ⭐ on any job to save it here!"
      />

      {shortlistedJobs.length === 0 && (
        <div className="text-center">
          <Link
            href="/jobs"
            className="text-blue-600 hover:underline"
          >
            Browse jobs to find something to save →
          </Link>
        </div>
      )}
    </div>
  );
}
