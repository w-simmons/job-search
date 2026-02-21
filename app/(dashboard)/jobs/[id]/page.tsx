import { db, jobs } from "@/lib/db";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import { JobDetail } from "@/components/jobs";
import Link from "next/link";

interface JobPageProps {
  params: Promise<{ id: string }>;
}

async function getJob(id: number) {
  const [job] = await db.select().from(jobs).where(eq(jobs.id, id));
  return job;
}

export default async function JobPage({ params }: JobPageProps) {
  const { id } = await params;
  const job = await getJob(Number(id));

  if (!job) {
    notFound();
  }

  return (
    <div className="max-w-4xl">
      <div className="mb-4">
        <Link
          href="/jobs"
          className="text-sm text-gray-500 hover:text-gray-700"
        >
          ← Back to Jobs
        </Link>
      </div>
      <JobDetail job={job} />
    </div>
  );
}
