export async function requestVideoRender({
  prompt,
  frames,
  webhookUrl,
}: {
  prompt: string;
  frames: { url: string; caption: string }[];
  webhookUrl: string;
}): Promise<{ jobId: string }> {
  const url = process.env.VIDEO_API_URL;
  const key = process.env.VIDEO_API_KEY;
  if (!url || !key) {
    // Demo stub: gerçek sağlayıcı yoksa bile UI çalışsın
    return { jobId: "stub-" + Date.now() };
  }
  const res = await fetch(url + "/render", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${key}`
    },
    body: JSON.stringify({ prompt, frames, webhookUrl }),
  });
  if (!res.ok) throw new Error("Video API failed");
  return res.json();
}