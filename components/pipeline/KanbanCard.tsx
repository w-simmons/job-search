import Link from "next/link";
import type { Job, JobInteraction } from "@/lib/db/schema";

interface KanbanCardProps {
  job: Job;
  interaction?: JobInteraction;
  onMove?: (jobId: number, stage: string) => void;
  onRemove?: (jobId: number) => void;
}

export function KanbanCard({ job, interaction, onRemove }: KanbanCardProps) {
  return (
    <div className="bg-white rounded-lg border p-3 shadow-sm hover:shadow-md transition-shadow cursor-grab active:cursor-grabbing">
      <div className="flex justify-between items-start">
        <Link 
          href={`/jobs/${job.id}`}
          className="font-medium text-sm text-blue-600 hover:underline line-clamp-2"
        >
          {job.title}
        </Link>
        <button 
          onClick={() => onRemove?.(job.id)}
          className="text-gray-400 hover:text-gray-600 text-xs ml-2"
          title="Remove from pipeline"
        >
          ✕
        </button>
      </div>
      
      <p className="text-sm text-gray-600 mt-1">{job.company}</p>
      
      {job.salary && (
        <p className="text-xs text-green-600 mt-1">{job.salary}</p>
      )}
      
      {interaction?.notes && (
        <p className="text-xs text-gray-500 mt-2 line-clamp-2 italic">
          "{interaction.notes}"
        </p>
      )}
      
      {interaction?.appliedAt && (
        <p className="text-xs text-gray-400 mt-2">
          Applied: {new Date(interaction.appliedAt).toLocaleDateString()}
        </p>
      )}
      
      {interaction?.rating && (
        <div className="mt-2">
          {"⭐".repeat(interaction.rating)}
        </div>
      )}
    </div>
  );
}
