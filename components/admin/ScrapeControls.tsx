"use client";

import { useState } from "react";

interface ScrapeControlsProps {
  sources: { id: number; name: string }[];
  onScrape: (sourceId: number | null, options: ScrapeOptions) => void;
}

interface ScrapeOptions {
  fullResync: boolean;
  limit?: number;
}

export function ScrapeControls({ sources, onScrape }: ScrapeControlsProps) {
  const [selectedSource, setSelectedSource] = useState<number | null>(null);
  const [fullResync, setFullResync] = useState(false);
  const [limit, setLimit] = useState("");
  const [isRunning, setIsRunning] = useState(false);

  const handleScrape = async () => {
    setIsRunning(true);
    try {
      await onScrape(selectedSource, {
        fullResync,
        limit: limit ? Number(limit) : undefined,
      });
    } finally {
      setIsRunning(false);
    }
  };

  return (
    <div className="bg-white rounded-lg border p-6">
      <h3 className="font-semibold text-gray-800 mb-4">Manual Scrape</h3>

      <div className="space-y-4">
        {/* Source Selection */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Source</label>
          <select
            value={selectedSource ?? ""}
            onChange={(e) => setSelectedSource(e.target.value ? Number(e.target.value) : null)}
            className="w-full px-3 py-2 border rounded-lg"
          >
            <option value="">All Sources</option>
            {sources.map((source) => (
              <option key={source.id} value={source.id}>
                {source.name}
              </option>
            ))}
          </select>
        </div>

        {/* Limit */}
        <div>
          <label className="block text-sm text-gray-600 mb-1">Job Limit (optional)</label>
          <input
            type="number"
            value={limit}
            onChange={(e) => setLimit(e.target.value)}
            placeholder="e.g. 100"
            className="w-full px-3 py-2 border rounded-lg"
          />
        </div>

        {/* Full Resync */}
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={fullResync}
            onChange={(e) => setFullResync(e.target.checked)}
            className="rounded"
          />
          <span className="text-sm">Full resync (ignore last sync timestamp)</span>
        </label>

        {/* Run Button */}
        <button
          onClick={handleScrape}
          disabled={isRunning}
          className={`w-full py-3 rounded-lg font-medium transition-colors ${
            isRunning
              ? "bg-gray-300 text-gray-500 cursor-not-allowed"
              : "bg-blue-600 text-white hover:bg-blue-700"
          }`}
        >
          {isRunning ? "Running..." : "Start Scrape"}
        </button>
      </div>
    </div>
  );
}
