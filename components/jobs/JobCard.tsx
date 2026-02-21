import Link from "next/link";
import type { Job } from "@/lib/db/schema";

interface JobCardProps {
  job: Job;
  showActions?: boolean;
  onSave?: (jobId: number) => void;
  onHide?: (jobId: number) => void;
}

export function JobCard({ job, showActions = true, onSave, onHide }: JobCardProps) {
  const postedDate = job.postedAt 
    ? new Date(job.postedAt).toLocaleDateString()
    : "Unknown";

  return (
    <div className="bg-white rounded-lg border p-4 hover:shadow-md transition-shadow">
      <div className="flex justify-between items-start">
        <div className="flex-1">
          <Link 
            href={`/jobs/${job.id}`}
            className="text-lg font-semibold text-blue-600 hover:underline"
          >
            {job.title}
          </Link>
          <p className="text-gray-700 font-medium">{job.company}</p>
          <p className="text-gray-500 text-sm">{job.location}</p>
        </div>
        
        {showActions && (
          <div className="flex gap-2">
            <button 
              onClick={() => onSave?.(job.id)}
              className="p-2 text-gray-400 hover:text-yellow-500 transition-colors"
              title="Save job"
            >
              ⭐
            </button>
            <button 
              onClick={() => onHide?.(job.id)}
              className="p-2 text-gray-400 hover:text-gray-600 transition-colors"
              title="Hide job"
            >
              ✕
            </button>
          </div>
        )}
      </div>

      <div className="mt-3 flex flex-wrap gap-2">
        {job.isRemote && (
          <span className="px-2 py-1 bg-green-100 text-green-700 text-xs rounded-full">
            Remote
          </span>
        )}
        {job.jobType && (
          <span className="px-2 py-1 bg-blue-100 text-blue-700 text-xs rounded-full capitalize">
            {job.jobType}
          </span>
        )}
        {job.experienceLevel && (
          <span className="px-2 py-1 bg-purple-100 text-purple-700 text-xs rounded-full capitalize">
            {job.experienceLevel}
          </span>
        )}
        {job.salary && (
          <span className="px-2 py-1 bg-gray-100 text-gray-700 text-xs rounded-full">
            {job.salary}
          </span>
        )}
      </div>

      {job.skills && job.skills.length > 0 && (
        <div className="mt-3 flex flex-wrap gap-1">
          {job.skills.slice(0, 5).map((skill, i) => (
            <span 
              key={i}
              className="px-2 py-0.5 bg-gray-50 text-gray-600 text-xs rounded"
            >
              {skill}
            </span>
          ))}
          {job.skills.length > 5 && (
            <span className="px-2 py-0.5 text-gray-400 text-xs">
              +{job.skills.length - 5} more
            </span>
          )}
        </div>
      )}

      <div className="mt-3 flex justify-between items-center text-xs text-gray-400">
        <span>via {job.source}</span>
        <span>Posted {postedDate}</span>
      </div>
    </div>
  );
}
