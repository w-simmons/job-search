import { db, jobs, jobInteractions, PIPELINE_STAGES, isNotNull, type Job, type JobInteraction } from "@/lib/db";
import { KanbanBoard } from "@/components/pipeline";
import Link from "next/link";

async function getPipelineJobs() {
  // Get all interactions with a pipeline stage
  const interactions = await db
    .select()
    .from(jobInteractions)
    .where(isNotNull(jobInteractions.pipelineStage));

  if (interactions.length === 0) {
    return [];
  }

  // Get the job IDs
  const jobIds = interactions.map((i: JobInteraction) => i.jobId);

  // Get all those jobs (simplified query)
  const pipelineJobs = await db.select().from(jobs);

  // Filter to only pipeline jobs and combine with interactions
  return pipelineJobs
    .filter((job: Job) => jobIds.includes(job.id))
    .map((job: Job) => ({
      job,
      interaction: interactions.find((i: JobInteraction) => i.jobId === job.id),
    }));
}

export default async function PipelinePage() {
  const pipelineJobs = await getPipelineJobs();

  const totalJobs = pipelineJobs.length;
  const appliedCount = pipelineJobs.filter(
    (j: { job: Job; interaction?: JobInteraction }) => j.interaction?.pipelineStage === "applied"
  ).length;
  const interviewingCount = pipelineJobs.filter(
    (j: { job: Job; interaction?: JobInteraction }) => j.interaction?.pipelineStage === "interviewing"
  ).length;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-start">
        <div>
          <h2 className="text-xl font-bold text-gray-800">Pipeline 📋</h2>
          <p className="text-gray-600">
            Track your job applications through the process.
          </p>
        </div>
        <div className="flex gap-6 text-sm">
          <div className="text-center">
            <p className="text-2xl font-bold text-gray-800">{totalJobs}</p>
            <p className="text-gray-500">Total</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-yellow-600">{appliedCount}</p>
            <p className="text-gray-500">Applied</p>
          </div>
          <div className="text-center">
            <p className="text-2xl font-bold text-purple-600">{interviewingCount}</p>
            <p className="text-gray-500">Interviewing</p>
          </div>
        </div>
      </div>

      {pipelineJobs.length > 0 ? (
        <KanbanBoard jobs={pipelineJobs} />
      ) : (
        <div className="text-center py-16 bg-white rounded-lg border">
          <p className="text-4xl mb-4">📋</p>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            Your pipeline is empty
          </h3>
          <p className="text-gray-600 mb-4">
            Add jobs to your pipeline to track your applications.
          </p>
          <Link
            href="/jobs"
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Browse Jobs →
          </Link>
        </div>
      )}
    </div>
  );
}
