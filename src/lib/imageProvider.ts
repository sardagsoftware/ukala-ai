export type StoryboardFrame = { url: string; caption: string };

function svgPlaceholder(caption: string, idx: number): string {
  const w = 1024, h = 576;
  const bg = ["#111827","#0b132b","#1f1d2b","#0f172a","#111111"][idx % 5];
  const fg = "#e5e7eb";
  const text = caption.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;");
  const svg =
    `<svg xmlns="http://www.w3.org/2000/svg" width="${w}" height="${h}">
      <defs>
        <linearGradient id="g" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="#9333ea" stop-opacity="0.25"/>
          <stop offset="50%" stop-color="#06b6d4" stop-opacity="0.25"/>
          <stop offset="100%" stop-color="#10b981" stop-opacity="0.20"/>
        </linearGradient>
      </defs>
      <rect width="100%" height="100%" fill="${bg}"/>
      <rect width="100%" height="100%" fill="url(#g)"/>
      <g fill="${fg}">
        <text x="52" y="96" font-family="monospace" font-size="42" opacity="0.85">ukala.ai — placeholder</text>
        <text x="52" y="160" font-family="sans-serif" font-size="36" opacity="0.9">Frame ${idx+1}</text>
        <foreignObject x="52" y="200" width="${w-104}" height="${h-240}">
          <div xmlns="http://www.w3.org/1999/xhtml"
               style="font-family: sans-serif; font-size: 28px; color: ${fg}; opacity:.9; line-height:1.35;">
            ${text}
          </div>
        </foreignObject>
      </g>
    </svg>`;
  const enc = encodeURIComponent(svg).replace(/'/g,"%27").replace(/"/g,"%22");
  return `data:image/svg+xml;charset=utf-8,${enc}`;
}

async function tryOpenAI(prompt: string, n: number) {
  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) throw new Error("OPENAI_API_KEY missing");
  const body = {
    model: "gpt-image-1",
    prompt: `Cinematic storyboard frames, high detail, film lighting. Scene: ${prompt}. Return ${n} distinct key moments.`,
    size: "auto",
    n,
  };
  const res = await fetch("https://api.openai.com/v1/images/generations", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${apiKey}` },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const text = await res.text().catch(()=> "");
    const err = new Error(`OpenAI image error ${res.status}: ${text}`);
    // Kritik limit hataları için fallback'e izin ver
    (err as any).__fallback = /billing_hard_limit_reached|insufficient_quota|invalid_api_key/i.test(text);
    throw err;
  }
  const json = await res.json();
  return (json.data || []).map((d: any, i: number) => ({
    url: d.url ?? `data:image/png;base64,${d.b64_json}`,
    caption: `Frame ${i + 1}`,
  })) as StoryboardFrame[];
}

export async function generateStoryboardFrames({
  prompt,
  n = 4,
}: { prompt: string; n?: number }): Promise<StoryboardFrame[]> {
  try {
    return await tryOpenAI(prompt, n);
  } catch (e: any) {
    if (e?.__fallback) {
      // Yumuşak düşüş: SVG placeholder üret
      const frames: StoryboardFrame[] = Array.from({ length: n }).map((_, i) => ({
        url: svgPlaceholder(prompt, i),
        caption: `Frame ${i + 1} (fallback)`,
      }));
      return frames;
    }
    throw e; // Diğer hatalarda gerçek hatayı yükselt
  }
}
