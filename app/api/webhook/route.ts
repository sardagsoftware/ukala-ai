import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { renders } from "@/../db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { jobId, renderId, status, videoUrl, error } = await req.json();
  if (!renderId) return NextResponse.json({ ok: false }, { status: 400 });

  await db.update(renders).set({
    status: status || (videoUrl ? "ready" : "failed"),
    videoUrl: videoUrl || null,
    error: error || null,
    updatedAt: new Date(),
  }).where(eq(renders.id, renderId));

  return NextResponse.json({ ok: true });
}