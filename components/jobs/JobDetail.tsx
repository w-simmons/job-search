import type { Job } from "@/lib/db/schema";

interface JobDetailProps {
  job: Job;
}

export function JobDetail({ job }: JobDetailProps) {
  const postedDate = job.postedAt 
    ? new Date(job.postedAt).toLocaleDateString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      })
    : "Unknown";

  return (
    <article className="bg-white rounded-lg border p-6">
      {/* Header */}
      <header className="border-b pb-6 mb-6">
        <h1 className="text-2xl font-bold text-gray-900">{job.title}</h1>
        <p className="text-lg text-gray-700 mt-1">{job.company}</p>
        <p className="text-gray-500">{job.location}</p>

        <div className="mt-4 flex flex-wrap gap-2">
          {job.isRemote && (
            <span className="px-3 py-1 bg-green-100 text-green-700 text-sm rounded-full">
              Remote
            </span>
          )}
          {job.isHybrid && (
            <span className="px-3 py-1 bg-yellow-100 text-yellow-700 text-sm rounded-full">
              Hybrid
            </span>
          )}
          {job.jobType && (
            <span className="px-3 py-1 bg-blue-100 text-blue-700 text-sm rounded-full capitalize">
              {job.jobType}
            </span>
          )}
          {job.experienceLevel && (
            <span className="px-3 py-1 bg-purple-100 text-purple-700 text-sm rounded-full capitalize">
              {job.experienceLevel}
            </span>
          )}
        </div>

        {job.salary && (
          <p className="mt-4 text-lg font-semibold text-green-600">
            💰 {job.salary}
          </p>
        )}
      </header>

      {/* Actions */}
      <div className="flex gap-3 mb-6">
        <a
          href={job.url}
          target="_blank"
          rel="noopener noreferrer"
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
        >
          Apply Now →
        </a>
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
          ⭐ Save
        </button>
        <button className="px-4 py-2 border rounded-lg hover:bg-gray-50 transition-colors">
          📋 Add to Pipeline
        </button>
      </div>

      {/* Skills */}
      {job.skills && job.skills.length > 0 && (
        <section className="mb-6">
          <h2 className="font-semibold text-gray-700 mb-2">Required Skills</h2>
          <div className="flex flex-wrap gap-2">
            {job.skills.map((skill, i) => (
              <span
                key={i}
                className="px-3 py-1 bg-gray-100 text-gray-700 text-sm rounded-full"
              >
                {skill}
              </span>
            ))}
          </div>
        </section>
      )}

      {/* Description */}
      <section className="prose prose-gray max-w-none">
        <h2 className="font-semibold text-gray-700 mb-2">Job Description</h2>
        <div className="whitespace-pre-wrap text-gray-600">
          {job.description || "No description available."}
        </div>
      </section>

      {/* Meta */}
      <footer className="mt-8 pt-4 border-t text-sm text-gray-400">
        <p>Posted: {postedDate}</p>
        <p>Source: {job.source}</p>
        <p>Job ID: {job.externalId}</p>
      </footer>
    </article>
  );
}
