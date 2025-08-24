"use client";
import { useEffect, useMemo, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import BeatTimeline, { useBeatEnergy } from "./components/BeatTimeline";
import CinematicBG from "./components/CinematicBG";
import BackdropFX from "./components/BackdropFX";
import ErrorBoundary from "./components/ErrorBoundary";
import ProField from "./components/ProField";
import ProTextarea from "./components/ProTextarea";

const CharacterViewer = dynamic(()=>import("./(scene)/CharacterViewer"), { ssr:false });

export default function Home(){
  const [title,setTitle]=useState("");
  const [prompt,setPrompt]=useState("");
  const [duration,setDuration]=useState(300);
  const [result,setResult]=useState<any>(null);
  const [busy,setBusy]=useState(false);
  const [error,setError]=useState<string|null>(null);
  const { trigger } = useBeatEnergy();

  const def=(process.env.NEXT_PUBLIC_SCENE_MODE||"VIDEO") as "VIDEO"|"R3F";
  const [sceneMode,setSceneMode]=useState<"VIDEO"|"R3F">(def);
  useEffect(()=>{ const v=localStorage.getItem("sceneMode") as any; if(v) setSceneMode(v); },[]);
  useEffect(()=>{ localStorage.setItem("sceneMode",sceneMode); },[sceneMode]);

  const durationHelp = useMemo(()=>{
    const d = Number(duration||0);
    const m = Math.max(0, Math.floor(d/60));
    const s = Math.max(0, d%60);
    return `Hedef süre: ${m} dk ${s} sn • Beat-sheet otomatik oluşturulur. Örn: 300 = 5 dk.`;
  },[duration]);

  async function submit(){
    setBusy(true); setError(null); setResult(null);
    try{
      const r=await fetch("/api/generate",{method:"POST",headers:{"Content-Type":"application/json"},
        body:JSON.stringify({title,prompt,targetDurationSec:Number(duration)})});
      const j=await r.json(); if(!r.ok) throw new Error(typeof j?.error==="string"?j.error:"Bilinmeyen hata");
      setResult(j);
    }catch(e:any){ setError(e.message); } finally{ setBusy(false); }
  }

  const hasFallback=!!result?.storyboard?.some((f:any)=>String(f.caption).includes("(fallback)")||String(f.caption).includes("(placeholder)"));

  return (
    <main className="min-h-screen relative">
      <ErrorBoundary>
        {sceneMode==="R3F" ? <CharacterViewer/> : <CinematicBG/>}
        <BackdropFX/>

        <div className="fixed top-4 right-4 z-50 glass flex items-center gap-2 px-3 py-2">
          <span className="text-[11px] opacity-80">Scene</span>
          <button onClick={()=>setSceneMode("VIDEO")} className={`tag ${sceneMode==="VIDEO"?"tag-active":""}`}>VIDEO</button>
          <button onClick={()=>setSceneMode("R3F")} className={`tag ${sceneMode==="R3F"?"tag-active":""}`}>R3F</button>
        </div>

        <div className="relative z-10 max-w-5xl mx-auto p-6 md:p-10">
          <div className="panel grid gap-6">
            <ProField
              label="Proje adı"
              placeholder="Örn: Neon şehir – yağmur altında kovalamaca"
              value={title}
              onChange={setTitle}
            />
            <ProTextarea
              label="Senaryo / Prompt"
              placeholder="Hikâyeyi, atmosferi ve görsel stili yaz… (örn: sinematik ışık, volumetrik sis, 35mm lens, noir)"
              value={prompt}
              onChange={setPrompt}
              rows={8}
            />

            <div className="grid sm:grid-cols-[200px_1fr] gap-4 items-end">
              <div>
                <ProField
                  label="Süre (sn)"
                  placeholder="300"
                  value={duration}
                  onChange={(v)=>setDuration(Number(v||0))}
                  type="number"
                  help={durationHelp}
                />
              </div>

              <motion.button onClick={submit} disabled={busy}
                className="btn-pro"
                whileTap={{scale:.98}}>
                <img src="/icons/storyboard.svg" alt="" className="h-[18px] w-[18px] mr-2" />
                <span className="btn-pro__label">{busy?"Üretiliyor…":"Storyboard ÜRET"}</span>
                <span className="btn-pro__glow" aria-hidden="true"></span>
              </motion.button>
            </div>

            {error && <div className="alert-error">{error}</div>}
            {hasFallback && <div className="alert-warn">Üretimler şu an sınırlı modda. Görseller placeholder/fallback ile verildi.</div>}
          </div>

          {result?.storyboard && (
            <div className="panel p-4 mt-8">
              <h2 className="hud-title text-lg font-semibold mb-2">Storyboard</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {result.storyboard.map((f:any,i:number)=>(
                  <figure key={i} className="card">
                    <img src={f.url} alt={f.caption} className="w-full h-40 object-cover"/>
                    <figcaption className="text-xs opacity-80 p-2">{f.caption}</figcaption>
                  </figure>
                ))}
              </div>
            </div>
          )}

          {result?.beats && (
            <div className="panel p-4 mt-6">
              <h2 className="hud-title text-lg font-semibold mb-2">Beat-sheet Timeline</h2>
              <BeatTimeline beats={result.beats} total={result.targetDurationSec} onPulse={trigger}/>
            </div>
          )}
        </div>
      </ErrorBoundary>
    </main>
  );
}
