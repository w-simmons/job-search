import { NextRequest, NextResponse } from "next/server";
import { db, jobs } from "@/lib/db";
import { desc, ilike, or, and, eq, SQL } from "drizzle-orm";

export async function GET(request: NextRequest) {
  const searchParams = request.nextUrl.searchParams;
  const query = searchParams.get("q");
  const source = searchParams.get("source");
  const remote = searchParams.get("remote");
  const limit = Math.min(parseInt(searchParams.get("limit") || "50"), 100);
  const offset = parseInt(searchParams.get("offset") || "0");

  try {
    const conditions: SQL[] = [];

    if (query) {
      const orCondition = or(
        ilike(jobs.title, `%${query}%`),
        ilike(jobs.company, `%${query}%`),
        ilike(jobs.description, `%${query}%`)
      );
      if (orCondition) conditions.push(orCondition);
    }

    if (source) {
      conditions.push(eq(jobs.source, source));
    }

    if (remote === "true") {
      conditions.push(eq(jobs.isRemote, true));
    }

    const results = await db
      .select()
      .from(jobs)
      .where(conditions.length > 0 ? and(...conditions) : undefined)
      .orderBy(desc(jobs.scrapedAt))
      .limit(limit)
      .offset(offset);

    return NextResponse.json({
      jobs: results,
      pagination: {
        limit,
        offset,
        hasMore: results.length === limit,
      },
    });
  } catch (error) {
    console.error("Error fetching jobs:", error);
    return NextResponse.json(
      { error: "Failed to fetch jobs" },
      { status: 500 }
    );
  }
}
