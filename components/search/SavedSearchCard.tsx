import Link from "next/link";
import type { SavedSearch } from "@/lib/db/schema";

interface SavedSearchCardProps {
  search: SavedSearch;
  onToggle?: (id: number) => void;
  onDelete?: (id: number) => void;
  onRun?: (id: number) => void;
}

export function SavedSearchCard({ search, onToggle, onDelete, onRun }: SavedSearchCardProps) {
  const lastRun = search.lastRunAt 
    ? new Date(search.lastRunAt).toLocaleDateString()
    : "Never";

  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <div className="flex items-center gap-2">
            <h3 className="font-semibold text-gray-800">{search.name}</h3>
            {search.newJobCount && search.newJobCount > 0 && (
              <span className="px-2 py-0.5 bg-red-500 text-white text-xs rounded-full">
                {search.newJobCount} new
              </span>
            )}
          </div>
          <p className="text-sm text-gray-600 mt-1">
            "{search.query}"
          </p>
        </div>
        
        <div className="flex items-center gap-1">
          <button
            onClick={() => onToggle?.(search.id)}
            className={`p-2 rounded transition-colors ${
              search.isActive 
                ? "text-green-600 hover:bg-green-50" 
                : "text-gray-400 hover:bg-gray-50"
            }`}
            title={search.isActive ? "Pause alerts" : "Resume alerts"}
          >
            {search.isActive ? "🔔" : "🔕"}
          </button>
          <button
            onClick={() => onRun?.(search.id)}
            className="p-2 text-blue-600 hover:bg-blue-50 rounded transition-colors"
            title="Run now"
          >
            ▶️
          </button>
          <button
            onClick={() => onDelete?.(search.id)}
            className="p-2 text-gray-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors"
            title="Delete search"
          >
            🗑️
          </button>
        </div>
      </div>

      <div className="mt-3 flex items-center gap-4 text-sm text-gray-500">
        <span>Frequency: {search.frequency}</span>
        <span>•</span>
        <span>Last run: {lastRun}</span>
      </div>

      <Link
        href={`/discover?search=${search.id}`}
        className="mt-3 inline-block text-sm text-blue-600 hover:underline"
      >
        View results →
      </Link>
    </div>
  );
}
