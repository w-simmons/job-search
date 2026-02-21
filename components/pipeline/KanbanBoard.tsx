"use client";

import { KanbanColumn } from "./KanbanColumn";
import { PIPELINE_STAGES, type Job, type JobInteraction, type PipelineStage } from "@/lib/db/schema";

interface JobWithInteraction {
  job: Job;
  interaction?: JobInteraction;
}

interface KanbanBoardProps {
  jobs: JobWithInteraction[];
  onMove?: (jobId: number, stage: string) => void;
  onRemove?: (jobId: number) => void;
}

export function KanbanBoard({ jobs, onMove, onRemove }: KanbanBoardProps) {
  // Group jobs by pipeline stage
  const jobsByStage = PIPELINE_STAGES.reduce((acc, stage) => {
    acc[stage] = jobs.filter(({ interaction }) => interaction?.pipelineStage === stage);
    return acc;
  }, {} as Record<PipelineStage, JobWithInteraction[]>);

  return (
    <div className="flex gap-4 overflow-x-auto pb-4">
      {PIPELINE_STAGES.map((stage) => (
        <KanbanColumn
          key={stage}
          stage={stage}
          items={jobsByStage[stage] || []}
          onMove={onMove}
          onRemove={onRemove}
        />
      ))}
    </div>
  );
}
