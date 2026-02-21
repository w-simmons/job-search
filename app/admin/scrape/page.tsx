import { db, jobSources } from "@/lib/db";
import { eq } from "drizzle-orm";
import { ScrapeControls } from "@/components/admin";

async function getActiveSources() {
  return db
    .select({ id: jobSources.id, name: jobSources.name })
    .from(jobSources)
    .where(eq(jobSources.isActive, true));
}

export default async function ScrapePage() {
  const sources = await getActiveSources();

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-xl font-bold text-gray-800">Scrape Tools 🔄</h2>
        <p className="text-gray-600">
          Manually trigger job scraping and monitor progress.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Scrape Controls */}
        <ScrapeControls
          sources={sources}
          onScrape={async () => {
            "use server";
            // TODO: Implement scrape action
          }}
        />

        {/* Recent Activity */}
        <div className="bg-white rounded-lg border p-6">
          <h3 className="font-semibold text-gray-800 mb-4">Recent Scrapes</h3>
          <div className="space-y-3 text-sm">
            <div className="p-3 bg-gray-50 rounded">
              <div className="flex justify-between items-start">
                <div>
                  <p className="font-medium">All Sources</p>
                  <p className="text-gray-500">Full sync</p>
                </div>
                <span className="px-2 py-0.5 bg-gray-200 text-gray-600 rounded text-xs">
                  No runs yet
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Scrape Schedule */}
      <div className="bg-white rounded-lg border p-6">
        <h3 className="font-semibold text-gray-800 mb-4">Scrape Schedule</h3>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">Incremental Sync</p>
            <p className="text-gray-600 mt-1">Every 4 hours</p>
            <p className="text-gray-500 mt-2">Next run: —</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">Full Resync</p>
            <p className="text-gray-600 mt-1">Daily at 3 AM</p>
            <p className="text-gray-500 mt-2">Next run: —</p>
          </div>
          <div className="p-4 bg-gray-50 rounded-lg">
            <p className="font-medium">Cleanup</p>
            <p className="text-gray-600 mt-1">Weekly</p>
            <p className="text-gray-500 mt-2">Removes expired jobs</p>
          </div>
        </div>
      </div>

      {/* Scrape Log */}
      <div className="bg-white rounded-lg border">
        <div className="p-4 border-b flex items-center justify-between">
          <h3 className="font-semibold text-gray-800">Scrape Log</h3>
          <button className="text-sm text-gray-500 hover:text-gray-700">
            Clear Log
          </button>
        </div>
        <div className="p-4 font-mono text-sm bg-gray-900 text-green-400 rounded-b-lg h-64 overflow-auto">
          <p className="text-gray-500">No scrape logs yet.</p>
          <p className="text-gray-500">Run a scrape to see output here.</p>
        </div>
      </div>
    </div>
  );
}
