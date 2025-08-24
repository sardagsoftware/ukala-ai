"use client";
import { useState, useMemo } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import AICharacter from "./components/AICharacter";
import BeatTimeline, { useBeatEnergy } from "./components/BeatTimeline";

const HeroScene = dynamic(() => import("./(scene)/HeroScene"), { ssr: false });

const PRESETS: Record<string, string[]> = {
  Cyberpunk: ["#00E5FF", "#FF00C8", "#7DF9FF"],
  Noir: ["#8D99AE", "#EDF2F4", "#2B2D42"],
  Nature: ["#34D399", "#10B981", "#A7F3D0"],
  Anime: ["#60A5FA", "#F472B6", "#FBBF24"],
};

export default function Home() {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(300);
  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [palette, setPalette] = useState<string[]>(PRESETS.Cyberpunk);
  const { energy, trigger } = useBeatEnergy();

  async function submit() {
    setBusy(true); setError(null); setResult(null);
    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title, prompt, targetDurationSec: Number(duration) }),
      });
      const json = await res.json();
      if (!res.ok) throw new Error(typeof json?.error === "string" ? json.error : "Bilinmeyen hata");
      setResult(json);
    } catch (e:any){ setError(e.message) } finally { setBusy(false) }
  }

  const hasFallback = !!result?.storyboard?.some((f:any)=> String(f.caption).includes("(fallback)") || String(f.caption).includes("(placeholder)"));

  return (
    <main className="min-h-screen p-6 relative">
      <HeroScene palette={palette} energy={energy}/>
      <div className="max-w-5xl mx-auto space-y-6 relative">
        <motion.h1 className="text-4xl font-bold tracking-tight drop-shadow"
          initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} transition={{ duration:.5 }}>
          ukala.ai — AI Director
        </motion.h1>
        <p className="text-sm opacity-90">Prompt → storyboard → video. 5 dk hedef süre, reaktif sahne, preset paletleri.</p>

        <div className="rounded-xl bg-black/40 border border-white/10 p-4 grid gap-3 backdrop-blur">
          <input className="bg-black/50 rounded-xl p-3 border border-white/10" placeholder="Proje başlığı" value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea className="bg-black/50 rounded-xl p-3 h-40 border border-white/10" placeholder="Sahne açıklaması / prompt" value={prompt} onChange={e=>setPrompt(e.target.value)} />
          <div className="flex flex-wrap items-center gap-3">
            <input type="number" className="bg-black/50 rounded-xl p-3 w-40 border border-white/10" placeholder="Süre (sn)" value={duration} onChange={e=>setDuration(Number(e.target.value))} min={10} max={1200} />
            <div className="flex flex-wrap gap-2 text-xs">
              {Object.keys(PRESETS).map(name=>(
                <button key={name} onClick={()=>setPalette(PRESETS[name])}
                  className="px-3 py-2 rounded-lg bg-white/10 border border-white/20 hover:bg-white/20 transition">
                  {name}
                </button>
              ))}
            </div>
          </div>
          <div className="flex items-center gap-4">
            <AICharacter />
            <motion.button onClick={submit} disabled={busy}
              className="rounded-2xl px-5 py-3 bg-white text-black font-semibold disabled:opacity-50"
              whileTap={{ scale: 0.98 }}>
              {busy ? "Üretiliyor..." : "Storyboard üret"}
            </motion.button>
          </div>
          {error && <div className="text-red-300 text-sm">{error}</div>}
          {hasFallback && (
            <div className="text-xs bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 px-3 py-2 rounded-lg">
              Üretimler şu an sınırlı modda (OpenAI erişimi bekleniyor). Görseller placeholder/fallback ile verildi.
            </div>
          )}
        </div>

        {result?.storyboard && (
          <div className="rounded-xl bg-black/40 border border-white/10 p-4 backdrop-blur">
            <h2 className="font-semibold mb-3">Storyboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {result.storyboard.map((f:any, i:number)=>(
                <figure key={i} className="rounded-xl overflow-hidden bg-black/50 border border-white/10">
                  <img src={f.url} alt={f.caption} className="w-full h-40 object-cover" />
                  <figcaption className="text-xs opacity-80 p-2">{f.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        {result?.beats && (
          <div className="rounded-xl bg-black/40 border border-white/10 p-4 backdrop-blur">
            <h2 className="font-semibold mb-3">Beat-sheet Timeline</h2>
            <BeatTimeline beats={result.beats} total={result.targetDurationSec} onPulse={trigger}/>
            <ul className="text-sm mt-3 grid sm:grid-cols-2 gap-2">
              {result.beats.map((b:any)=>(
                <li key={b.index} className="opacity-90">#{b.index+1} — {b.startSec}s / {b.durationSec}s — {b.caption}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </main>
  );
}
