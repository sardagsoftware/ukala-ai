export type StoryboardFrame = { url: string; caption: string };

export async function generateStoryboardFrames({
  prompt,
  n = 4,
}: { prompt: string; n?: number }): Promise<StoryboardFrame[]> {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");

  const body = {
    model: "gpt-image-1",
    prompt: `Cinematic storyboard frames, high detail, film lighting. Scene: ${prompt}. Return ${n} distinct key moments.`,
    size: "1024x576",
    n,
  };

  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${apiKey}`
    },
    body: JSON.stringify(body),
  });

  if (!res.ok) {
    const txt = await res.text();
    throw new Error(`OpenAI image error ${res.status}: ${txt}`);
  }
  const json = await res.json();
  return (json.data || []).map((d: any, i: number) => ({
    url: d.url ?? `data:image/png;base64,${d.b64_json}`,
    caption: `Frame ${i + 1}`,
  }));
}