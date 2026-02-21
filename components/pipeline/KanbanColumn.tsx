"use client";

import { KanbanCard } from "./KanbanCard";
import type { Job, JobInteraction, PipelineStage } from "@/lib/db/schema";

interface JobWithInteraction {
  job: Job;
  interaction?: JobInteraction;
}

interface KanbanColumnProps {
  stage: PipelineStage;
  items: JobWithInteraction[];
  onMove?: (jobId: number, stage: string) => void;
  onRemove?: (jobId: number) => void;
}

const stageConfig: Record<PipelineStage, { label: string; color: string; icon: string }> = {
  interested: { label: "Interested", color: "bg-blue-500", icon: "👀" },
  applied: { label: "Applied", color: "bg-yellow-500", icon: "📝" },
  interviewing: { label: "Interviewing", color: "bg-purple-500", icon: "🎤" },
  offer: { label: "Offer", color: "bg-green-500", icon: "🎉" },
  rejected: { label: "Rejected", color: "bg-gray-500", icon: "❌" },
};

export function KanbanColumn({ stage, items, onMove, onRemove }: KanbanColumnProps) {
  const config = stageConfig[stage];

  return (
    <div className="flex-1 min-w-[280px] max-w-[320px] bg-gray-100 rounded-lg p-3">
      <div className="flex items-center gap-2 mb-3">
        <div className={`w-3 h-3 rounded-full ${config.color}`} />
        <h3 className="font-semibold text-gray-700">{config.icon} {config.label}</h3>
        <span className="ml-auto text-sm text-gray-500 bg-white px-2 py-0.5 rounded-full">
          {items.length}
        </span>
      </div>
      
      <div className="space-y-2 min-h-[200px]">
        {items.map(({ job, interaction }) => (
          <KanbanCard
            key={job.id}
            job={job}
            interaction={interaction}
            onMove={onMove}
            onRemove={onRemove}
          />
        ))}
        
        {items.length === 0 && (
          <div className="text-center py-8 text-gray-400 text-sm">
            Drop jobs here
          </div>
        )}
      </div>
    </div>
  );
}
