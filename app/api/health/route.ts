import { NextResponse } from "next/server";
import { registry } from "@/lib/sources";

export async function GET() {
  const sourceHealth = await registry.healthCheckAll();
  const enabledSources = registry.getEnabled().map((s) => s.name);

  return NextResponse.json({
    status: "ok",
    timestamp: new Date().toISOString(),
    sources: {
      enabled: enabledSources,
      health: sourceHealth,
    },
  });
}
