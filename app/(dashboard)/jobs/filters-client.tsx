"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { JobFilters, type FilterValues } from "@/components/jobs";
import { useCallback } from "react";

interface FiltersClientProps {
  initialParams: {
    q?: string;
    location?: string;
    remote?: string;
    salary?: string;
    level?: string;
    type?: string;
    company?: string;
    sort?: string;
  };
}

export function JobFiltersClient({ initialParams }: FiltersClientProps) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const filters: FilterValues = {
    query: initialParams.q || "",
    location: initialParams.location || "",
    remoteOnly: initialParams.remote === "true",
    salaryMin: initialParams.salary || "",
    experienceLevel: initialParams.level || "",
    jobType: initialParams.type || "",
    company: initialParams.company || "",
    sortBy: initialParams.sort || "recent",
  };

  const handleFilterChange = useCallback((newFilters: FilterValues) => {
    // Update URL params on change (not submit)
    // Could debounce this for better UX
  }, []);

  const handleSearch = useCallback(() => {
    const params = new URLSearchParams(searchParams);
    
    if (filters.query) params.set("q", filters.query);
    else params.delete("q");
    
    if (filters.location) params.set("location", filters.location);
    else params.delete("location");
    
    if (filters.remoteOnly) params.set("remote", "true");
    else params.delete("remote");
    
    if (filters.salaryMin) params.set("salary", filters.salaryMin);
    else params.delete("salary");
    
    if (filters.experienceLevel) params.set("level", filters.experienceLevel);
    else params.delete("level");
    
    if (filters.jobType) params.set("type", filters.jobType);
    else params.delete("type");
    
    if (filters.company) params.set("company", filters.company);
    else params.delete("company");
    
    if (filters.sortBy && filters.sortBy !== "recent") params.set("sort", filters.sortBy);
    else params.delete("sort");

    router.push(`/jobs?${params.toString()}`);
  }, [searchParams, filters, router]);

  return (
    <JobFilters
      filters={filters}
      onFilterChange={handleFilterChange}
      onSearch={handleSearch}
    />
  );
}
