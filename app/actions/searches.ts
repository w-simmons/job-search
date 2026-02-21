"use server";

import { db, savedSearches, type SearchFilters } from "@/lib/db";
import { eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";

export async function createSavedSearch(data: {
  name: string;
  query: string;
  filters?: SearchFilters;
  frequency?: string;
  notifyEmail?: boolean;
}) {
  await db.insert(savedSearches).values({
    name: data.name,
    query: data.query,
    filters: data.filters,
    frequency: data.frequency || "daily",
    notifyEmail: data.notifyEmail || false,
    isActive: true,
  });

  revalidatePath("/searches");
  revalidatePath("/discover");
}

export async function toggleSavedSearch(id: number) {
  const [search] = await db
    .select()
    .from(savedSearches)
    .where(eq(savedSearches.id, id));

  if (search) {
    await db
      .update(savedSearches)
      .set({ isActive: !search.isActive })
      .where(eq(savedSearches.id, id));
  }

  revalidatePath("/searches");
}

export async function deleteSavedSearch(id: number) {
  await db.delete(savedSearches).where(eq(savedSearches.id, id));
  revalidatePath("/searches");
}

export async function runSavedSearch(id: number) {
  // Mark as run
  await db
    .update(savedSearches)
    .set({ lastRunAt: new Date() })
    .where(eq(savedSearches.id, id));

  // TODO: Actually run the search and find matching jobs
  // This would compare against the jobs table

  revalidatePath("/searches");
  revalidatePath("/discover");
}

export async function markSearchViewed(id: number) {
  await db
    .update(savedSearches)
    .set({ lastViewedAt: new Date(), newJobCount: 0 })
    .where(eq(savedSearches.id, id));

  revalidatePath("/searches");
  revalidatePath("/discover");
}
