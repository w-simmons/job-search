import { db, jobs, savedSearches, jobInteractions, desc, eq, notInArray, type SavedSearch } from "@/lib/db";
import { JobList } from "@/components/jobs";
import Link from "next/link";

interface DiscoverPageProps {
  searchParams: Promise<{ search?: string }>;
}

async function getDiscoverJobs(searchId?: number) {
  // Get IDs of jobs user has already interacted with (viewed/saved/hidden)
  const interactedJobIds = await db
    .select()
    .from(jobInteractions);
  
  const excludeIds = interactedJobIds.map((j: { jobId: number }) => j.jobId);

  // If a search is selected, apply its filters
  // For now, just return recent jobs not yet seen
  if (excludeIds.length > 0) {
    return db
      .select()
      .from(jobs)
      .where(notInArray(jobs.id, excludeIds))
      .orderBy(desc(jobs.postedAt))
      .limit(30);
  }

  return db
    .select()
    .from(jobs)
    .orderBy(desc(jobs.postedAt))
    .limit(30);
}

async function getSavedSearches() {
  return db.select().from(savedSearches).where(eq(savedSearches.isActive, true));
}

export default async function DiscoverPage({ searchParams }: DiscoverPageProps) {
  const params = await searchParams;
  const [discoverJobs, searches] = await Promise.all([
    getDiscoverJobs(params.search ? Number(params.search) : undefined),
    getSavedSearches(),
  ]);

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Discover New Jobs ✨</h2>
        <p className="text-gray-600">
          Fresh jobs you haven&apos;t seen yet, matched to your preferences.
        </p>
      </div>

      {/* Search Tabs */}
      {searches.length > 0 && (
        <div className="flex gap-2 overflow-x-auto pb-2">
          <Link
            href="/discover"
            className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
              !params.search
                ? "bg-blue-600 text-white"
                : "bg-gray-100 text-gray-700 hover:bg-gray-200"
            }`}
          >
            All New
          </Link>
          {searches.map((search: SavedSearch) => (
            <Link
              key={search.id}
              href={`/discover?search=${search.id}`}
              className={`px-4 py-2 rounded-full whitespace-nowrap transition-colors ${
                params.search === String(search.id)
                  ? "bg-blue-600 text-white"
                  : "bg-gray-100 text-gray-700 hover:bg-gray-200"
              }`}
            >
              {search.name}
              {search.newJobCount && search.newJobCount > 0 && (
                <span className="ml-2 px-1.5 py-0.5 bg-red-500 text-white text-xs rounded-full">
                  {search.newJobCount}
                </span>
              )}
            </Link>
          ))}
        </div>
      )}

      <JobList
        jobs={discoverJobs}
        emptyMessage="No new jobs to discover. Check back later or add more saved searches!"
      />
    </div>
  );
}
