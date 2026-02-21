import type { JobSource } from "@/lib/db/schema";

interface SourceStatusProps {
  source: JobSource;
  onSync?: (id: number) => void;
  onToggle?: (id: number) => void;
}

export function SourceStatus({ source, onSync, onToggle }: SourceStatusProps) {
  const lastSync = source.lastSyncAt 
    ? new Date(source.lastSyncAt).toLocaleString()
    : "Never";

  const isHealthy = source.lastSuccessAt && 
    (!source.lastErrorAt || source.lastSuccessAt > source.lastErrorAt);

  return (
    <div className="bg-white rounded-lg border p-4">
      <div className="flex justify-between items-start">
        <div className="flex items-center gap-3">
          <div 
            className={`w-3 h-3 rounded-full ${
              !source.isActive 
                ? "bg-gray-400" 
                : isHealthy 
                  ? "bg-green-500" 
                  : "bg-red-500"
            }`} 
          />
          <div>
            <h3 className="font-semibold text-gray-800">{source.name}</h3>
            <p className="text-sm text-gray-500">{source.type}</p>
          </div>
        </div>
        
        <div className="flex gap-2">
          <button
            onClick={() => onSync?.(source.id)}
            className="px-3 py-1 text-sm bg-blue-100 text-blue-700 rounded hover:bg-blue-200 transition-colors"
            disabled={!source.isActive}
          >
            Sync Now
          </button>
          <button
            onClick={() => onToggle?.(source.id)}
            className={`px-3 py-1 text-sm rounded transition-colors ${
              source.isActive
                ? "bg-gray-100 text-gray-700 hover:bg-gray-200"
                : "bg-green-100 text-green-700 hover:bg-green-200"
            }`}
          >
            {source.isActive ? "Disable" : "Enable"}
          </button>
        </div>
      </div>

      <div className="mt-4 grid grid-cols-3 gap-4 text-sm">
        <div>
          <p className="text-gray-500">Jobs</p>
          <p className="font-semibold">{source.jobCount?.toLocaleString() || 0}</p>
        </div>
        <div>
          <p className="text-gray-500">Last Sync</p>
          <p className="font-semibold">{lastSync}</p>
        </div>
        <div>
          <p className="text-gray-500">Avg Duration</p>
          <p className="font-semibold">
            {source.avgSyncDurationMs ? `${(source.avgSyncDurationMs / 1000).toFixed(1)}s` : "—"}
          </p>
        </div>
      </div>

      {source.lastError && (
        <div className="mt-3 p-2 bg-red-50 border border-red-200 rounded text-sm text-red-700">
          <strong>Last Error:</strong> {source.lastError}
        </div>
      )}
    </div>
  );
}
