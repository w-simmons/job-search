import { JobCard } from "./JobCard";
import type { Job } from "@/lib/db/schema";

interface JobListProps {
  jobs: Job[];
  onSave?: (jobId: number) => void;
  onHide?: (jobId: number) => void;
  emptyMessage?: string;
}

export function JobList({ 
  jobs, 
  onSave, 
  onHide, 
  emptyMessage = "No jobs found" 
}: JobListProps) {
  if (jobs.length === 0) {
    return (
      <div className="text-center py-12 text-gray-500">
        <p className="text-4xl mb-4">📭</p>
        <p>{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {jobs.map((job) => (
        <JobCard 
          key={job.id} 
          job={job} 
          onSave={onSave}
          onHide={onHide}
        />
      ))}
    </div>
  );
}
