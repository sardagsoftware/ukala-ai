import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { renders } from "@/../db/schema";
import { eq } from "drizzle-orm";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  const { renderId } = await req.json();
  if (!renderId) return NextResponse.json({ error: "renderId required" }, { status: 400 });
  const [r] = await db.select().from(renders).where(eq(renders.id, renderId)).limit(1);
  return NextResponse.json({ status: r?.status, videoUrl: r?.videoUrl, error: r?.error });
}