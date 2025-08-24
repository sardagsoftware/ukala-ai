import { NextRequest, NextResponse } from "next/server";
export const runtime = "nodejs";
export async function POST(req: NextRequest) {
  const { clips } = await req.json().catch(()=> ({}));
  if (!Array.isArray(clips) || clips.length === 0) {
    return NextResponse.json({ error: "clips required" }, { status: 400 });
  }
  // TODO: ffmpeg'i dış worker/edge job ile çalıştırıp HLS/MP4 üret
  return NextResponse.json({ todo: true, reason: "ffmpeg not available in Vercel function – use external worker" }, { status: 501 });
}
