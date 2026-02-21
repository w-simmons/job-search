/**
 * Job Source Adapter Interface
 *
 * Each job source (LinkedIn, Indeed, Greenhouse, etc.) implements this interface
 * to normalize job data from different APIs/scraping methods.
 */

export interface JobSourceConfig {
  name: string;
  enabled: boolean;
  rateLimit?: {
    requestsPerMinute: number;
  };
  credentials?: Record<string, string>;
}

export interface RawJobListing {
  externalId: string;
  title: string;
  company: string;
  location?: string;
  salary?: string;
  salaryMin?: number;
  salaryMax?: number;
  description?: string;
  url: string;
  postedAt?: Date;
  isRemote?: boolean;
  jobType?: string;
  experienceLevel?: string;
  skills?: string[];
  raw?: unknown;
}

export interface SearchParams {
  query: string;
  location?: string;
  remote?: boolean;
  jobType?: "full-time" | "part-time" | "contract" | "internship";
  experienceLevel?: "entry" | "mid" | "senior" | "executive";
  salaryMin?: number;
  postedWithin?: "24h" | "7d" | "30d";
  limit?: number;
}

export interface JobSourceAdapter {
  readonly name: string;
  readonly config: JobSourceConfig;

  /**
   * Search for jobs using the source's API or scraping method
   */
  search(params: SearchParams): Promise<RawJobListing[]>;

  /**
   * Get details for a specific job by its external ID
   */
  getJob?(externalId: string): Promise<RawJobListing | null>;

  /**
   * Health check for the source
   */
  healthCheck(): Promise<boolean>;
}

/**
 * Base class for job source adapters
 */
export abstract class BaseJobSource implements JobSourceAdapter {
  abstract readonly name: string;
  abstract readonly config: JobSourceConfig;

  abstract search(params: SearchParams): Promise<RawJobListing[]>;

  async getJob(_externalId: string): Promise<RawJobListing | null> {
    return null; // Override in subclasses that support this
  }

  async healthCheck(): Promise<boolean> {
    try {
      await this.search({ query: "test", limit: 1 });
      return true;
    } catch {
      return false;
    }
  }
}
