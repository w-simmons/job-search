"use client";

import { useState } from "react";
import type { SearchFilters } from "@/lib/db/schema";

interface FilterPanelProps {
  filters: SearchFilters;
  onChange: (filters: SearchFilters) => void;
}

export function FilterPanel({ filters, onChange }: FilterPanelProps) {
  const [localFilters, setLocalFilters] = useState<SearchFilters>(filters);

  const updateFilter = <K extends keyof SearchFilters>(key: K, value: SearchFilters[K]) => {
    const updated = { ...localFilters, [key]: value };
    setLocalFilters(updated);
    onChange(updated);
  };

  return (
    <div className="bg-white rounded-lg border p-4 space-y-4">
      <h3 className="font-semibold text-gray-700">Filters</h3>

      {/* Remote Only */}
      <label className="flex items-center gap-2 cursor-pointer">
        <input
          type="checkbox"
          checked={localFilters.remoteOnly || false}
          onChange={(e) => updateFilter("remoteOnly", e.target.checked)}
          className="rounded"
        />
        <span className="text-sm">Remote only</span>
      </label>

      {/* Salary Range */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Min Salary</label>
        <input
          type="number"
          value={localFilters.salaryMin || ""}
          onChange={(e) => updateFilter("salaryMin", e.target.value ? Number(e.target.value) : undefined)}
          placeholder="e.g. 150000"
          className="w-full px-3 py-2 border rounded text-sm"
        />
      </div>

      {/* Job Types */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Job Type</label>
        <div className="space-y-1">
          {["full-time", "part-time", "contract", "intern"].map((type) => (
            <label key={type} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.jobTypes?.includes(type) || false}
                onChange={(e) => {
                  const types = localFilters.jobTypes || [];
                  if (e.target.checked) {
                    updateFilter("jobTypes", [...types, type]);
                  } else {
                    updateFilter("jobTypes", types.filter(t => t !== type));
                  }
                }}
                className="rounded"
              />
              <span className="text-sm capitalize">{type}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Experience Levels */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Experience Level</label>
        <div className="space-y-1">
          {["entry", "mid", "senior", "staff", "principal"].map((level) => (
            <label key={level} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={localFilters.experienceLevels?.includes(level) || false}
                onChange={(e) => {
                  const levels = localFilters.experienceLevels || [];
                  if (e.target.checked) {
                    updateFilter("experienceLevels", [...levels, level]);
                  } else {
                    updateFilter("experienceLevels", levels.filter(l => l !== level));
                  }
                }}
                className="rounded"
              />
              <span className="text-sm capitalize">{level}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Posted Within */}
      <div>
        <label className="block text-sm text-gray-600 mb-1">Posted Within</label>
        <select
          value={localFilters.postedWithinDays || ""}
          onChange={(e) => updateFilter("postedWithinDays", e.target.value ? Number(e.target.value) : undefined)}
          className="w-full px-3 py-2 border rounded text-sm"
        >
          <option value="">Any time</option>
          <option value="1">24 hours</option>
          <option value="3">3 days</option>
          <option value="7">7 days</option>
          <option value="14">14 days</option>
          <option value="30">30 days</option>
        </select>
      </div>

      {/* Clear Filters */}
      <button
        onClick={() => {
          setLocalFilters({});
          onChange({});
        }}
        className="w-full py-2 text-sm text-gray-600 border rounded hover:bg-gray-50"
      >
        Clear All Filters
      </button>
    </div>
  );
}
