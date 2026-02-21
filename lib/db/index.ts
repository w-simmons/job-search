import { neon } from "@neondatabase/serverless";
import { drizzle } from "drizzle-orm/neon-http";
import * as schema from "./schema";

// Create connection only when DATABASE_URL is available
// This allows builds to succeed without env vars
function createDb() {
  const url = process.env.DATABASE_URL;
  if (!url) {
    // Return a proxy that throws helpful errors at runtime
    return new Proxy({} as ReturnType<typeof drizzle<typeof schema>>, {
      get() {
        throw new Error(
          "DATABASE_URL environment variable is not set. " +
            "Please add it to your .env.local file."
        );
      },
    });
  }
  const sql = neon(url);
  return drizzle(sql, { schema });
}

export const db = createDb();

export * from "./schema";
