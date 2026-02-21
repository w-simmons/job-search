export const dynamic = "force-dynamic";
import { db, savedSearches, desc, type SavedSearch } from "@/lib/db";
import { SavedSearchCard } from "@/components/search";
import Link from "next/link";

async function getSavedSearches() {
  return db.select().from(savedSearches).orderBy(desc(savedSearches.createdAt));
}

export default async function SearchesPage() {
  const searches = await getSavedSearches();

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Saved Searches 🔔</h2>
          <p className="text-gray-600">
            Manage your job alerts and saved search criteria.
          </p>
        </div>
        <button className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors">
          + New Search
        </button>
      </div>

      {searches.length > 0 ? (
        <div className="space-y-4">
          {searches.map((search: SavedSearch) => (
            <SavedSearchCard key={search.id} search={search} />
          ))}
        </div>
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border">
          <p className="text-4xl mb-4">🔔</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No saved searches yet
          </h3>
          <p className="text-gray-600 mb-4">
            Create a saved search to get notified when new matching jobs appear.
          </p>
          <div className="space-y-2">
            <p className="text-sm text-gray-500">
              Try creating a search like:
            </p>
            <div className="flex flex-wrap justify-center gap-2">
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                &quot;Senior Engineer at AI companies&quot;
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                &quot;Remote Product Manager $150k+&quot;
              </span>
              <span className="px-3 py-1 bg-gray-100 rounded-full text-sm">
                &quot;Staff+ roles in SF Bay Area&quot;
              </span>
            </div>
          </div>
        </div>
      )}

      {/* How it works */}
      <div className="bg-blue-50 rounded-lg p-6 border border-blue-100">
        <h3 className="font-semibold text-blue-800 mb-3">How Saved Searches Work</h3>
        <ul className="space-y-2 text-sm text-blue-700">
          <li>📝 Create a search with your criteria (title, location, salary, etc.)</li>
          <li>🔄 We automatically run your searches daily (or more often)</li>
          <li>✨ New matching jobs appear in your <Link href="/discover" className="underline">Discover</Link> tab</li>
          <li>🔔 Optionally get email or push notifications</li>
        </ul>
      </div>
    </div>
  );
}
