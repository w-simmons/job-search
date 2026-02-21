import { db, jobSources } from "@/lib/db";
import { desc } from "drizzle-orm";
import { SourceStatus } from "@/components/admin";

async function getSources() {
  return db.select().from(jobSources).orderBy(desc(jobSources.lastSyncAt));
}

export default async function SourcesPage() {
  const sources = await getSources();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Job Sources 🌐</h2>
          <p className="text-gray-600">
            Configure and monitor your job data sources.
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
          + Add Source
        </button>
      </div>

      {sources.length > 0 ? (
        <div className="space-y-4">
          {sources.map((source) => (
            <SourceStatus key={source.id} source={source} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border">
          <p className="text-4xl mb-4">🌐</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No sources configured
          </h3>
          <p className="text-gray-600 mb-4">
            Add job sources to start scraping jobs.
          </p>
          <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">
            + Add Your First Source
          </button>
        </div>
      )}

      {/* Source Types Info */}
      <div className="bg-gray-50 rounded-lg border p-6">
        <h3 className="font-semibold text-gray-700 mb-3">Supported Source Types</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 text-sm">
          <div className="p-3 bg-white rounded border">
            <strong>API</strong>
            <p className="text-gray-600 mt-1">
              Direct API integrations (Greenhouse, Lever, etc.)
            </p>
          </div>
          <div className="p-3 bg-white rounded border">
            <strong>Scrape</strong>
            <p className="text-gray-600 mt-1">
              Web scraping from job boards
            </p>
          </div>
          <div className="p-3 bg-white rounded border">
            <strong>RSS</strong>
            <p className="text-gray-600 mt-1">
              RSS/Atom job feeds
            </p>
          </div>
          <div className="p-3 bg-white rounded border">
            <strong>Manual</strong>
            <p className="text-gray-600 mt-1">
              Manually added jobs
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
