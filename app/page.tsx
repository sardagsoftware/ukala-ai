"use client";
import { useState } from "react";

export default function Home() {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(300); // default 5dk
  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function submit() {
    setBusy(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, prompt, targetDurationSec: Number(duration) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(json?.error ?? "Bilinmeyen hata");
      setResult(json);
    } catch (e: any) {
      setError(e.message);
    } finally {
      setBusy(false);
    }
  }

  return (
    <main className="min-h-screen p-6">
      <div className="max-w-3xl mx-auto space-y-6">
        <h1 className="text-3xl font-bold tracking-tight">ukala.ai — AI Director MVP</h1>
        <p className="text-sm opacity-70">Prompt → storyboard → video. Üret, izle, yinele.</p>

        <div className="grid gap-3">
          <input
            className="bg-zinc-900 rounded-xl p-3"
            placeholder="Proje başlığı"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
          <textarea
            className="bg-zinc-900 rounded-xl p-3 h-40"
            placeholder="Sahne açıklaması / prompt"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
          />
          <input
            type="number"
            className="bg-zinc-900 rounded-xl p-3"
            placeholder="Süre (sn) — örn 300 = 5 dk"
            value={duration}
            onChange={(e) => setDuration(Number(e.target.value))}
            min={10}
            max={1200}
          />
          <button
            onClick={submit}
            disabled={busy}
            className="rounded-2xl px-4 py-3 bg-white text-black font-semibold disabled:opacity-50"
          >
            {busy ? "Üretiliyor..." : "Storyboard üret"}
          </button>
        </div>

        {error && <div className="text-red-400 text-sm">{error}</div>}

        {result?.storyboard && (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mt-6">
            {result.storyboard.map((f: any, i: number) => (
              <figure key={i} className="bg-zinc-900 rounded-xl p-3">
                <img src={f.url} alt={f.caption} className="rounded-lg w-full h-auto" />
                <figcaption className="text-xs mt-2 opacity-70">{f.caption}</figcaption>
              </figure>
            ))}
          </div>
        )}

        {result?.beats && (
          <div className="mt-6 bg-zinc-900 rounded-xl p-4">
            <h2 className="font-semibold mb-2">Beat-sheet</h2>
            <ul className="text-sm space-y-1">
              {result.beats.map((b: any) => (
                <li key={b.index}>
                  #{b.index + 1} — {b.startSec}s / {b.durationSec}s — {b.caption}
                </li>
              ))}
            </ul>
            <p className="text-xs opacity-60 mt-2">Hedef süre: {result.targetDurationSec}s</p>
          </div>
        )}
      </div>
    </main>
  );
}