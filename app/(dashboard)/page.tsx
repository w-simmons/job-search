"use client";

import { useState } from "react";

interface Job {
  id: number;
  title: string;
  company: string;
  location: string | null;
  salary: string | null;
  isRemote: boolean;
  source: string;
  url: string;
  postedAt: string | null;
}

export default function DashboardPage() {
  const [query, setQuery] = useState("");
  const [jobs, setJobs] = useState<Job[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;

    setLoading(true);
    try {
      const res = await fetch(`/api/jobs?q=${encodeURIComponent(query)}`);
      const data = await res.json();
      setJobs(data.jobs || []);
    } catch (error) {
      console.error("Search failed:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Job Search</h1>
          <p className="text-gray-600 mt-1">
            Cross-source semantic job search for the US market
          </p>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 py-8">
        {/* Search Form */}
        <form onSubmit={handleSearch} className="mb-8">
          <div className="flex gap-4">
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Search jobs by title, company, or keywords..."
              className="flex-1 px-4 py-3 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <button
              type="submit"
              disabled={loading}
              className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50 font-medium"
            >
              {loading ? "Searching..." : "Search"}
            </button>
          </div>
        </form>

        {/* Filters (placeholder) */}
        <div className="flex gap-2 mb-6">
          <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
            Remote
          </span>
          <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
            Full-time
          </span>
          <span className="px-3 py-1 bg-gray-200 rounded-full text-sm">
            $100k+
          </span>
        </div>

        {/* Results */}
        {jobs.length > 0 ? (
          <div className="space-y-4">
            {jobs.map((job) => (
              <div
                key={job.id}
                className="bg-white p-6 rounded-lg shadow-sm border border-gray-200 hover:border-blue-300 transition-colors"
              >
                <div className="flex justify-between items-start">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900">
                      {job.title}
                    </h2>
                    <p className="text-gray-600 mt-1">{job.company}</p>
                    <div className="flex gap-4 mt-2 text-sm text-gray-500">
                      {job.location && <span>📍 {job.location}</span>}
                      {job.isRemote && (
                        <span className="text-green-600">🏠 Remote</span>
                      )}
                      {job.salary && <span>💰 {job.salary}</span>}
                    </div>
                  </div>
                  <div className="flex gap-2">
                    <span className="px-2 py-1 bg-gray-100 rounded text-xs text-gray-600">
                      {job.source}
                    </span>
                  </div>
                </div>
                <div className="mt-4 flex gap-3">
                  <a
                    href={job.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline text-sm"
                  >
                    View Original →
                  </a>
                  <button className="text-gray-600 hover:text-gray-900 text-sm">
                    Save
                  </button>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-12 text-gray-500">
            <p>Search for jobs to get started</p>
          </div>
        )}
      </main>
    </div>
  );
}
