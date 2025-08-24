"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import BeatTimeline, { useBeatEnergy } from "./components/BeatTimeline";
import ErrorBoundary from "./components/ErrorBoundary";
import CinematicBG from "./components/CinematicBG";
import BackdropFX from "./components/BackdropFX";
const CharacterViewer = dynamic(()=>import("./(scene)/CharacterViewer"), { ssr:false });

export default function Home() {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [duration, setDuration] = useState(300);
  const [result, setResult] = useState<any>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { energy, trigger } = useBeatEnergy();

  // Scene mode (VIDEO default; R3F için /public/hero/char.glb gerekir)
  const defaultMode = (process.env.NEXT_PUBLIC_SCENE_MODE || "VIDEO") as "VIDEO" | "R3F";
  const [sceneMode, setSceneMode] = useState<"VIDEO"|"R3F">(defaultMode);
  useEffect(()=>{ const s=localStorage.getItem("sceneMode"); if(s) setSceneMode(s as any) },[]);
  useEffect(()=>{ localStorage.setItem("sceneMode",sceneMode) },[sceneMode]);

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
    <main className="min-h-screen relative"><ErrorBoundary>
      {sceneMode === "R3F" ? <CharacterViewer/> : <CinematicBG/>}
      <BackdropFX/>

      {/* Scene switcher */}
      <div className="fixed top-4 right-4 z-50 glass flex items-center gap-2 px-3 py-2">
        <span className="text-[11px] opacity-80">Scene</span>
        <button onClick={()=>setSceneMode("VIDEO")}
          className={`tag ${sceneMode==="VIDEO"?"tag-active":""}`}>VIDEO</button>
        <button onClick={()=>setSceneMode("R3F")}
          className={`tag ${sceneMode==="R3F"?"tag-active":""}`}>R3F</button>
      </div>

      <div className="relative z-10 max-w-6xl mx-auto p-6 md:p-10 space-y-8">
        {/* Üretim paneli */}
        <div className="panel grid gap-4">
          <input className="field" placeholder="Proje başlığı" value={title} onChange={e=>setTitle(e.target.value)} />
          <textarea className="field h-40" placeholder="Sahne açıklaması / prompt" value={prompt} onChange={e=>setPrompt(e.target.value)} />
          <div className="flex items-center gap-3">
            <input type="number" className="field w-36" placeholder="Süre (sn)" value={duration} onChange={e=>setDuration(Number(e.target.value))} min={10} max={1200} />
            <motion.button onClick={submit} disabled={busy}
              className="btn-primary"
              whileTap={{ scale: 0.98 }}>
              {busy ? "Üretiliyor..." : "Storyboard üret"}
              <span className="ripple" aria-hidden="true"></span>
            </motion.button>
          </div>
          {error && <div className="text-red-300 text-sm">{error}</div>}
          {hasFallback && (
            <div className="text-xs bg-yellow-500/10 border border-yellow-500/30 text-yellow-200 px-3 py-2 rounded-lg">
              Üretimler şu an sınırlı modda (OpenAI erişimi bekleniyor). Görseller placeholder/fallback ile verildi.
            </div>
          )}
        </div>

        {/* Çıktılar */}
        {result?.storyboard && (
          <div className="panel p-4">
            <h2 className="hud-title">Storyboard</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {result.storyboard.map((f:any, i:number)=>(
                <figure key={i} className="card">
                  <img src={f.url} alt={f.caption} className="w-full h-40 object-cover" />
                  <figcaption className="text-xs opacity-80 p-2">{f.caption}</figcaption>
                </figure>
              ))}
            </div>
          </div>
        )}

        {result?.beats && (
          <div className="panel p-4">
            <h2 className="hud-title">Beat-sheet Timeline</h2>
            <BeatTimeline beats={result.beats} total={result.targetDurationSec} onPulse={trigger}/>
          </div>
        )}
      </div>
    </main>
  );
}
