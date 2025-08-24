import { put } from "@vercel/blob";

export async function persistImageFromUrl(imageUrl: string) {
  const r = await fetch(imageUrl);
  if (!r.ok) throw new Error("fetch image failed");
  const buf = Buffer.from(await r.arrayBuffer());
  const { url } = await put(`storyboards/${Date.now()}-${Math.random()}.png`, buf, {
    access: "public",
    contentType: "image/png",
  });
  return url;
}