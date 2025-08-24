import { NextRequest, NextResponse } from "next/server";
import { db } from "@/server/db";
import { projects, renders } from "@/../db/schema";
import { generateStoryboardFrames } from "@/lib/imageProvider";
import { persistImageFromUrl } from "@/lib/blob";
import { requestVideoRender } from "@/lib/videoProvider";
import { generateSchema } from "@/lib/types";
import { generateBeats } from "@/lib/beats";

export const runtime = "nodejs";

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const parsed = generateSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }
    const { title, prompt, targetDurationSec } = parsed.data;

    const [proj] = await db.insert(projects).values({ title, prompt }).returning();
    const frames = await generateStoryboardFrames({ prompt, n: 4 });

    const stored: { url: string; caption: string }[] = [];
    for (const f of frames) {
      const url = await persistImageFromUrl(f.url);
      stored.push({ url, caption: f.caption });
    }

    const beats = generateBeats(targetDurationSec, prompt);
    const storyboardJson = JSON.stringify({ frames: stored, beats });

    const [render] = await db.insert(renders).values({
      projectId: proj.id,
      status: "storyboarded",
      storyboardJson,
    }).returning();

    const webhookUrl = new URL("/api/webhook", req.nextUrl.origin).toString();
    requestVideoRender({ prompt, frames: stored, webhookUrl }).catch(() => {});

    return NextResponse.json({
      projectId: proj.id,
      renderId: render.id,
      storyboard: stored,
      beats,
      targetDurationSec
    });
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 });
  }
}