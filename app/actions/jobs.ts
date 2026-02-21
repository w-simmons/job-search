"use server";

import { db, jobs, jobInteractions, type PipelineStage } from "@/lib/db";
import { eq, and } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function saveJob(jobId: number) {
  await db.insert(jobInteractions).values({
    jobId,
    action: "saved",
  });
  revalidatePath("/jobs");
  revalidatePath("/shortlist");
}

export async function hideJob(jobId: number) {
  await db.insert(jobInteractions).values({
    jobId,
    action: "hidden",
  });
  revalidatePath("/jobs");
  revalidatePath("/discover");
}

export async function addToPipeline(jobId: number, stage: PipelineStage) {
  // Check if already in pipeline
  const existing = await db
    .select()
    .from(jobInteractions)
    .where(
      and(
        eq(jobInteractions.jobId, jobId),
        eq(jobInteractions.action, "pipeline")
      )
    )
    .limit(1);

  if (existing.length > 0) {
    // Update existing
    await db
      .update(jobInteractions)
      .set({ pipelineStage: stage, updatedAt: new Date() })
      .where(eq(jobInteractions.id, existing[0].id));
  } else {
    // Create new
    await db.insert(jobInteractions).values({
      jobId,
      action: "pipeline",
      pipelineStage: stage,
    });
  }

  revalidatePath("/pipeline");
  revalidatePath("/shortlist");
}

export async function movePipelineStage(jobId: number, newStage: PipelineStage) {
  await db
    .update(jobInteractions)
    .set({ pipelineStage: newStage, updatedAt: new Date() })
    .where(
      and(
        eq(jobInteractions.jobId, jobId),
        eq(jobInteractions.action, "pipeline")
      )
    );

  revalidatePath("/pipeline");
}

export async function removeFromPipeline(jobId: number) {
  await db
    .delete(jobInteractions)
    .where(
      and(
        eq(jobInteractions.jobId, jobId),
        eq(jobInteractions.action, "pipeline")
      )
    );

  revalidatePath("/pipeline");
}

export async function markApplied(jobId: number, appliedAt?: Date) {
  const existing = await db
    .select()
    .from(jobInteractions)
    .where(
      and(
        eq(jobInteractions.jobId, jobId),
        eq(jobInteractions.action, "pipeline")
      )
    )
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(jobInteractions)
      .set({
        pipelineStage: "applied",
        appliedAt: appliedAt || new Date(),
        updatedAt: new Date(),
      })
      .where(eq(jobInteractions.id, existing[0].id));
  } else {
    await db.insert(jobInteractions).values({
      jobId,
      action: "pipeline",
      pipelineStage: "applied",
      appliedAt: appliedAt || new Date(),
    });
  }

  revalidatePath("/pipeline");
}

export async function updateJobNotes(jobId: number, notes: string) {
  const existing = await db
    .select()
    .from(jobInteractions)
    .where(eq(jobInteractions.jobId, jobId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(jobInteractions)
      .set({ notes, updatedAt: new Date() })
      .where(eq(jobInteractions.id, existing[0].id));
  } else {
    await db.insert(jobInteractions).values({
      jobId,
      action: "viewed",
      notes,
    });
  }

  revalidatePath("/pipeline");
  revalidatePath(`/jobs/${jobId}`);
}

export async function rateJob(jobId: number, rating: number) {
  const existing = await db
    .select()
    .from(jobInteractions)
    .where(eq(jobInteractions.jobId, jobId))
    .limit(1);

  if (existing.length > 0) {
    await db
      .update(jobInteractions)
      .set({ rating, updatedAt: new Date() })
      .where(eq(jobInteractions.id, existing[0].id));
  } else {
    await db.insert(jobInteractions).values({
      jobId,
      action: "viewed",
      rating,
    });
  }

  revalidatePath("/pipeline");
}
