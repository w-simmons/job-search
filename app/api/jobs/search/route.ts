import { NextRequest, NextResponse } from "next/server";
import { registry, type SearchParams } from "@/lib/sources";
import { db, jobs } from "@/lib/db";
import { eq, and } from "drizzle-orm";

/**
 * POST /api/jobs/search
 *
 * Triggers a search across all enabled job sources and stores results.
 * This is the main endpoint for fetching fresh job data.
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const params: SearchParams = {
      query: body.query,
      location: body.location,
      remote: body.remote,
      jobType: body.jobType,
      experienceLevel: body.experienceLevel,
      salaryMin: body.salaryMin,
      postedWithin: body.postedWithin,
      limit: body.limit || 50,
    };

    // Search all enabled sources
    const results = await registry.searchAll(params);

    // Upsert results to database
    let inserted = 0;
    let updated = 0;

    for (const job of results) {
      const existing = await db
        .select({ id: jobs.id })
        .from(jobs)
        .where(
          and(
            eq(jobs.source, "unknown"), // TODO: Add source to RawJobListing
            eq(jobs.externalId, job.externalId)
          )
        )
        .limit(1);

      if (existing.length === 0) {
        await db.insert(jobs).values({
          externalId: job.externalId,
          source: "unknown", // TODO: Track source properly
          title: job.title,
          company: job.company,
          location: job.location,
          salary: job.salary,
          salaryMin: job.salaryMin,
          salaryMax: job.salaryMax,
          description: job.description,
          url: job.url,
          postedAt: job.postedAt,
          isRemote: job.isRemote,
          jobType: job.jobType,
          experienceLevel: job.experienceLevel,
          skills: job.skills,
          raw: job.raw as Record<string, unknown>,
        });
        inserted++;
      } else {
        updated++;
      }
    }

    return NextResponse.json({
      success: true,
      totalFound: results.length,
      inserted,
      updated,
    });
  } catch (error) {
    console.error("Error searching jobs:", error);
    return NextResponse.json(
      { error: "Search failed" },
      { status: 500 }
    );
  }
}
