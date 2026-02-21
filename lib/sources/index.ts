/**
 * Job Source Registry
 *
 * Central registry for all job source adapters.
 * New sources are registered here and can be enabled/disabled via config.
 */

export * from "./types";

import type { JobSourceAdapter, SearchParams, RawJobListing } from "./types";

class JobSourceRegistry {
  private sources: Map<string, JobSourceAdapter> = new Map();

  register(adapter: JobSourceAdapter): void {
    this.sources.set(adapter.name, adapter);
  }

  get(name: string): JobSourceAdapter | undefined {
    return this.sources.get(name);
  }

  getAll(): JobSourceAdapter[] {
    return Array.from(this.sources.values());
  }

  getEnabled(): JobSourceAdapter[] {
    return this.getAll().filter((s) => s.config.enabled);
  }

  async searchAll(params: SearchParams): Promise<RawJobListing[]> {
    const enabledSources = this.getEnabled();
    const results = await Promise.allSettled(
      enabledSources.map((source) => source.search(params))
    );

    const jobs: RawJobListing[] = [];
    for (const result of results) {
      if (result.status === "fulfilled") {
        jobs.push(...result.value);
      }
    }

    return jobs;
  }

  async healthCheckAll(): Promise<Record<string, boolean>> {
    const results: Record<string, boolean> = {};
    for (const source of this.getAll()) {
      results[source.name] = await source.healthCheck();
    }
    return results;
  }
}

export const registry = new JobSourceRegistry();

// Source adapters will be registered here as they're built
// Example:
// import { LinkedInSource } from './linkedin';
// registry.register(new LinkedInSource());
